import { NextRequest, NextResponse } from 'next/server';
import { demoSimulator } from '@/lib/services/demo-simulator';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const simulateSchema = z.object({
  type: z.enum(['PAYMENT', 'RECOVERY_CLICK', 'TRAFFIC_BURST', 'UPI_SPIKE']),
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']).optional(),
  method: z.enum(['UPI', 'CARD', 'NETBANKING', 'WALLET']).optional(),
  amount: z.number().optional(),
  failureReason: z.string().optional(),
  isKnownCustomer: z.boolean().optional(),
  multiplier: z.number().optional(),
  paymentId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = simulateSchema.parse(body);

    if (validated.type === 'PAYMENT') {
      const result = await demoSimulator.simulatePaymentEvent({
        status: validated.status || 'FAILED',
        method: validated.method || 'UPI',
        amount: validated.amount,
        failureReason: validated.failureReason,
        isKnownCustomer: validated.isKnownCustomer,
      });
      return NextResponse.json({ success: true, result });
    }

    if (validated.type === 'RECOVERY_CLICK') {
      const result = await demoSimulator.simulateCustomerRecoveryClick(validated.paymentId);
      return NextResponse.json({ success: true, result });
    }

    if (validated.type === 'TRAFFIC_BURST') {
      const result = await demoSimulator.simulateTrafficBurst(validated.multiplier || 3);
      return NextResponse.json({ success: true, result });
    }

    if (validated.type === 'UPI_SPIKE') {
      const result = await demoSimulator.simulateUpiSpike();
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: 'Invalid simulation type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
