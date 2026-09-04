import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const merchantId = 'mch_apex_01';

    // Channel Performance
    const channelStats = [
      { channel: 'WhatsApp', attempts: 184, successfulRecoveries: 62, recoveryRate: '33.7%', avgTimeMinutes: 8.5 },
      { channel: 'SMS', attempts: 96, successfulRecoveries: 24, recoveryRate: '25.0%', avgTimeMinutes: 14.2 },
      { channel: 'Email', attempts: 68, successfulRecoveries: 12, recoveryRate: '17.6%', avgTimeMinutes: 42.0 },
    ];

    // Payment Method Breakdown
    const paymentMethodStats = [
      { method: 'UPI', totalVolume: 840, successRate: '92.4%', failRate: '7.6%', recoveredCount: 48, recoveredValue: 64200 },
      { method: 'Cards', totalVolume: 320, successRate: '97.8%', failRate: '2.2%', recoveredCount: 18, recoveredValue: 89400 },
      { method: 'Net Banking', totalVolume: 94, successRate: '95.1%', failRate: '4.9%', recoveredCount: 9, recoveredValue: 31500 },
      { method: 'Wallets', totalVolume: 30, successRate: '96.6%', failRate: '3.4%', recoveredCount: 3, recoveredValue: 4800 },
    ];

    // Failure Reasons Distribution
    const failureReasonsBreakdown = [
      { reason: 'Bank Server Timeout', count: 54, percentage: '42.2%' },
      { reason: 'Expired User Session', count: 28, percentage: '21.8%' },
      { reason: 'Authentication Failed', count: 22, percentage: '17.2%' },
      { reason: 'Insufficient Funds', count: 14, percentage: '10.9%' },
      { reason: 'Network Flap', count: 10, percentage: '7.8%' },
    ];

    return NextResponse.json({
      channels: channelStats,
      paymentMethods: paymentMethodStats,
      failureReasons: failureReasonsBreakdown,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
