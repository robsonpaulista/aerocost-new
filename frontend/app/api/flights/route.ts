// API Route do Next.js para Flights
import { NextRequest, NextResponse } from 'next/server';
import { Flight } from '@/lib/models/Flight';
import { CalculationService } from '@/lib/services/calculationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Calcular custo do voo sempre que tiver leg_time
    let costCalculated = null;
    if (body.aircraft_id && body.leg_time > 0) {
      try {
        console.log(`[Flights API] Calculando custo para voo: aircraft=${body.aircraft_id}, leg_time=${body.leg_time}, route_id=${body.route_id || 'null'}`);
        const legCost = await CalculationService.calculateLegCost(
          body.aircraft_id,
          body.leg_time,
          body.route_id || null
        );
        costCalculated = legCost.totalLegCost;
        console.log(`[Flights API] Custo calculado para novo voo: R$ ${costCalculated}`);
      } catch (calcError: any) {
        console.error('[Flights API] Erro ao calcular custo do voo:', calcError);
        console.error('[Flights API] Detalhes do erro:', calcError.message);
        // Continua sem o custo calculado, mas loga o erro
      }
    } else {
      console.warn('[Flights API] Voo criado sem leg_time ou aircraft_id, não será calculado custo');
    }

    const flightData = {
      ...body,
      cost_calculated: costCalculated
    };

    const flight = await Flight.create(flightData);
    return NextResponse.json(flight, { status: 201 });
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 400 }
    );
  }
}

