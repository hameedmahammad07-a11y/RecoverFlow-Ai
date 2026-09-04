import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: 'mch_apex_01' },
    });
    return NextResponse.json({ merchant });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await prisma.merchant.update({
      where: { id: 'mch_apex_01' },
      data: {
        autoRecoveryEnabled: body.autoRecoveryEnabled,
        maxRecoveryAttempts: body.maxRecoveryAttempts ? parseInt(body.maxRecoveryAttempts, 10) : undefined,
        quietHoursStart: body.quietHoursStart,
        quietHoursEnd: body.quietHoursEnd,
        storeName: body.storeName,
      },
    });

    return NextResponse.json({ success: true, merchant: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
