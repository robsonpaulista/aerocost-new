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
  orderBy 
} from 'firebase/firestore';

export class Route {
  private static collectionName = 'routes';

  /**
   * Busca todas as rotas (independentes de aeronave)
   */
  static async findAll() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || doc.data().updated_at,
      }));
    } catch (error) {
      console.error('[Route.findAll] Erro:', error);
      throw error;
    }
  }

  /**
   * Busca rota por ID
   */
  static async findById(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Route not found');
      }
      
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      };
    } catch (error) {
      console.error('[Route.findById] Erro:', error);
      throw error;
    }
  }

  /**
   * Cria nova rota
   */
  static async create(routeData: any) {
    try {
      const docRef = doc(collection(db, this.collectionName));
      const now = new Date().toISOString();
      
      // Remover aircraft_id se existir (rotas são independentes)
      const { aircraft_id, ...routeDataWithoutAircraft } = routeData;
      
      await setDoc(docRef, {
        ...routeDataWithoutAircraft,
        created_at: now,
        updated_at: now,
      });
      
      return {
        id: docRef.id,
        ...routeDataWithoutAircraft,
        created_at: now,
        updated_at: now,
      };
    } catch (error) {
      console.error('[Route.create] Erro:', error);
      throw error;
    }
  }

  /**
   * Atualiza rota
   */
  static async update(id: string, routeData: any) {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      // Remover aircraft_id se existir (rotas são independentes)
      const { aircraft_id, ...routeDataWithoutAircraft } = routeData;
      
      await updateDoc(docRef, {
        ...routeDataWithoutAircraft,
        updated_at: new Date().toISOString(),
      });
      
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
        updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
      };
    } catch (error) {
      console.error('[Route.update] Erro:', error);
      throw error;
    }
  }

  /**
   * Remove rota
   */
  static async delete(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('[Route.delete] Erro:', error);
      throw error;
    }
  }
}
