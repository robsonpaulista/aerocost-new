// API Route do Next.js para Flight por ID
import { NextRequest, NextResponse } from 'next/server';
import { Flight } from '@/lib/models/Flight';
import { CalculationService } from '@/lib/services/calculationService';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();
    
    // Calcular custo se leg_time ou route_id mudou
    let costCalculated = body.cost_calculated;
    if (body.aircraft_id && (body.leg_time !== undefined || body.route_id !== undefined)) {
      try {
        // Buscar voo atual para pegar valores que não mudaram
        const currentFlight = await Flight.findById(id);
        const legTime = body.leg_time !== undefined ? body.leg_time : (currentFlight as any).leg_time;
        const routeId = body.route_id !== undefined ? body.route_id : (currentFlight as any).route_id;
        const aircraftId = body.aircraft_id || (currentFlight as any).aircraft_id;
        
        if (legTime > 0) {
          console.log(`[Flights API] Recalculando custo para voo: aircraft=${aircraftId}, leg_time=${legTime}, route_id=${routeId || 'null'}`);
          const legCost = await CalculationService.calculateLegCost(
            aircraftId,
            legTime,
            routeId || null
          );
          costCalculated = legCost.totalLegCost;
          console.log(`[Flights API] Custo recalculado: R$ ${costCalculated}`);
        }
      } catch (calcError: any) {
        console.error('[Flights API] Erro ao recalcular custo do voo:', calcError);
        // Continua sem recalcular, mas loga o erro
      }
    }
    
    const flightData = {
      ...body,
      cost_calculated: costCalculated
    };
    
    const flight = await Flight.update(id, flightData);
    return NextResponse.json(flight);
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    await Flight.delete(id);
    return NextResponse.json({ message: 'Flight deleted successfully' });
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

