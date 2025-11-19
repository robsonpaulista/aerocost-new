// API Route do Next.js para Flights por Aircraft ID
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
    const filters: any = {};
    if (searchParams.get('flight_type')) filters.flight_type = searchParams.get('flight_type');
    if (searchParams.get('start_date')) filters.start_date = searchParams.get('start_date');
    if (searchParams.get('end_date')) filters.end_date = searchParams.get('end_date');
    if (searchParams.get('limit')) filters.limit = parseInt(searchParams.get('limit') || '0');

    const flights = await Flight.findByAircraftId(aircraftId, filters);
    return NextResponse.json(flights);
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

