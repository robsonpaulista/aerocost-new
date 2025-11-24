// Helper para validar role do usuário nas rotas de API
import { NextRequest } from 'next/server';
import { User } from '@/lib/models/User';

/**
 * Valida se o usuário autenticado tem permissão de admin
 * Por enquanto, valida através do email no header (para desenvolvimento)
 * Em produção, deve usar token JWT do Firebase Auth
 */
export async function requireAdmin(request: NextRequest): Promise<{ user: any; error?: string }> {
  try {
    // Por enquanto, vamos usar um header customizado ou buscar do body
    // Em produção, deve extrair do token JWT do Firebase Auth
    const authHeader = request.headers.get('authorization');
    const userEmail = request.headers.get('x-user-email');
    
    // Se não tiver email no header, retorna erro
    // Em produção, extrair do token JWT
    if (!userEmail) {
      return { 
        user: null, 
        error: 'Email do usuário não fornecido. Em produção, use token JWT.' 
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

    if (user.role !== 'admin') {
      return { user: null, error: 'Acesso negado. Apenas administradores podem acessar esta rota.' };
    }

    return { user };
  } catch (error: any) {
    console.error('[requireAdmin] Erro:', error);
    return { user: null, error: error.message || 'Erro ao validar permissões' };
  }
}

