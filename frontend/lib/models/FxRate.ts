import { supabase } from '../config/supabase';

export class FxRate {
  /**
   * Busca taxa de câmbio atual (mais recente)
   */
  static async getCurrent() {
    const { data, error } = await supabase
      .from('fx_rates')
      .select('*')
      .order('effective_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Busca todas as taxas de câmbio
   */
  static async findAll() {
    const { data, error } = await supabase
      .from('fx_rates')
      .select('*')
      .order('effective_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Cria nova taxa de câmbio
   */
  static async create(fxRateData: any) {
    const { data, error } = await supabase
      .from('fx_rates')
      .insert([fxRateData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

