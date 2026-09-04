import { NextRequest, NextResponse } from 'next/server';
import { predictionEngine } from '@/lib/services/prediction-engine';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const forecastInputSchema = z.object({
  eventName: z.string().min(2),
  targetDate: z.string(),
  expectedTrafficMultiplier: z.number().min(1).max(10),
  vulnerableMethod: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = forecastInputSchema.parse(body);
    const forecast = await predictionEngine.generateEventForecast(validated);
    return NextResponse.json({ success: true, forecast });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
