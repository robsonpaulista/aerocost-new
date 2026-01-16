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

export class Partner {
  private static collectionName = 'partners';

  /**
   * Busca todos os sócios
   */
  static async findAll() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          color: data.color || '#3B82F6', // Cor padrão azul
          is_active: data.is_active !== undefined ? data.is_active : true,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        };
      });
    } catch (error) {
      console.error('[Partner.findAll] Erro:', error);
      throw error;
    }
  }

  /**
   * Busca sócio por ID
   */
  static async findById(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        color: data.color || '#3B82F6',
        is_active: data.is_active !== undefined ? data.is_active : true,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      };
    } catch (error) {
      console.error('[Partner.findById] Erro:', error);
      throw error;
    }
  }

  /**
   * Busca sócio por nome
   */
  static async findByName(name: string) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('name', '==', name)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        color: data.color || '#3B82F6',
        is_active: data.is_active !== undefined ? data.is_active : true,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      };
    } catch (error) {
      console.error('[Partner.findByName] Erro:', error);
      throw error;
    }
  }

  /**
   * Cria novo sócio
   */
  static async create(partnerData: { name: string; email?: string | null; phone?: string | null; color?: string; is_active?: boolean }) {
    try {
      const docRef = doc(collection(db, this.collectionName));
      const now = new Date().toISOString();
      
      // Gerar cor aleatória se não fornecida
      const colors = [
        '#3B82F6', // Azul
        '#10B981', // Verde
        '#F59E0B', // Amarelo
        '#EF4444', // Vermelho
        '#8B5CF6', // Roxo
        '#EC4899', // Rosa
        '#06B6D4', // Ciano
        '#F97316', // Laranja
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      await setDoc(docRef, {
        name: partnerData.name,
        email: partnerData.email || null,
        phone: partnerData.phone || null,
        color: partnerData.color || randomColor,
        is_active: partnerData.is_active !== undefined ? partnerData.is_active : true,
        created_at: now,
        updated_at: now,
      });
      
      return {
        id: docRef.id,
        name: partnerData.name,
        email: partnerData.email || null,
        phone: partnerData.phone || null,
        color: partnerData.color || randomColor,
        is_active: partnerData.is_active !== undefined ? partnerData.is_active : true,
        created_at: now,
        updated_at: now,
      };
    } catch (error) {
      console.error('[Partner.create] Erro:', error);
      throw error;
    }
  }

  /**
   * Atualiza sócio
   */
  static async update(id: string, partnerData: Partial<{ name: string; email: string | null; phone: string | null; color: string; is_active: boolean }>) {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (partnerData.name) updateData.name = partnerData.name;
      if (partnerData.email !== undefined) updateData.email = partnerData.email;
      if (partnerData.phone !== undefined) updateData.phone = partnerData.phone;
      if (partnerData.color) updateData.color = partnerData.color;
      if (partnerData.is_active !== undefined) updateData.is_active = partnerData.is_active;

      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        name: data?.name,
        email: data?.email || null,
        phone: data?.phone || null,
        color: data?.color || '#3B82F6',
        is_active: data?.is_active !== undefined ? data?.is_active : true,
        created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
        updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
      };
    } catch (error) {
      console.error('[Partner.update] Erro:', error);
      throw error;
    }
  }

  /**
   * Remove sócio (soft delete - desativa)
   */
  static async delete(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        is_active: false,
        updated_at: new Date().toISOString()
      });
      
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        name: data?.name,
        email: data?.email || null,
        phone: data?.phone || null,
        color: data?.color || '#3B82F6',
        is_active: false,
        created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
        updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
      };
    } catch (error) {
      console.error('[Partner.delete] Erro:', error);
      throw error;
    }
  }
}
