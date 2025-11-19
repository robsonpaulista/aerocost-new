// API Route do Next.js para Complete Calculation
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { aircraftId } = resolvedParams;
    
    // TODO: Implementar cálculo completo
    // Por enquanto, retorna estrutura básica
    return NextResponse.json({
      baseCostPerHour: 0,
      monthlyProjection: 0,
      routeCosts: [],
      breakdown: {
        fixed: { totalMonthly: 0 },
        variable: {
          fuelCostPerHour: 0,
          ecVariableBRL: 0,
          ruPerHour: 0,
          ccrPerHour: 0,
        },
      },
      calculatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Calculations API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

