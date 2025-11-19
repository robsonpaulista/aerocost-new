// API Route do Next.js para Flight por ID
import { NextRequest, NextResponse } from 'next/server';
import { Flight } from '@/lib/models/Flight';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const flight = await Flight.findById(id);
    if (!flight) {
      return NextResponse.json(
        { error: 'Flight not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(flight);
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

