import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  orderBy,
  limit 
} from 'firebase/firestore';

export class FxRate {
  private static collectionName = 'fx_rates';

  /**
   * Busca taxa de câmbio atual (mais recente)
   */
  static async getCurrent() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('effective_date', 'desc'),
        limit(1)
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
        effective_date: data.effective_date?.toDate?.()?.toISOString() || data.effective_date,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
      };
    } catch (error) {
      console.error('[FxRate.getCurrent] Erro:', error);
      throw error;
    }
  }

  /**
   * Busca todas as taxas de câmbio
   */
  static async findAll() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('effective_date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          effective_date: data.effective_date?.toDate?.()?.toISOString() || data.effective_date,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        };
      });
    } catch (error) {
      console.error('[FxRate.findAll] Erro:', error);
      throw error;
    }
  }

  /**
   * Cria nova taxa de câmbio
   */
  static async create(fxRateData: any) {
    try {
      const docRef = doc(collection(db, this.collectionName));
      const now = new Date().toISOString();
      
      await setDoc(docRef, {
        ...fxRateData,
        created_at: now,
      });
      
      return {
        id: docRef.id,
        ...fxRateData,
        created_at: now,
      };
    } catch (error) {
      console.error('[FxRate.create] Erro:', error);
      throw error;
    }
  }
}
