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
    console.log('[VariableCost.upsert] Dados recebidos:', variableCostData);
    
    // Se já existe um registro para esta aeronave, buscar o ID primeiro
    let existingId: string | null = null;
    if (variableCostData.aircraft_id) {
      const existing = await this.findByAircraftId(variableCostData.aircraft_id);
      if (existing) {
        existingId = existing.id;
        console.log('[VariableCost.upsert] Registro existente encontrado:', existing);
      } else {
        console.log('[VariableCost.upsert] Nenhum registro existente encontrado');
      }
    }

    // Se tem ID, fazer update; senão, fazer insert
    if (existingId || variableCostData.id) {
      const idToUpdate = existingId || variableCostData.id;
      // Remover id e aircraft_id do objeto de update (não devem ser atualizados)
      const { id, aircraft_id, ...updateData } = variableCostData;
      
      console.log('[VariableCost.upsert] Fazendo UPDATE com ID:', idToUpdate);
      console.log('[VariableCost.upsert] Dados para update:', updateData);
      
      const { data, error } = await supabase
        .from('variable_costs')
        .update(updateData)
        .eq('id', idToUpdate)
        .select()
        .single();

      if (error) {
        console.error('[VariableCost.upsert] Erro no update:', error);
        throw error;
      }
      
      console.log('[VariableCost.upsert] Update realizado com sucesso:', data);
      return data;
    } else {
      console.log('[VariableCost.upsert] Fazendo INSERT');
      const { data, error } = await supabase
        .from('variable_costs')
        .insert([variableCostData])
        .select()
        .single();

      if (error) {
        console.error('[VariableCost.upsert] Erro no insert:', error);
        throw error;
      }
      
      console.log('[VariableCost.upsert] Insert realizado com sucesso:', data);
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

