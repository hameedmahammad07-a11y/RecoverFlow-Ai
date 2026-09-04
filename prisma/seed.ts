import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding RecoverFlow AI database...');

  // Clean existing tables
  await prisma.auditLog.deleteMany({});
  await prisma.communicationMessage.deleteMany({});
  await prisma.recoveryAttempt.deleteMany({});
  await prisma.recoveryWorkflow.deleteMany({});
  await prisma.paymentAttempt.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.incident.deleteMany({});
  await prisma.paymentPrediction.deleteMany({});
  await prisma.merchant.deleteMany({});

  // 1. Create Default Merchant
  const merchant = await prisma.merchant.create({
    data: {
      id: 'mch_apex_01',
      name: 'Alex Vance',
      email: 'alex@apexstore.io',
      storeName: 'Apex Electronics & Store',
      phone: '+91 98765 43210',
      baselineUpiFailRate: 4.0,
      baselineCardFailRate: 2.2,
      baselineNetBankingFailRate: 4.8,
      autoRecoveryEnabled: true,
      maxRecoveryAttempts: 3,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
    },
  });

  // 2. Create Sample Customers
  const customersData = [
    { id: 'cust_01', name: 'Rohan Sharma', email: 'rohan.s@gmail.com', phone: '+91 98112 34567', preferredChannel: 'WHATSAPP', consentOptOut: false },
    { id: 'cust_02', name: 'Priya Sundaram', email: 'priya.s@outlook.com', phone: '+91 98223 45678', preferredChannel: 'SMS', consentOptOut: false },
    { id: 'cust_03', name: 'Vikram Mehta', email: 'v.mehta@techcorp.in', phone: '+91 98334 56789', preferredChannel: 'EMAIL', consentOptOut: false },
    { id: 'cust_04', name: 'Ananya Verma', email: 'ananya.v@yahoo.com', phone: '+91 98445 67890', preferredChannel: 'WHATSAPP', consentOptOut: false },
    { id: 'cust_05', name: 'Kabir Kapoor', email: 'kabir.k@design.io', phone: '+91 98556 78901', preferredChannel: 'WHATSAPP', consentOptOut: true }, // Opted out
    { id: 'cust_06', name: 'Sneha Patel', email: 'sneha.p@gmail.com', phone: '+91 98667 89012', preferredChannel: 'SMS', consentOptOut: false },
    { id: 'cust_07', name: 'Arjun Rao', email: 'arjun.rao@startup.co', phone: '+91 98778 90123', preferredChannel: 'EMAIL', consentOptOut: false },
    { id: 'cust_08', name: 'Neha Gupta', email: 'neha.g@domain.com', phone: '+91 98889 01234', preferredChannel: 'WHATSAPP', consentOptOut: false },
  ];

  for (const c of customersData) {
    await prisma.customer.create({
      data: {
        ...c,
        merchantId: merchant.id,
      },
    });
  }

  // 3. Create Recent Transactions and Failed Payments for Today
  const paymentMethods = ['UPI', 'CARD', 'NETBANKING', 'WALLET'];
  const failureReasons = [
    'BANK_SERVER_TIMEOUT',
    'INSUFFICIENT_FUNDS',
    'EXPIRED_USER_SESSION',
    'AUTHENTICATION_FAILED',
    'NETWORK_FLAP',
    'UPI_PIN_TIMEOUT',
  ];

  const now = new Date();

  // Create 15 specific detailed sample payments for dashboard view
  const samplePayments = [
    {
      orderNum: 'RF-28491',
      cust: customersData[0],
      amount: 2500,
      method: 'UPI',
      status: 'FAILED',
      reason: 'BANK_SERVER_TIMEOUT',
      recoveryScore: 84,
      recChannel: 'WHATSAPP',
      workflowStatus: 'READY',
      attempts: 0,
      recValue: 0,
      minsAgo: 5,
    },
    {
      orderNum: 'RF-28490',
      cust: customersData[1],
      amount: 14500,
      method: 'CARD',
      status: 'RECOVERED',
      reason: 'AUTHENTICATION_FAILED',
      recoveryScore: 92,
      recChannel: 'SMS',
      workflowStatus: 'COMPLETED',
      attempts: 1,
      recValue: 14500,
      minsAgo: 18,
    },
    {
      orderNum: 'RF-28489',
      cust: customersData[2],
      amount: 8900,
      method: 'NETBANKING',
      status: 'FAILED',
      reason: 'EXPIRED_USER_SESSION',
      recoveryScore: 78,
      recChannel: 'EMAIL',
      workflowStatus: 'IN_PROGRESS',
      attempts: 1,
      recValue: 0,
      minsAgo: 32,
    },
    {
      orderNum: 'RF-28488',
      cust: customersData[3],
      amount: 3200,
      method: 'UPI',
      status: 'RECOVERED',
      reason: 'UPI_PIN_TIMEOUT',
      recoveryScore: 88,
      recChannel: 'WHATSAPP',
      workflowStatus: 'COMPLETED',
      attempts: 1,
      recValue: 3200,
      minsAgo: 45,
    },
    {
      orderNum: 'RF-28487',
      cust: customersData[4], // Opted out customer
      amount: 6700,
      method: 'CARD',
      status: 'FAILED',
      reason: 'INSUFFICIENT_FUNDS',
      recoveryScore: 40,
      recChannel: 'WHATSAPP',
      workflowStatus: 'STOPPED',
      attempts: 0,
      stopReason: 'CUSTOMER_OPT_OUT',
      recValue: 0,
      minsAgo: 60,
    },
    {
      orderNum: 'RF-28486',
      cust: customersData[5],
      amount: 20500,
      method: 'CARD',
      status: 'RECOVERED',
      reason: 'NETWORK_FLAP',
      recoveryScore: 95,
      recChannel: 'SMS',
      workflowStatus: 'COMPLETED',
      attempts: 1,
      recValue: 20500,
      minsAgo: 90,
    },
    {
      orderNum: 'RF-28485',
      cust: customersData[6],
      amount: 4300,
      method: 'UPI',
      status: 'FAILED',
      reason: 'BANK_SERVER_TIMEOUT',
      recoveryScore: 81,
      recChannel: 'EMAIL',
      workflowStatus: 'IN_PROGRESS',
      attempts: 2,
      recValue: 0,
      minsAgo: 110,
    },
    {
      orderNum: 'RF-28484',
      cust: customersData[7],
      amount: 1250,
      method: 'UPI',
      status: 'PENDING',
      reason: null,
      recoveryScore: 70,
      recChannel: 'WHATSAPP',
      workflowStatus: 'ELIGIBLE',
      attempts: 0,
      recValue: 0,
      minsAgo: 2,
    },
    {
      orderNum: 'RF-28483',
      cust: customersData[0],
      amount: 5400,
      method: 'UPI',
      status: 'SUCCESS',
      reason: null,
      recoveryScore: 0,
      recChannel: 'WHATSAPP',
      workflowStatus: 'NONE',
      attempts: 0,
      recValue: 0,
      minsAgo: 15,
    },
    {
      orderNum: 'RF-28482',
      cust: customersData[1],
      amount: 1890,
      method: 'WALLET',
      status: 'SUCCESS',
      reason: null,
      recoveryScore: 0,
      recChannel: 'SMS',
      workflowStatus: 'NONE',
      attempts: 0,
      recValue: 0,
      minsAgo: 22,
    },
  ];

  for (const item of samplePayments) {
    const createdAt = new Date(now.getTime() - item.minsAgo * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        merchantId: merchant.id,
        customerId: item.cust.id,
        orderNumber: item.orderNum,
        amount: item.amount,
        currency: 'INR',
        itemsJson: JSON.stringify([{ name: 'Standard Order Item', price: item.amount, qty: 1 }]),
        status: item.status === 'SUCCESS' || item.status === 'RECOVERED' ? 'COMPLETED' : 'PENDING',
        createdAt,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        merchantId: merchant.id,
        customerId: item.cust.id,
        orderId: order.id,
        amount: item.amount,
        currency: 'INR',
        paymentMethod: item.method,
        provider: item.method === 'UPI' ? 'PhonePe Gateway' : 'Razorpay',
        status: item.status,
        failureReason: item.reason,
        recoveredAt: item.status === 'RECOVERED' ? new Date(createdAt.getTime() + 10 * 60 * 1000) : null,
        recoveryValue: item.recValue,
        createdAt,
      },
    });

    // Create payment attempts
    await prisma.paymentAttempt.create({
      data: {
        paymentId: payment.id,
        attemptNumber: 1,
        status: item.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
        responseCode: item.reason ? 'ERR_' + item.reason : '200_OK',
        createdAt,
      },
    });

    // Create Recovery Workflow if failed/recovered
    if (item.workflowStatus !== 'NONE') {
      const workflow = await prisma.recoveryWorkflow.create({
        data: {
          paymentId: payment.id,
          merchantId: merchant.id,
          customerId: item.cust.id,
          mode: 'KNOWN_CUSTOMER',
          status: item.workflowStatus,
          recoveryScore: item.recoveryScore,
          recommendedChannel: item.recChannel,
          currentAttempts: item.attempts,
          maxAttempts: 3,
          stopReason: item.stopReason || (item.status === 'RECOVERED' ? 'PAYMENT_COMPLETED' : null),
          createdAt,
        },
      });

      if (item.attempts > 0) {
        const attempt = await prisma.recoveryAttempt.create({
          data: {
            workflowId: workflow.id,
            attemptNumber: 1,
            channel: item.recChannel,
            status: item.status === 'RECOVERED' ? 'CLICKED' : 'DELIVERED',
            scheduledAt: createdAt,
            sentAt: new Date(createdAt.getTime() + 2 * 60 * 1000),
            completedAt: item.status === 'RECOVERED' ? new Date(createdAt.getTime() + 10 * 60 * 1000) : null,
            stopReason: item.status === 'RECOVERED' ? 'PAYMENT_COMPLETED' : null,
            createdAt,
          },
        });

        await prisma.communicationMessage.create({
          data: {
            recoveryAttemptId: attempt.id,
            channel: item.recChannel,
            recipient: item.recChannel === 'EMAIL' ? item.cust.email! : item.cust.phone!,
            subject: item.recChannel === 'EMAIL' ? `Complete your order ${item.orderNum}` : null,
            body: `Hi ${item.cust.name}, your payment for order ${item.orderNum} (₹${item.amount.toLocaleString()}) was not completed. Tap here to finish your purchase safely.`,
            paymentLink: `https://recoverflow.ai/checkout/${payment.id}?token=demo_sec_99`,
            deliveryStatus: 'DELIVERED',
            sentAt: new Date(createdAt.getTime() + 2 * 60 * 1000),
          },
        });
      }
    }
  }

  // 4. Create Active Anomaly Incident
  await prisma.incident.create({
    data: {
      merchantId: merchant.id,
      title: 'UPI Failure Spike Detected',
      paymentMethod: 'UPI',
      baselineRate: 4.0,
      currentRate: 13.2,
      status: 'ACTIVE',
      startedAt: new Date(now.getTime() - 28 * 60 * 1000), // 28 mins ago
      affectedValue: 124500,
      possibleExplanation: 'High volume traffic spike coincides with NPCI banking switch latency bursts during peak evening shopping.',
      likelyFactor: 'Partner bank acquiring server timeout error rate elevated to 8.4%.',
    },
  });

  // 5. Create Payment Predictions
  await prisma.paymentPrediction.create({
    data: {
      merchantId: merchant.id,
      targetDate: new Date(now.getTime() + 24 * 3600 * 1000).toISOString().split('T')[0],
      period: 'NEXT_24_HOURS',
      overallRiskScore: 18.4,
      riskLevel: 'LOW',
      confidence: 82.5,
      vulnerableMethod: 'UPI',
      expectedPeak: '7:30 PM - 9:30 PM',
      trafficMultiplier: 1.2,
      contributingFactors: JSON.stringify([
        'Standard weekend evening traffic rise expected',
        'Bank gateway maintenance window scheduled for 02:00 AM',
        'Historical failure rate remains within 4.0% - 4.5% baseline',
      ]),
      recommendations: JSON.stringify([
        'Keep automated WhatsApp recovery workflows active',
        'Enable early anomaly push alerts for UPI drops',
        'Prepare Instant Checkout backup payment QR codes',
      ]),
    },
  });

  await prisma.paymentPrediction.create({
    data: {
      merchantId: merchant.id,
      targetDate: new Date(now.getTime() + 48 * 3600 * 1000).toISOString().split('T')[0],
      period: 'FESTIVAL_SALE',
      overallRiskScore: 68.5,
      riskLevel: 'HIGH',
      confidence: 78.0,
      vulnerableMethod: 'UPI',
      expectedPeak: '7:00 PM - 10:00 PM',
      trafficMultiplier: 3.2,
      contributingFactors: JSON.stringify([
        'Expected 3.2x traffic surge during festival lightning deal sale',
        'NPCI UPI bank handle contention rate typically spikes under >300 TPS',
        'Card OTP SMS delay probability increases by 14%',
      ]),
      recommendations: JSON.stringify([
        'Enable enhanced real-time failure monitoring before 6 PM',
        'Configure instant multi-channel recovery escalation (SMS + WhatsApp)',
        'Prompt high-ticket cart customers with fallback NetBanking / Card options',
        'Verify payment gateway webhook health and server socket capacity',
      ]),
    },
  });

  // 6. Create Initial Audit Logs
  await prisma.auditLog.create({
    data: {
      merchantId: merchant.id,
      entityType: 'RECOVERY_ENGINE',
      entityId: 'sys_init',
      action: 'SYSTEM_BOOT',
      details: 'RecoverFlow AI Payment Engine initialized with 4.0% UPI baseline.',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
