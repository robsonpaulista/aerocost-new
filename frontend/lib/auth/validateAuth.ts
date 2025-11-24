// Helper para validar autenticação básica (não necessariamente admin)
import { NextRequest } from 'next/server';
import { User } from '@/lib/models/User';

/**
 * Valida se o usuário está autenticado (não precisa ser admin)
 * Usado para operações que qualquer usuário autenticado pode fazer
 */
export async function requireAuth(request: NextRequest): Promise<{ user: any; error?: string }> {
  try {
    const userEmail = request.headers.get('x-user-email');
    
    if (!userEmail) {
      return { 
        user: null, 
        error: 'Email do usuário não fornecido' 
      };
    }

    // Buscar usuário no Firestore
    const user = await User.findByEmail(userEmail);
    
    if (!user) {
      return { user: null, error: 'Usuário não encontrado' };
    }

    if (!user.is_active) {
      return { user: null, error: 'Usuário inativo' };
    }

    return { user };
  } catch (error: any) {
    console.error('[requireAuth] Erro:', error);
    return { user: null, error: error.message || 'Erro ao validar autenticação' };
  }
}

