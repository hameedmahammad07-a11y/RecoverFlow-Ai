import { prisma } from '../prisma';
import { eventHub } from '../events/event-hub';
import { recoveryEngine } from './recovery-engine';

export interface CreatePaymentInput {
  merchantId?: string;
  customerId?: string;
  orderId?: string;
  amount: number;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';
  provider?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  failureReason?: string;
  isKnownCustomer?: boolean;
}

export class PaymentEngine {
  /**
   * Record a payment event and process downstream recovery workflows
   */
  async processPaymentEvent(input: CreatePaymentInput) {
    const merchantId = input.merchantId || 'mch_apex_01';

    // Verify existing payment or order status to prevent duplicate processing
    if (input.orderId) {
      const existingOrder = await prisma.order.findUnique({
        where: { id: input.orderId },
        include: { payments: true },
      });

      if (existingOrder && existingOrder.status === 'COMPLETED') {
        return {
          status: 'BLOCKED_DUPLICATE',
          message: 'Order has already been completed successfully. Double payment prevented.',
        };
      }
    }

    // Create Payment record
    const payment = await prisma.payment.create({
      data: {
        merchantId,
        customerId: input.customerId,
        orderId: input.orderId,
        amount: input.amount,
        currency: 'INR',
        paymentMethod: input.paymentMethod,
        provider: input.provider || 'Razorpay',
        status: input.status,
        failureReason: input.failureReason || null,
        recoveryValue: input.status === 'SUCCESS' ? input.amount : 0,
      },
      include: { customer: true, order: true },
    });

    // Record initial payment attempt
    await prisma.paymentAttempt.create({
      data: {
        paymentId: payment.id,
        attemptNumber: 1,
        status: input.status,
        responseCode: input.status === 'SUCCESS' ? '200_OK' : input.failureReason || 'ERR_UNKNOWN',
      },
    });

    // Create Audit log
    await prisma.auditLog.create({
      data: {
        merchantId,
        entityType: 'PAYMENT',
        entityId: payment.id,
        action: `PAYMENT_${input.status}`,
        details: `Payment of ₹${input.amount} via ${input.paymentMethod} set to ${input.status}.`,
      },
    });

    // Broadcast SSE event
    eventHub.broadcast(`payment.${input.status.toLowerCase()}` as any, {
      paymentId: payment.id,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      customerName: payment.customer?.name || 'Anonymous POS Customer',
      failureReason: payment.failureReason,
    });

    // Auto-trigger recovery workflow if FAILED and customer is known
    if (input.status === 'FAILED' && input.customerId) {
      // Execute in background
      setTimeout(() => {
        recoveryEngine.processRecovery(payment.id).catch(console.error);
      }, 500);
    }

    return payment;
  }

  /**
   * Mode 2 Instant Checkout Status Verification
   * Critical safety check to prevent double payments
   */
  async verifyInstantCheckoutStatus(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      return {
        verifiedState: 'NOT_FOUND',
        message: 'No transaction record found with this ID.',
        canPayAgain: false,
      };
    }

    if (payment.status === 'SUCCESS' || payment.status === 'RECOVERED') {
      return {
        verifiedState: 'SUCCESS',
        amount: payment.amount,
        message: 'Payment confirmed successfully. DO NOT ask customer to pay again.',
        canPayAgain: false,
      };
    }

    if (payment.status === 'PENDING') {
      return {
        verifiedState: 'PENDING',
        amount: payment.amount,
        message: 'Payment confirmation pending. Please wait while we verify with bank gateway.',
        canPayAgain: false,
      };
    }

    // Status is FAILED
    return {
      verifiedState: 'FAILED',
      amount: payment.amount,
      failureReason: payment.failureReason || 'Transaction rejected by issuing bank',
      message: 'Payment was not completed. You may select a retry option below.',
      canPayAgain: true,
      options: [
        'TRY_AGAIN_STATUS_CHECK',
        'GENERATE_NEW_PAYMENT_REQUEST',
        'SHOW_NEW_QR',
        'CHANGE_PAYMENT_METHOD',
        'CASH_OPTION',
      ],
    };
  }
}

export const paymentEngine = new PaymentEngine();
