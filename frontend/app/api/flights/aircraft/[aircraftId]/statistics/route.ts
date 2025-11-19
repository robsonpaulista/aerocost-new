// API Route do Next.js para estatísticas de Flights
import { NextRequest, NextResponse } from 'next/server';
import { Flight } from '@/lib/models/Flight';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { aircraftId } = resolvedParams;
    
    // Obter query params
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;

    const statistics = await Flight.getStatistics(aircraftId, startDate, endDate);
    return NextResponse.json(statistics);
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

