// API Route do Next.js para Flights por Aircraft ID
import { NextRequest, NextResponse } from 'next/server';
import { Flight } from '@/lib/models/Flight';
import { CalculationService } from '@/lib/services/calculationService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { aircraftId } = resolvedParams;
    
    // Obter query params
    const searchParams = request.nextUrl.searchParams;
    const filters: any = {};
    if (searchParams.get('flight_type')) filters.flight_type = searchParams.get('flight_type');
    if (searchParams.get('start_date')) filters.start_date = searchParams.get('start_date');
    if (searchParams.get('end_date')) filters.end_date = searchParams.get('end_date');
    if (searchParams.get('limit')) filters.limit = parseInt(searchParams.get('limit') || '0');

    console.log('[Flights API] Buscando voos para aeronave:', aircraftId, 'com filtros:', filters);
    const flights = await Flight.findByAircraftId(aircraftId, filters);
    console.log('[Flights API] Voos encontrados:', flights.length);
    
    // Recalcular custos de todos os voos para garantir valores atualizados
    const flightsWithUpdatedCosts = await Promise.all(
      flights.map(async (flight: any) => {
        try {
          const legTime = flight.flight_type === 'completed' && flight.actual_leg_time
            ? flight.actual_leg_time
            : flight.leg_time;
          
          if (legTime > 0 && flight.aircraft_id) {
            const legCost = await CalculationService.calculateLegCost(
              flight.aircraft_id,
              legTime,
              flight.route_id || null
            );
            
            // Atualizar o custo calculado no voo
            const updatedCost = legCost.totalLegCost;
            
            // Se o custo mudou, atualizar no banco
            if (Math.abs((flight.cost_calculated || 0) - updatedCost) > 0.01) {
              console.log(`[Flights API] Atualizando custo do voo ${flight.id}: R$ ${flight.cost_calculated || 0} → R$ ${updatedCost}`);
              try {
                await Flight.update(flight.id, { cost_calculated: updatedCost });
              } catch (updateError) {
                console.error(`[Flights API] Erro ao atualizar custo do voo ${flight.id}:`, updateError);
              }
            }
            
            return {
              ...flight,
              cost_calculated: updatedCost
            };
          }
          
          return flight;
        } catch (calcError: any) {
          console.error(`[Flights API] Erro ao recalcular custo do voo ${flight.id}:`, calcError);
          // Retorna o voo com o custo original se houver erro no cálculo
          return flight;
        }
      })
    );
    
    console.log('[Flights API] Custos recalculados para', flightsWithUpdatedCosts.length, 'voos');
    return NextResponse.json(flightsWithUpdatedCosts);
  } catch (error: any) {
    console.error('[Flights API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

