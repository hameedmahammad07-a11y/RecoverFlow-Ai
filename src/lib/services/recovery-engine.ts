import { prisma } from '../prisma';
import { eventHub } from '../events/event-hub';
import { communicationService } from './communication-providers';

export interface EligibilityResult {
  eligible: boolean;
  score: number;
  reason: string;
  recommendedChannel: 'WHATSAPP' | 'SMS' | 'EMAIL';
}

export class RecoveryEngine {
  /**
   * Check whether a failed payment is eligible for recovery workflow execution
   */
  async checkEligibility(paymentId: string): Promise<EligibilityResult> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        customer: true,
        order: true,
        merchant: true,
        recoveryWorkflow: true,
      },
    });

    if (!payment) {
      return { eligible: false, score: 0, reason: 'Payment record not found', recommendedChannel: 'WHATSAPP' };
    }

    // Rule 1: Check if payment is already successful or recovered
    if (payment.status === 'SUCCESS' || payment.status === 'RECOVERED') {
      return { eligible: false, score: 0, reason: 'Payment is already completed or recovered', recommendedChannel: 'WHATSAPP' };
    }

    // Rule 2: If status is PENDING, wait and do NOT execute messaging to prevent double charge
    if (payment.status === 'PENDING') {
      return { eligible: false, score: 0, reason: 'Payment is currently PENDING verification', recommendedChannel: 'WHATSAPP' };
    }

    // Rule 3: Check Order Validity
    if (payment.order && (payment.order.status === 'CANCELLED' || payment.order.status === 'COMPLETED')) {
      return { eligible: false, score: 0, reason: `Order status is ${payment.order.status}`, recommendedChannel: 'WHATSAPP' };
    }

    // Rule 4: Check Customer Presence
    if (!payment.customer) {
      return { eligible: false, score: 0, reason: 'No known customer contact available (Mode 2 Instant Checkout applies)', recommendedChannel: 'WHATSAPP' };
    }

    // Rule 5: Check Customer Opt-Out / Consent
    if (payment.customer.consentOptOut) {
      return { eligible: false, score: 0, reason: 'Customer has opted out of communication notifications', recommendedChannel: 'WHATSAPP' };
    }

    // Rule 6: Check Available Contact Details (Merchant CRM rule - never assume 3rd party app data)
    const hasPhone = Boolean(payment.customer.phone && payment.customer.phone.trim().length >= 10);
    const hasEmail = Boolean(payment.customer.email && payment.customer.email.includes('@'));

    if (!hasPhone && !hasEmail) {
      return { eligible: false, score: 0, reason: 'Merchant system has no phone or email for this customer', recommendedChannel: 'WHATSAPP' };
    }

    // Rule 7: Check Attempt Limit (Merchant configured max attempts: 2 or 3)
    const maxAttempts = payment.merchant?.maxRecoveryAttempts || 3;
    const currentAttempts = payment.recoveryWorkflow?.currentAttempts || 0;

    if (currentAttempts >= maxAttempts) {
      return { eligible: false, score: 0, reason: `Maximum recovery attempts (${maxAttempts}) reached`, recommendedChannel: 'WHATSAPP' };
    }

    // Rule 8: Determine Best Channel
    let channel: 'WHATSAPP' | 'SMS' | 'EMAIL' = 'WHATSAPP';
    if (payment.customer.preferredChannel === 'EMAIL' && hasEmail) {
      channel = 'EMAIL';
    } else if (payment.customer.preferredChannel === 'SMS' && hasPhone) {
      channel = 'SMS';
    } else if (hasPhone) {
      channel = 'WHATSAPP';
    } else if (hasEmail) {
      channel = 'EMAIL';
    }

    // Calculate Recovery Score (0 - 100)
    let score = 70;
    if (payment.amount > 5000) score += 10;
    if (payment.paymentMethod === 'UPI') score += 5;
    if (payment.failureReason === 'BANK_SERVER_TIMEOUT' || payment.failureReason === 'NETWORK_FLAP') score += 10;
    if (payment.failureReason === 'INSUFFICIENT_FUNDS') score -= 15;
    if (currentAttempts > 0) score -= 10 * currentAttempts;

    score = Math.max(10, Math.min(99, score));

    return {
      eligible: true,
      score,
      reason: 'Eligible for automated recovery',
      recommendedChannel: channel,
    };
  }

  /**
   * Initiate or proceed with automated recovery attempt
   */
  async processRecovery(paymentId: string, manualChannelOverride?: 'WHATSAPP' | 'SMS' | 'EMAIL') {
    const eligibility = await this.checkEligibility(paymentId);
    if (!eligibility.eligible) {
      await prisma.auditLog.create({
        data: {
          merchantId: 'mch_apex_01',
          entityType: 'RECOVERY_ENGINE',
          entityId: paymentId,
          action: 'RECOVERY_BLOCKED',
          details: `Recovery execution skipped for payment ${paymentId}: ${eligibility.reason}`,
        },
      });
      return { success: false, reason: eligibility.reason };
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { customer: true, order: true, merchant: true },
    });

    if (!payment || !payment.customer) {
      return { success: false, reason: 'Payment or customer invalid' };
    }

    const channel = manualChannelOverride || eligibility.recommendedChannel;
    const recipient = channel === 'EMAIL' ? payment.customer.email : payment.customer.phone;

    if (!recipient) {
      return { success: false, reason: `Customer has no valid address for ${channel}` };
    }

    // Get or create Recovery Workflow
    let workflow = await prisma.recoveryWorkflow.findUnique({
      where: { paymentId },
    });

    if (!workflow) {
      workflow = await prisma.recoveryWorkflow.create({
        data: {
          paymentId,
          merchantId: payment.merchantId,
          customerId: payment.customerId,
          mode: 'KNOWN_CUSTOMER',
          status: 'IN_PROGRESS',
          recoveryScore: eligibility.score,
          recommendedChannel: channel,
          currentAttempts: 0,
          maxAttempts: payment.merchant.maxRecoveryAttempts || 3,
        },
      });
    }

    const nextAttemptNum = workflow.currentAttempts + 1;
    const paymentLink = `https://recoverflow.ai/checkout/${payment.id}?token=demo_sec_${Date.now()}`;

    // Polite, neutral message content (No threatening/aggressive wording)
    const bodyText = `Hi ${payment.customer.name},\n\nYour payment for order ${payment.order?.orderNumber || payment.id} (₹${payment.amount.toLocaleString()}) was not completed.\n\nIf you would still like to complete your purchase, you can use the secure payment link below:\n${paymentLink}\n\nNo action is required if you have already completed the payment.`;

    // Dispatch via Communication Provider
    const commResult = await communicationService.dispatchMessage(channel, {
      recipient,
      customerName: payment.customer.name,
      orderId: payment.order?.orderNumber || payment.id,
      amount: payment.amount,
      paymentLink,
    });

    // Create Recovery Attempt Record
    const attempt = await prisma.recoveryAttempt.create({
      data: {
        workflowId: workflow.id,
        attemptNumber: nextAttemptNum,
        channel,
        status: commResult.deliveryStatus,
        sentAt: new Date(),
      },
    });

    // Log Communication Message
    await prisma.communicationMessage.create({
      data: {
        recoveryAttemptId: attempt.id,
        channel,
        recipient,
        subject: channel === 'EMAIL' ? `Payment Recovery Request - Order ${payment.order?.orderNumber || payment.id}` : null,
        body: bodyText,
        paymentLink,
        deliveryStatus: commResult.deliveryStatus,
      },
    });

    // Update Workflow Attempt Count
    const isLastAttempt = nextAttemptNum >= workflow.maxAttempts;
    await prisma.recoveryWorkflow.update({
      where: { id: workflow.id },
      data: {
        currentAttempts: nextAttemptNum,
        status: isLastAttempt ? 'STOPPED' : 'IN_PROGRESS',
        stopReason: isLastAttempt ? 'MAX_ATTEMPTS_REACHED' : null,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        merchantId: payment.merchantId,
        entityType: 'RECOVERY_WORKFLOW',
        entityId: workflow.id,
        action: 'MESSAGE_SENT',
        details: `Attempt #${nextAttemptNum} sent to ${payment.customer.name} via ${channel} (${recipient}).`,
      },
    });

    // Broadcast Real-time Event
    eventHub.broadcast('recovery.attempt', {
      paymentId,
      workflowId: workflow.id,
      attemptNumber: nextAttemptNum,
      channel,
      customerName: payment.customer.name,
      amount: payment.amount,
      status: 'SENT',
    });

    return {
      success: true,
      workflowId: workflow.id,
      attemptNumber: nextAttemptNum,
      channel,
      recipient,
      messageId: commResult.messageId,
    };
  }

  /**
   * Stop automated recovery for a payment
   */
  async stopRecovery(paymentId: string, reason: string) {
    const workflow = await prisma.recoveryWorkflow.findUnique({
      where: { paymentId },
    });

    if (!workflow) return;

    await prisma.recoveryWorkflow.update({
      where: { id: workflow.id },
      data: {
        status: 'STOPPED',
        stopReason: reason,
      },
    });

    await prisma.auditLog.create({
      data: {
        merchantId: workflow.merchantId,
        entityType: 'RECOVERY_WORKFLOW',
        entityId: workflow.id,
        action: 'AUTOMATION_STOPPED',
        details: `Recovery workflow stopped for payment ${paymentId}. Reason: ${reason}`,
      },
    });

    eventHub.broadcast('recovery.stopped', {
      paymentId,
      workflowId: workflow.id,
      reason,
    });
  }

  /**
   * Mark payment as RECOVERED upon customer link payment
   */
  async completeRecovery(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true, recoveryWorkflow: true },
    });

    if (!payment) return null;

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'RECOVERED',
        recoveredAt: new Date(),
        recoveryValue: payment.amount,
      },
    });

    // Update Order status if present
    if (payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'COMPLETED' },
      });
    }

    // Stop Workflow with PAYMENT_COMPLETED
    if (payment.recoveryWorkflow) {
      await prisma.recoveryWorkflow.update({
        where: { id: payment.recoveryWorkflow.id },
        data: {
          status: 'COMPLETED',
          stopReason: 'PAYMENT_COMPLETED',
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        merchantId: payment.merchantId,
        entityType: 'PAYMENT',
        entityId: paymentId,
        action: 'PAYMENT_RECOVERED',
        details: `Payment ${paymentId} of ₹${payment.amount} successfully recovered via customer recovery link. Automation stopped.`,
      },
    });

    eventHub.broadcast('payment.recovered', {
      paymentId,
      amount: payment.amount,
      merchantId: payment.merchantId,
    });

    return updatedPayment;
  }
}

export const recoveryEngine = new RecoveryEngine();
