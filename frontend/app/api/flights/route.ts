// API Route do Next.js para Flights
import { NextRequest, NextResponse } from 'next/server';
import { Flight } from '@/lib/models/Flight';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const flight = await Flight.create(body);
    return NextResponse.json(flight, { status: 201 });
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 400 }
    );
  }
}

