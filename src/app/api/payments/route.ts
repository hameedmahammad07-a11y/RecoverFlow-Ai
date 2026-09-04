import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paymentEngine } from '@/lib/services/payment-engine';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createPaymentSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.enum(['UPI', 'CARD', 'NETBANKING', 'WALLET']),
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']),
  failureReason: z.string().optional(),
  isKnownCustomer: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where: any = { merchantId: 'mch_apex_01' };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (method && method !== 'ALL') {
      where.paymentMethod = method;
    }

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { failureReason: { contains: search } },
        { customer: { name: { contains: search } } },
        { order: { orderNumber: { contains: search } } },
      ];
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        customer: true,
        order: true,
        recoveryWorkflow: {
          include: {
            attempts: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ payments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createPaymentSchema.parse(body);

    let customerId: string | undefined = undefined;
    if (validated.isKnownCustomer !== false) {
      const customer = await prisma.customer.findFirst({
        where: { merchantId: 'mch_apex_01', consentOptOut: false },
      });
      if (customer) customerId = customer.id;
    }

    const payment = await paymentEngine.processPaymentEvent({
      merchantId: 'mch_apex_01',
      customerId,
      amount: validated.amount,
      paymentMethod: validated.paymentMethod,
      status: validated.status,
      failureReason: validated.failureReason,
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
