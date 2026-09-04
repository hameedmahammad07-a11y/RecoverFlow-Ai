import { NextRequest, NextResponse } from 'next/server';
import { recoveryEngine } from '@/lib/services/recovery-engine';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const actionSchema = z.object({
  action: z.enum(['START_ATTEMPT', 'STOP_AUTOMATION', 'COMPLETE_PAYMENT']),
  channelOverride: z.enum(['WHATSAPP', 'SMS', 'EMAIL']).optional(),
  reason: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params;
    const body = await req.json();
    const { action, channelOverride, reason } = actionSchema.parse(body);

    if (action === 'START_ATTEMPT') {
      const result = await recoveryEngine.processRecovery(paymentId, channelOverride);
      return NextResponse.json(result);
    }

    if (action === 'STOP_AUTOMATION') {
      await recoveryEngine.stopRecovery(paymentId, reason || 'MANUAL_STOP_BY_MERCHANT');
      return NextResponse.json({ success: true, message: 'Recovery automation stopped' });
    }

    if (action === 'COMPLETE_PAYMENT') {
      const updated = await recoveryEngine.completeRecovery(paymentId);
      return NextResponse.json({ success: true, payment: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
