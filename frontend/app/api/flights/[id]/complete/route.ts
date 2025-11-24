// API Route do Next.js para marcar Flight como completado
import { NextRequest, NextResponse } from 'next/server';
import { Flight } from '@/lib/models/Flight';
import { CalculationService } from '@/lib/services/calculationService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();
    const actualLegTime = body.actual_leg_time || null;
    
    // Buscar voo atual para pegar dados necessários
    const currentFlight = await Flight.findById(id);
    if (!currentFlight) {
      return NextResponse.json(
        { error: 'Flight not found' },
        { status: 404 }
      );
    }
    
    const flightData = currentFlight as any;
    const legTime = actualLegTime || flightData.leg_time;
    
    // Recalcular custo com o tempo real (se fornecido) ou tempo previsto
    let costCalculated = null;
    if (flightData.aircraft_id && legTime > 0) {
      try {
        console.log(`[Flights API] Recalculando custo ao marcar como completado: aircraft=${flightData.aircraft_id}, leg_time=${legTime}, route_id=${flightData.route_id || 'null'}`);
        const legCost = await CalculationService.calculateLegCost(
          flightData.aircraft_id,
          legTime,
          flightData.route_id || null
        );
        costCalculated = legCost.totalLegCost;
        console.log(`[Flights API] Custo recalculado: R$ ${costCalculated}`);
      } catch (calcError: any) {
        console.error('[Flights API] Erro ao recalcular custo:', calcError);
        // Continua sem recalcular, mas loga o erro
      }
    }
    
    const flight = await Flight.markAsCompleted(id, actualLegTime, costCalculated);
    return NextResponse.json(flight);
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

