// API Route do Next.js para Fixed Costs por Aircraft ID
import { NextRequest, NextResponse } from 'next/server';
import { FixedCost } from '@/lib/models/FixedCost';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { aircraftId } = resolvedParams;
    const fixedCost = await FixedCost.findByAircraftId(aircraftId);
    
    console.log('[FixedCosts API] Dados retornados do banco:', fixedCost);
    if (fixedCost) {
      console.log('[FixedCosts API] insurance value:', fixedCost.insurance, 'type:', typeof fixedCost.insurance);
    }
    
    return NextResponse.json(fixedCost);
  } catch (error: any) {
    console.error('[Fixed Costs API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

