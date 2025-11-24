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
  orderBy 
} from 'firebase/firestore';

export class Aircraft {
  private static collectionName = 'aircraft';

  /**
   * Busca todas as aeronaves
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
      console.error('[Aircraft.findAll] Erro:', error);
      throw error;
    }
  }

  /**
   * Busca aeronave por ID
   */
  static async findById(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Aircraft not found');
      }
      
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      };
    } catch (error) {
      console.error('[Aircraft.findById] Erro:', error);
      throw error;
    }
  }

  /**
   * Cria nova aeronave
   */
  static async create(aircraftData: any) {
    try {
      const docRef = doc(collection(db, this.collectionName));
      const now = new Date().toISOString();
      
      await setDoc(docRef, {
        ...aircraftData,
        created_at: now,
        updated_at: now,
      });
      
      return {
        id: docRef.id,
        ...aircraftData,
        created_at: now,
        updated_at: now,
      };
    } catch (error: any) {
      console.error('[Aircraft.create] Erro:', error);
      
      // Melhorar mensagem de erro para NOT_FOUND
      if (error.code === 5 || error.code === 'not-found' || error.message?.includes('NOT_FOUND')) {
        throw new Error(
          'Firestore não está habilitado. Acesse o Firebase Console e crie o Firestore Database. ' +
          'Veja o arquivo HABILITAR_FIRESTORE.md para instruções detalhadas.'
        );
      }
      
      throw error;
    }
  }

  /**
   * Atualiza aeronave
   */
  static async update(id: string, aircraftData: any) {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      await updateDoc(docRef, {
        ...aircraftData,
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
      console.error('[Aircraft.update] Erro:', error);
      throw error;
    }
  }

  /**
   * Remove aeronave
   */
  static async delete(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('[Aircraft.delete] Erro:', error);
      throw error;
    }
  }
}
