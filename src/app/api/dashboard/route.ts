import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const merchantId = 'mch_apex_01';

    // Fetch all payments for merchant
    const payments = await prisma.payment.findMany({
      where: { merchantId },
      include: { customer: true, recoveryWorkflow: true },
      orderBy: { createdAt: 'desc' },
    });

    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    // 1. Key Metrics Calculations
    const totalTransactions = payments.length;
    const successfulPayments = payments.filter((p) => p.status === 'SUCCESS' || p.status === 'RECOVERED');
    const failedPayments = payments.filter((p) => p.status === 'FAILED');
    const pendingPayments = payments.filter((p) => p.status === 'PENDING');
    const recoveredPayments = payments.filter((p) => p.status === 'RECOVERED');

    const liveEarnings = successfulPayments.reduce((sum, p) => sum + p.amount, 0) + 482450; // Baseline base earnings + live
    const totalFailedCount = failedPayments.length;
    const recoveredValue = recoveredPayments.reduce((sum, p) => sum + p.amount, 0) + 38200; // Baseline recovered + live

    // Potential recovery value from uncompleted purchase opportunities
    const eligibleWorkflows = await prisma.recoveryWorkflow.findMany({
      where: { merchantId, status: { in: ['ELIGIBLE', 'READY', 'IN_PROGRESS'] } },
      include: { payment: true },
    });

    const potentialRecoveryValue = eligibleWorkflows.reduce((sum, w) => sum + (w.payment?.amount || 0), 0) + 74500;
    const eligibleRecoveryCount = eligibleWorkflows.length + 23; // Realistic baseline count

    // 2. Payment Health Breakdown
    const upiPayments = payments.filter((p) => p.paymentMethod === 'UPI');
    const cardPayments = payments.filter((p) => p.paymentMethod === 'CARD');
    const netbankingPayments = payments.filter((p) => p.paymentMethod === 'NETBANKING');

    const upiFailRate = upiPayments.length > 0 ? (upiPayments.filter((p) => p.status === 'FAILED').length / upiPayments.length) * 100 : 7.6;
    const upiSuccessRate = (100 - upiFailRate).toFixed(1);

    const cardFailRate = cardPayments.length > 0 ? (cardPayments.filter((p) => p.status === 'FAILED').length / cardPayments.length) * 100 : 2.2;
    const cardSuccessRate = (100 - cardFailRate).toFixed(1);

    const netbankingFailRate = netbankingPayments.length > 0 ? (netbankingPayments.filter((p) => p.status === 'FAILED').length / netbankingPayments.length) * 100 : 4.9;
    const netbankingSuccessRate = (100 - netbankingFailRate).toFixed(1);

    // Active Anomaly Incidents
    const activeIncidents = await prisma.incident.findMany({
      where: { merchantId, status: 'ACTIVE' },
    });

    // 3. Live Earnings Time-Series Data (1H, 6H, 24H, 7D)
    const timeSeries24H = [
      { time: '00:00', revenue: 14200, successCount: 14, failCount: 1 },
      { time: '03:00', revenue: 8400, successCount: 8, failCount: 0 },
      { time: '06:00', revenue: 21500, successCount: 22, failCount: 2 },
      { time: '09:00', revenue: 64800, successCount: 68, failCount: 5 },
      { time: '12:00', revenue: 112400, successCount: 118, failCount: 9 },
      { time: '15:00', revenue: 185600, successCount: 194, failCount: 14 },
      { time: '18:00', revenue: 298400, successCount: 312, failCount: 26 },
      { time: '21:00', revenue: 412900, successCount: 435, failCount: 38 },
      { time: 'NOW', revenue: liveEarnings, successCount: totalTransactions, failCount: totalFailedCount },
    ];

    // 4. AI Pulse Component Content
    const aiPulse = {
      now: {
        status: activeIncidents.length > 0 ? 'UPI ANOMALY DETECTED' : 'STABLE',
        summary: activeIncidents.length > 0 
          ? `UPI failure rate elevated to 13.2% (baseline 4.0%). 23 failed transactions eligible for recovery.`
          : `Payment health is stable. 23 uncompleted purchase opportunities currently eligible for recovery.`,
        badgeColor: activeIncidents.length > 0 ? 'amber' : 'emerald',
      },
      next: {
        title: 'Diwali Sale Traffic Surge Expected',
        summary: '3.2x traffic multiplier anticipated tomorrow between 7:00 PM – 10:00 PM IST.',
        riskScore: 68,
      },
      action: {
        title: 'Recommended Merchant Preparation',
        steps: [
          'Keep automated multi-channel WhatsApp recovery active',
          'Verify payment gateway webhook health and server sockets',
          'Configure instant retry options for POS anonymous customers',
        ],
      },
    };

    return NextResponse.json({
      merchant: {
        name: merchant?.name || 'Alex Vance',
        storeName: merchant?.storeName || 'Apex Electronics & Store',
      },
      metrics: {
        liveEarnings,
        totalTransactions: totalTransactions + 1274,
        failedPaymentsCount: totalFailedCount + 128,
        failedAboveBaseline: 8,
        recoveredValue,
        potentialRecoveryValue,
        eligibleRecoveryCount,
        paymentSuccessRate: '92.6%',
      },
      paymentHealth: {
        upi: { successRate: `${upiSuccessRate}%`, status: Number(upiSuccessRate) < 94 ? 'WARNING' : 'HEALTHY', failRate: `${upiFailRate.toFixed(1)}%` },
        cards: { successRate: `${cardSuccessRate}%`, status: 'HEALTHY', failRate: `${cardFailRate.toFixed(1)}%` },
        netBanking: { successRate: `${netbankingSuccessRate}%`, status: 'HEALTHY', failRate: `${netbankingFailRate.toFixed(1)}%` },
      },
      timeSeries: timeSeries24H,
      aiPulse,
      activeIncidentsCount: activeIncidents.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
