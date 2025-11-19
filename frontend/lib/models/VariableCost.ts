import { supabase } from '../config/supabase';

export class VariableCost {
  /**
   * Busca custos variáveis por aeronave
   */
  static async findByAircraftId(aircraftId: string) {
    const { data, error } = await supabase
      .from('variable_costs')
      .select('*')
      .eq('aircraft_id', aircraftId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Cria ou atualiza custos variáveis
   */
  static async upsert(variableCostData: any) {
    // Se já existe um registro para esta aeronave, buscar o ID primeiro
    if (variableCostData.aircraft_id && !variableCostData.id) {
      const existing = await this.findByAircraftId(variableCostData.aircraft_id);
      if (existing) {
        variableCostData.id = existing.id;
      }
    }

    // Se tem ID, fazer update; senão, fazer insert
    if (variableCostData.id) {
      const { data, error } = await supabase
        .from('variable_costs')
        .update(variableCostData)
        .eq('id', variableCostData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('variable_costs')
        .insert([variableCostData])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  /**
   * Atualiza custos variáveis
   */
  static async update(id: string, variableCostData: any) {
    const { data, error } = await supabase
      .from('variable_costs')
      .update(variableCostData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Remove custos variáveis
   */
  static async delete(id: string) {
    const { error } = await supabase
      .from('variable_costs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
}

