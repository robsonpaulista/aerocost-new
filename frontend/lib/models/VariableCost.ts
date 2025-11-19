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
    const { data, error } = await supabase
      .from('variable_costs')
      .upsert(variableCostData, { onConflict: 'aircraft_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
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

