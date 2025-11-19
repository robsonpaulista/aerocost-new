// API Route do Next.js para Base Cost
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { aircraftId } = resolvedParams;
    
    // TODO: Implementar cálculo de custo base
    // Por enquanto, retorna estrutura básica
    return NextResponse.json({
      baseCostPerHour: 0,
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

