// API Route do Next.js para Variable Costs por Aircraft ID
import { NextRequest, NextResponse } from 'next/server';
import { VariableCost } from '@/lib/models/VariableCost';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { aircraftId } = resolvedParams;
    const variableCost = await VariableCost.findByAircraftId(aircraftId);
    return NextResponse.json(variableCost);
  } catch (error: any) {
    console.error('[Variable Costs API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

