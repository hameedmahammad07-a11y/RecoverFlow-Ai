import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        customer: true,
        order: true,
        attempts: { orderBy: { attemptNumber: 'asc' } },
        recoveryWorkflow: {
          include: {
            attempts: {
              include: { messages: true },
              orderBy: { attemptNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    return NextResponse.json({ payment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
