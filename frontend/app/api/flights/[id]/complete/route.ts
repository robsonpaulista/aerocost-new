// API Route do Next.js para marcar Flight como completado
import { NextRequest, NextResponse } from 'next/server';
import { Flight } from '@/lib/models/Flight';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();
    const actualLegTime = body.actual_leg_time || null;
    const flight = await Flight.markAsCompleted(id, actualLegTime);
    return NextResponse.json(flight);
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

