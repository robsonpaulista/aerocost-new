import { Aircraft } from '../models/Aircraft';
import { Route } from '../models/Route';
import { FxRate } from '../models/FxRate';
import { Flight } from '../models/Flight';

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

      const aircraftData = aircraft as any;

      // Separar voos realizados
      const completedFlights = (allFlights || []).filter((f: any) => f.flight_type === 'completed');

      // Cálculos simplificados
      const baseCostPerHour = 0; // Será calculado depois
      const monthlyProjection = 0; // Será calculado depois
      const avgRouteCost = baseCostPerHour;

      return {
        aircraft: {
          id: aircraftData.id,
          name: aircraftData.name,
          registration: aircraftData.registration,
          model: aircraftData.model,
        },
        metrics: {
          baseCostPerHour: parseFloat(baseCostPerHour.toFixed(2)),
          currentFxRate: parseFloat((fxRate as any)?.usd_to_brl || '0'),
          monthlyHoursPlanned: parseFloat(aircraftData.monthly_hours || '0'),
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
