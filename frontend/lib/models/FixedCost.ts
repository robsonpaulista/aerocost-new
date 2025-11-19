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
    console.log('[FixedCost.upsert] Dados recebidos:', fixedCostData);
    
    // Se já existe um registro para esta aeronave, buscar o ID primeiro
    let existingId: string | null = null;
    if (fixedCostData.aircraft_id) {
      const existing = await this.findByAircraftId(fixedCostData.aircraft_id);
      if (existing) {
        existingId = existing.id;
        console.log('[FixedCost.upsert] Registro existente encontrado:', existing);
      } else {
        console.log('[FixedCost.upsert] Nenhum registro existente encontrado');
      }
    }

    // Se tem ID, fazer update; senão, fazer insert
    if (existingId || fixedCostData.id) {
      const idToUpdate = existingId || fixedCostData.id;
      // Remover id e aircraft_id do objeto de update (não devem ser atualizados)
      const { id, aircraft_id, ...updateData } = fixedCostData;
      
      console.log('[FixedCost.upsert] Fazendo UPDATE com ID:', idToUpdate);
      console.log('[FixedCost.upsert] Dados para update:', updateData);
      
      const { data, error } = await supabase
        .from('fixed_costs')
        .update(updateData)
        .eq('id', idToUpdate)
        .select()
        .single();

      if (error) {
        console.error('[FixedCost.upsert] Erro no update:', error);
        throw error;
      }
      
      console.log('[FixedCost.upsert] Update realizado com sucesso:', data);
      return data;
    } else {
      console.log('[FixedCost.upsert] Fazendo INSERT');
      const { data, error } = await supabase
        .from('fixed_costs')
        .insert([fixedCostData])
        .select()
        .single();

      if (error) {
        console.error('[FixedCost.upsert] Erro no insert:', error);
        throw error;
      }
      
      console.log('[FixedCost.upsert] Insert realizado com sucesso:', data);
      return data;
    }
  }

  /**
   * Atualiza custos fixos
   */
  static async update(id: string, fixedCostData: any) {
    console.log('[FixedCost.update] ID:', id);
    console.log('[FixedCost.update] Dados recebidos:', fixedCostData);
    console.log('[FixedCost.update] insurance recebido:', fixedCostData.insurance);
    
    // Garantir que aircraft_id não seja atualizado
    const { aircraft_id, ...updateData } = fixedCostData;
    
    console.log('[FixedCost.update] Dados para update (sem aircraft_id):', updateData);
    
    const { data, error } = await supabase
      .from('fixed_costs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[FixedCost.update] Erro:', error);
      throw error;
    }
    
    console.log('[FixedCost.update] Dados retornados do banco:', data);
    console.log('[FixedCost.update] insurance retornado:', data?.insurance);
    
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

