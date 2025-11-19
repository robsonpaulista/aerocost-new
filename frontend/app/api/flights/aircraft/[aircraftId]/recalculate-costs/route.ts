// API Route do Next.js para recalcular custos de Flights
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { aircraftId } = resolvedParams;
    
    // TODO: Implementar lógica de recálculo de custos
    // Por enquanto, retorna sucesso
    return NextResponse.json({ 
      message: 'Costs recalculation initiated',
      aircraftId 
    });
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

