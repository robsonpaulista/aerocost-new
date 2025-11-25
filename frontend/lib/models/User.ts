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
import bcrypt from 'bcryptjs';

export class User {
  private static collectionName = 'users';

  /**
   * Busca todos os usuários
   */
  static async findAll() {
    try {
      // Buscar todos os usuários sem orderBy para evitar problemas de índice
      const q = query(collection(db, this.collectionName));
      const querySnapshot = await getDocs(q);
      
      const users = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          role: data.role || 'user',
          is_active: data.is_active !== undefined ? data.is_active : true,
          last_login: data.last_login?.toDate?.()?.toISOString() || data.last_login,
          created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
          updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
        };
      });
      
      // Ordenar manualmente por data de criação (mais recente primeiro)
      return users.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca usuário por ID
   */
  static async findById(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('User not found');
      }
      
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        email: data.email,
        role: data.role,
        is_active: data.is_active,
        last_login: data.last_login?.toDate?.()?.toISOString() || data.last_login,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      };
    } catch (error) {
      console.error('[User.findById] Erro:', error);
      throw error;
    }
  }

  /**
   * Busca usuário por email
   */
  static async findByEmail(email: string) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('email', '==', email)
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
        is_active: data.is_active !== undefined ? data.is_active : true,
        password_hash: data.password_hash || '',
        last_login: data.last_login?.toDate?.()?.toISOString() || data.last_login,
        created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
        updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      } as any;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verifica credenciais de login
   */
  static async verifyCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      return null;
    }

    if (!user.is_active) {
      throw new Error('Usuário inativo');
    }

    // Verificar se o hash está no formato bcrypt válido ($2a$, $2b$, $2y$)
    const hashStartsWithBcrypt = user.password_hash && (
      user.password_hash.startsWith('$2a$') || 
      user.password_hash.startsWith('$2b$') || 
      user.password_hash.startsWith('$2y$')
    );

    let isValid = false;
    
    // Se o hash não está no formato bcrypt, pode ser um hash do PostgreSQL crypt()
    // Nesse caso, precisamos resetar a senha
    if (!hashStartsWithBcrypt) {
      // Hash inválido ou em formato incompatível
      // Retornar null para indicar credenciais inválidas
      // O usuário precisará resetar a senha
      return null;
    }
    
    try {
      isValid = await bcrypt.compare(password, user.password_hash);
    } catch (bcryptError) {
      isValid = false;
    }
    
    if (!isValid) {
      return null;
    }

    await this.updateLastLogin(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    };
  }

  /**
   * Atualiza último login
   */
  static async updateLastLogin(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        last_login: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('[User.updateLastLogin] Erro:', error);
      throw error;
    }
  }

  /**
   * Cria novo usuário
   */
  static async create(userData: { name: string; email: string; password?: string; role?: string; is_active?: boolean }) {
    try {
      // Hash da senha antes de salvar (se fornecida)
      let password_hash: string | undefined = undefined;
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        password_hash = await bcrypt.hash(userData.password, salt);
      }
      
      const docRef = doc(collection(db, this.collectionName));
      const now = new Date().toISOString();
      
      const userDoc: any = {
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        is_active: userData.is_active !== undefined ? userData.is_active : true,
        created_at: now,
        updated_at: now,
      };

      // Só adicionar password_hash se foi fornecido
      if (password_hash) {
        userDoc.password_hash = password_hash;
      }
      
      await setDoc(docRef, userDoc);
      
      return {
        id: docRef.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        is_active: userData.is_active !== undefined ? userData.is_active : true,
        created_at: now,
        updated_at: now,
      };
    } catch (error) {
      console.error('[User.create] Erro:', error);
      throw error;
    }
  }

  /**
   * Atualiza usuário
   */
  static async update(id: string, userData: Partial<{ name: string; email: string; password: string; role: string; is_active: boolean }>) {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      // Se houver senha, fazer hash antes de atualizar
      let password_hash: string | undefined;
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        password_hash = await bcrypt.hash(userData.password, salt);
      }

      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (userData.name) updateData.name = userData.name;
      if (userData.email) updateData.email = userData.email;
      if (password_hash) updateData.password_hash = password_hash;
      if (userData.role) updateData.role = userData.role;
      if (userData.is_active !== undefined) updateData.is_active = userData.is_active;

      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        name: data?.name,
        email: data?.email,
        role: data?.role,
        is_active: data?.is_active,
        last_login: data?.last_login?.toDate?.()?.toISOString() || data?.last_login,
        created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
        updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
      };
    } catch (error) {
      console.error('[User.update] Erro:', error);
      throw error;
    }
  }

  /**
   * Remove usuário (soft delete - desativa)
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
        ...data,
        created_at: data?.created_at?.toDate?.()?.toISOString() || data?.created_at,
        updated_at: data?.updated_at?.toDate?.()?.toISOString() || data?.updated_at,
      };
    } catch (error) {
      console.error('[User.delete] Erro:', error);
      throw error;
    }
  }

  /**
   * Remove usuário permanentemente
   */
  static async deletePermanent(id: string) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('[User.deletePermanent] Erro:', error);
      throw error;
    }
  }
}
