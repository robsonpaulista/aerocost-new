import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';

export class FixedCost {
  private static collectionName = 'fixed_costs';

  /**
   * Busca custos fixos por aeronave
   */
  static async findByAircraftId(aircraftId: string) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('aircraft_id', '==', aircraftId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        // Converter Timestamps para ISO strings
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        // Garantir que valores numéricos são números
        crew_monthly: typeof data.crew_monthly === 'string' ? parseFloat(data.crew_monthly) : (data.crew_monthly || 0),
        pilot_hourly_rate: typeof data.pilot_hourly_rate === 'string' ? parseFloat(data.pilot_hourly_rate) : (data.pilot_hourly_rate || 0),
        hangar_monthly: typeof data.hangar_monthly === 'string' ? parseFloat(data.hangar_monthly) : (data.hangar_monthly || 0),
        ec_fixed_usd: typeof data.ec_fixed_usd === 'string' ? parseFloat(data.ec_fixed_usd) : (data.ec_fixed_usd || 0),
        insurance: typeof data.insurance === 'string' ? parseFloat(data.insurance) : (data.insurance || 0),
        administration: typeof data.administration === 'string' ? parseFloat(data.administration) : (data.administration || 0),
      };
    } catch (error) {
      console.error('[FixedCost.findByAircraftId] Erro:', error);
      throw error;
    }
  }

  /**
   * Cria ou atualiza custos fixos
   */
  static async upsert(fixedCostData: any) {
    try {
      // Verificar se já existe um registro para esta aeronave
      const existing = await this.findByAircraftId(fixedCostData.aircraft_id);
      
      const now = new Date().toISOString();
      const dataToSave = {
        aircraft_id: fixedCostData.aircraft_id,
        crew_monthly: Number(fixedCostData.crew_monthly) || 0,
        pilot_hourly_rate: Number(fixedCostData.pilot_hourly_rate) || 0,
        hangar_monthly: Number(fixedCostData.hangar_monthly) || 0,
        ec_fixed_usd: Number(fixedCostData.ec_fixed_usd) || 0,
        insurance: Number(fixedCostData.insurance) || 0,
        administration: Number(fixedCostData.administration) || 0,
        updated_at: now,
      };

      if (existing) {
        // UPDATE - usar o ID existente
        const docRef = doc(db, this.collectionName, existing.id);
        await updateDoc(docRef, dataToSave);
        
        return {
          id: existing.id,
          ...dataToSave,
          created_at: existing.created_at,
        };
      } else {
        // INSERT - criar novo documento
        const docRef = doc(collection(db, this.collectionName));
        await setDoc(docRef, {
          ...dataToSave,
          created_at: now,
        });
        
        return {
          id: docRef.id,
          ...dataToSave,
          created_at: now,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza custos fixos
   */
  static async update(id: string, fixedCostData: any) {
    
    try {
      const docRef = doc(db, this.collectionName, id);
      
      const updateData = {
        crew_monthly: Number(fixedCostData.crew_monthly) || 0,
        pilot_hourly_rate: Number(fixedCostData.pilot_hourly_rate) || 0,
        hangar_monthly: Number(fixedCostData.hangar_monthly) || 0,
        ec_fixed_usd: Number(fixedCostData.ec_fixed_usd) || 0,
        insurance: Number(fixedCostData.insurance) || 0,
        administration: Number(fixedCostData.administration) || 0,
        updated_at: new Date().toISOString(),
      };
      
      console.log('[FixedCost.update] Dados para update:', updateData);
      
      await updateDoc(docRef, updateData);
      
      // Buscar o documento atualizado
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      
      
      return {
        id: updatedDoc.id,
        ...data,
        created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
        updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
        crew_monthly: typeof data?.crew_monthly === 'string' ? parseFloat(data.crew_monthly) : (data?.crew_monthly || 0),
        pilot_hourly_rate: typeof data?.pilot_hourly_rate === 'string' ? parseFloat(data.pilot_hourly_rate) : (data?.pilot_hourly_rate || 0),
        hangar_monthly: typeof data?.hangar_monthly === 'string' ? parseFloat(data.hangar_monthly) : (data?.hangar_monthly || 0),
        ec_fixed_usd: typeof data?.ec_fixed_usd === 'string' ? parseFloat(data.ec_fixed_usd) : (data?.ec_fixed_usd || 0),
        insurance: typeof data?.insurance === 'string' ? parseFloat(data.insurance) : (data?.insurance || 0),
        administration: typeof data?.administration === 'string' ? parseFloat(data.administration) : (data?.administration || 0),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove custos fixos
   */
  static async delete(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('[FixedCost.delete] Erro:', error);
      throw error;
    }
  }
}
