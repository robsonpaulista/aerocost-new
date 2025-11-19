import { supabase } from '../config/supabase';

export class FixedCost {
  /**
   * Busca custos fixos por aeronave
   */
  static async findByAircraftId(aircraftId: string) {
    const { data, error } = await supabase
      .from('fixed_costs')
      .select('*')
      .eq('aircraft_id', aircraftId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Cria ou atualiza custos fixos
   */
  static async upsert(fixedCostData: any) {
    // Se já existe um registro para esta aeronave, buscar o ID primeiro
    if (fixedCostData.aircraft_id && !fixedCostData.id) {
      const existing = await this.findByAircraftId(fixedCostData.aircraft_id);
      if (existing) {
        fixedCostData.id = existing.id;
      }
    }

    // Se tem ID, fazer update; senão, fazer insert
    if (fixedCostData.id) {
      const { data, error } = await supabase
        .from('fixed_costs')
        .update(fixedCostData)
        .eq('id', fixedCostData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('fixed_costs')
        .insert([fixedCostData])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  /**
   * Atualiza custos fixos
   */
  static async update(id: string, fixedCostData: any) {
    const { data, error } = await supabase
      .from('fixed_costs')
      .update(fixedCostData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Remove custos fixos
   */
  static async delete(id: string) {
    const { error } = await supabase
      .from('fixed_costs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
}

