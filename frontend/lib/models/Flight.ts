import { supabase } from '../config/supabase';

export class Flight {
  /**
   * Busca voos por aeronave
   */
  static async findByAircraftId(aircraftId: string, filters: any = {}) {
    let query = supabase
      .from('flights')
      .select('*, routes(origin, destination, decea_per_hour)')
      .eq('aircraft_id', aircraftId)
      .order('flight_date', { ascending: false });

    if (filters.flight_type) {
      query = query.eq('flight_type', filters.flight_type);
    }

    if (filters.start_date) {
      query = query.gte('flight_date', filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte('flight_date', filters.end_date);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Busca voo por ID
   */
  static async findById(id: string) {
    const { data, error } = await supabase
      .from('flights')
      .select('*, routes(origin, destination, decea_per_hour)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Cria um novo voo
   */
  static async create(flightData: any) {
    const { data, error } = await supabase
      .from('flights')
      .insert([flightData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Atualiza um voo
   */
  static async update(id: string, flightData: any) {
    const { data, error } = await supabase
      .from('flights')
      .update(flightData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Remove um voo
   */
  static async delete(id: string) {
    const { error } = await supabase
      .from('flights')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }

  /**
   * Marca voo como completado
   */
  static async markAsCompleted(id: string, actualLegTime: number | null = null) {
    const updateData: any = {
      flight_type: 'completed',
      updated_at: new Date().toISOString()
    };

    if (actualLegTime !== null) {
      updateData.actual_leg_time = actualLegTime;
    }

    const { data, error } = await supabase
      .from('flights')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Busca estatísticas de voos
   */
  static async getStatistics(aircraftId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('flights')
      .select('flight_type, leg_time, actual_leg_time, total_cost')
      .eq('aircraft_id', aircraftId);

    if (startDate) {
      query = query.gte('flight_date', startDate);
    }
    if (endDate) {
      query = query.lte('flight_date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    const planned = data?.filter((f: any) => f.flight_type === 'planned').length || 0;
    const completed = data?.filter((f: any) => f.flight_type === 'completed').length || 0;
    const totalHoursCompleted = data
      ?.filter((f: any) => f.flight_type === 'completed')
      .reduce((sum: number, f: any) => sum + (f.actual_leg_time || f.leg_time || 0), 0) || 0;
    const totalCost = data
      ?.filter((f: any) => f.flight_type === 'completed')
      .reduce((sum: number, f: any) => sum + (f.total_cost || 0), 0) || 0;

    return {
      planned,
      completed,
      totalHoursCompleted,
      totalCost,
    };
  }
}

