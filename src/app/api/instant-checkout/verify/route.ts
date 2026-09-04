import { NextRequest, NextResponse } from 'next/server';
import { paymentEngine } from '@/lib/services/payment-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { paymentId, amount, paymentMethod } = await req.json();

    if (!paymentId) {
      // Simulate creating an anonymous POS payment verification attempt
      const newPayment: any = await paymentEngine.processPaymentEvent({
        merchantId: 'mch_apex_01',
        amount: amount || 50,
        paymentMethod: paymentMethod || 'UPI',
        status: 'PENDING',
        isKnownCustomer: false,
      });

      return NextResponse.json({
        verifiedState: 'PENDING',
        paymentId: newPayment.id || null,
        amount: newPayment.amount || amount || 50,
        message: 'Payment confirmation pending. Please wait while we verify with bank gateway.',
        canPayAgain: false,
      });
    }

    const verification = await paymentEngine.verifyInstantCheckoutStatus(paymentId);
    return NextResponse.json(verification);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
