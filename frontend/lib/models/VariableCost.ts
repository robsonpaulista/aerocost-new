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
  where 
} from 'firebase/firestore';

export class VariableCost {
  private static collectionName = 'variable_costs';

  /**
   * Busca custos variáveis por aeronave
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
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      };
    } catch (error) {
      console.error('[VariableCost.findByAircraftId] Erro:', error);
      throw error;
    }
  }

  /**
   * Cria ou atualiza custos variáveis
   */
  static async upsert(variableCostData: any) {
    console.log('[VariableCost.upsert] Dados recebidos:', variableCostData);
    
    try {
      // Verificar se já existe um registro para esta aeronave
      const existing = await this.findByAircraftId(variableCostData.aircraft_id);
      
      const now = new Date().toISOString();
      const dataToSave = {
        aircraft_id: variableCostData.aircraft_id,
        ...variableCostData,
        updated_at: now,
      };
      
      // Remover id do objeto de dados
      delete dataToSave.id;

      if (existing) {
        // UPDATE - usar o ID existente
        const docRef = doc(db, this.collectionName, existing.id);
        await updateDoc(docRef, dataToSave);
        
        console.log('[VariableCost.upsert] Update realizado com sucesso');
        
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
        
        console.log('[VariableCost.upsert] Insert realizado com sucesso');
        
        return {
          id: docRef.id,
          ...dataToSave,
          created_at: now,
        };
      }
    } catch (error) {
      console.error('[VariableCost.upsert] Erro:', error);
      throw error;
    }
  }

  /**
   * Atualiza custos variáveis
   */
  static async update(id: string, variableCostData: any) {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      const updateData = {
        ...variableCostData,
        updated_at: new Date().toISOString(),
      };
      
      delete updateData.id;
      delete updateData.aircraft_id;
      
      await updateDoc(docRef, updateData);
      
      // Buscar o documento atualizado
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
        updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
      };
    } catch (error) {
      console.error('[VariableCost.update] Erro:', error);
      throw error;
    }
  }

  /**
   * Remove custos variáveis
   */
  static async delete(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('[VariableCost.delete] Erro:', error);
      throw error;
    }
  }
}
