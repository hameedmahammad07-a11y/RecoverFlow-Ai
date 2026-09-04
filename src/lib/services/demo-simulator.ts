import { prisma } from '../prisma';
import { paymentEngine } from './payment-engine';
import { recoveryEngine } from './recovery-engine';
import { incidentEngine } from './incident-engine';
import { eventHub } from '../events/event-hub';

export class DemoSimulator {
  async simulatePaymentEvent(options: {
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    method?: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';
    amount?: number;
    failureReason?: string;
    isKnownCustomer?: boolean;
  }) {
    const merchantId = 'mch_apex_01';

    // Pick customer if known
    let customerId: string | undefined = undefined;
    if (options.isKnownCustomer !== false) {
      const customer = await prisma.customer.findFirst({
        where: { merchantId, consentOptOut: false },
      });
      if (customer) customerId = customer.id;
    }

    const amount = options.amount || Math.floor(Math.random() * 8500) + 450;
    const method = options.method || (['UPI', 'CARD', 'NETBANKING', 'WALLET'][Math.floor(Math.random() * 4)] as any);
    const failureReasons = [
      'BANK_SERVER_TIMEOUT',
      'INSUFFICIENT_FUNDS',
      'EXPIRED_USER_SESSION',
      'AUTHENTICATION_FAILED',
      'NETWORK_FLAP',
      'UPI_PIN_TIMEOUT',
    ];
    const failureReason = options.status === 'FAILED' ? options.failureReason || failureReasons[Math.floor(Math.random() * failureReasons.length)] : undefined;

    // Create Order
    const orderNumber = `RF-${Math.floor(10000 + Math.random() * 89999)}`;
    const order = await prisma.order.create({
      data: {
        merchantId,
        customerId,
        orderNumber,
        amount,
        itemsJson: JSON.stringify([{ name: 'Simulated Order Item', price: amount, qty: 1 }]),
        status: options.status === 'SUCCESS' ? 'COMPLETED' : 'PENDING',
      },
    });

    // Process payment through PaymentEngine
    const payment = await paymentEngine.processPaymentEvent({
      merchantId,
      customerId,
      orderId: order.id,
      amount,
      paymentMethod: method,
      status: options.status,
      failureReason,
    });

    return payment;
  }

  async simulateCustomerRecoveryClick(paymentId?: string) {
    let targetPaymentId = paymentId;

    if (!targetPaymentId) {
      // Find latest in-progress or ready recovery workflow
      const workflow = await prisma.recoveryWorkflow.findFirst({
        where: { status: { in: ['IN_PROGRESS', 'READY', 'ELIGIBLE'] } },
        orderBy: { createdAt: 'desc' },
      });
      if (workflow) {
        targetPaymentId = workflow.paymentId;
      }
    }

    if (!targetPaymentId) {
      // If none found, create a failed payment first
      const newPayment: any = await this.simulatePaymentEvent({
        status: 'FAILED',
        isKnownCustomer: true,
      });
      targetPaymentId = newPayment.id;
      // Trigger recovery
      await recoveryEngine.processRecovery(targetPaymentId!);
    }

    // Complete recovery
    const recoveredPayment = await recoveryEngine.completeRecovery(targetPaymentId!);

    return {
      success: true,
      paymentId: targetPaymentId,
      recoveredPayment,
    };
  }

  async simulateTrafficBurst(multiplier: number) {
    eventHub.broadcast('demo.traffic_burst', {
      multiplier,
      message: `Simulating ${multiplier}x traffic burst on payment gateway handlers...`,
    });

    // Generate 5 rapid payments
    const results = [];
    for (let i = 0; i < 5; i++) {
      const isFailed = Math.random() < 0.25; // 25% failure rate during spike
      const status = isFailed ? 'FAILED' : 'SUCCESS';
      const payment = await this.simulatePaymentEvent({
        status,
        method: Math.random() > 0.3 ? 'UPI' : 'CARD',
      });
      results.push(payment);
    }

    return {
      burstMultiplier: multiplier,
      simulatedPaymentsCount: results.length,
    };
  }

  async simulateUpiSpike() {
    return incidentEngine.triggerUpiSpikeSimulation();
  }
}

export const demoSimulator = new DemoSimulator();
