// Helper para validar role do usuário nas rotas de API
import { NextRequest } from 'next/server';
import { User } from '@/lib/models/User';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/config/firebase';

/**
 * Valida se o usuário autenticado tem permissão de admin
 * Por enquanto, valida através do email no header (para desenvolvimento)
 * Em produção, deve usar token JWT do Firebase Auth
 */
export async function requireAdmin(request: NextRequest): Promise<{ user: any; error?: string }> {
  try {
    const userEmail = request.headers.get('x-user-email');
    
    if (!userEmail) {
      return { 
        user: null, 
        error: 'Email do usuário não fornecido. Em produção, use token JWT.' 
      };
    }

    // Buscar usuário no Firestore (tenta busca exata primeiro, depois case-insensitive)
    let user = await User.findByEmail(userEmail);
    
    // Se não encontrou com busca exata, tenta case-insensitive usando busca direta no Firestore
    if (!user) {
      try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        
        user = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              email: data.email,
              role: data.role || 'user',
              is_active: data.is_active !== undefined ? data.is_active : true,
            };
          })
          .find(u => 
            u.email?.toLowerCase().trim() === userEmail.toLowerCase().trim()
          ) || null;
      } catch (searchError: any) {
        // Ignorar erro na busca case-insensitive
      }
    }
    
    if (!user) {
      return { user: null, error: 'Usuário não encontrado' };
    }

    if (!user.is_active) {
      return { user: null, error: 'Usuário inativo' };
    }

    if (user.role !== 'admin') {
      return { user: null, error: 'Acesso negado. Apenas administradores podem acessar esta rota.' };
    }

    return { user };
  } catch (error: any) {
    return { user: null, error: error.message || 'Erro ao validar permissões' };
  }
}


