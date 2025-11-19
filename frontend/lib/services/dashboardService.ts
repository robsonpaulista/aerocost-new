import { Aircraft } from '../models/Aircraft';
import { Route } from '../models/Route';
import { supabase } from '../config/supabase';

// Modelos simplificados para o dashboard
class FxRate {
  static async getCurrent() {
    const { data, error } = await supabase
      .from('fx_rates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}

class Flight {
  static async findByAircraftId(aircraftId: string, options?: { limit?: number }) {
    const query = supabase
      .from('flights')
      .select('*')
      .eq('aircraft_id', aircraftId)
      .order('flight_date', { ascending: false });

    if (options?.limit) {
      query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getStatistics(aircraftId: string, startDate?: string, endDate?: string) {
    const query = supabase
      .from('flights')
      .select('flight_type, leg_time, actual_leg_time, total_cost')
      .eq('aircraft_id', aircraftId);

    if (startDate) {
      query.gte('flight_date', startDate);
    }
    if (endDate) {
      query.lte('flight_date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    const planned = data?.filter(f => f.flight_type === 'planned').length || 0;
    const completed = data?.filter(f => f.flight_type === 'completed').length || 0;
    const totalHoursCompleted = data
      ?.filter(f => f.flight_type === 'completed')
      .reduce((sum, f) => sum + (f.actual_leg_time || f.leg_time || 0), 0) || 0;
    const totalCost = data
      ?.filter(f => f.flight_type === 'completed')
      .reduce((sum, f) => sum + (f.total_cost || 0), 0) || 0;

    return {
      planned,
      completed,
      totalHoursCompleted,
      totalCost,
    };
  }
}

export class DashboardService {
  /**
   * Gera dados completos do dashboard para uma aeronave
   */
  static async getDashboardData(aircraftId: string) {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const [aircraft, fxRate, routes, allFlights, flightStats] = await Promise.all([
        Aircraft.findById(aircraftId),
        FxRate.getCurrent().catch(() => null),
        Route.findByAircraftId(aircraftId),
        Flight.findByAircraftId(aircraftId, { limit: 100 }),
        Flight.getStatistics(aircraftId, startOfMonth, endOfMonth).catch(() => null),
      ]);

      if (!aircraft) {
        throw new Error('Aircraft not found');
      }

      // Separar voos realizados
      const completedFlights = (allFlights || []).filter((f: any) => f.flight_type === 'completed');

      // Cálculos simplificados
      const baseCostPerHour = 0; // Será calculado depois
      const monthlyProjection = 0; // Será calculado depois
      const avgRouteCost = baseCostPerHour;

      return {
        aircraft: {
          id: aircraft.id,
          name: aircraft.name,
          registration: aircraft.registration,
          model: aircraft.model,
        },
        metrics: {
          baseCostPerHour: parseFloat(baseCostPerHour.toFixed(2)),
          currentFxRate: parseFloat(fxRate?.usd_to_brl || '0'),
          monthlyHoursPlanned: parseFloat(aircraft.monthly_hours || '0'),
          avgRouteCost: parseFloat(avgRouteCost.toFixed(2)),
          monthlyProjection: parseFloat(monthlyProjection.toFixed(2)),
          flightsPlanned: flightStats?.planned || 0,
          flightsCompleted: flightStats?.completed || 0,
          hoursCompleted: parseFloat((flightStats?.totalHoursCompleted || 0).toFixed(2)),
          totalCostCompleted: parseFloat((flightStats?.totalCost || 0).toFixed(2)),
        },
        costDistribution: null,
        routes: routes.length,
        flights: allFlights || [],
        completedFlights: completedFlights || [],
        flightStatistics: flightStats,
        calculations: null,
        recentActivity: [],
        lastUpdated: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('[Dashboard Service Error]', error);
      throw error;
    }
  }
}

