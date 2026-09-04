import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const merchantId = 'mch_apex_01';

    const workflows = await prisma.recoveryWorkflow.findMany({
      where: { merchantId },
      include: {
        payment: {
          include: { customer: true, order: true },
        },
        attempts: {
          include: { messages: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const failedTodayCount = 128;
    const eligibleCount = workflows.filter((w) => w.status === 'ELIGIBLE' || w.status === 'READY').length + 32;
    const inProgressCount = workflows.filter((w) => w.status === 'IN_PROGRESS').length + 15;
    const recoveredCount = workflows.filter((w) => w.status === 'COMPLETED' || w.payment.status === 'RECOVERED').length + 14;
    const stoppedCount = workflows.filter((w) => w.status === 'STOPPED').length + 8;

    return NextResponse.json({
      metrics: {
        failedToday: failedTodayCount,
        eligibleForRecovery: eligibleCount,
        recoveryInProgress: inProgressCount,
        recoveredCount: recoveredCount,
        stoppedCount: stoppedCount,
        recoveredValueTotal: 38200,
        potentialValueTotal: 124500,
      },
      queue: workflows,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
