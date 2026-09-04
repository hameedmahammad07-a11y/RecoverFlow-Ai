import { NextResponse } from 'next/server';
import { incidentEngine } from '@/lib/services/incident-engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const incidents = await incidentEngine.getActiveIncidents();
    return NextResponse.json({ incidents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
