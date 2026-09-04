import { NextResponse } from 'next/server';
import { predictionEngine } from '@/lib/services/prediction-engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const forecast = await predictionEngine.getLatestForecast();
    return NextResponse.json({ forecast });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
