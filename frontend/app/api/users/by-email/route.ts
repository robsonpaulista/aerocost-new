// API Route do Next.js para buscar usuário por email (pública para autenticação)
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar usuário por email (sem validação de admin, pois é usado no login)
    // Firestore é case-sensitive, então vamos buscar exatamente como está
    const user = await User.findByEmail(email);
    
    if (!user) {
      // Tentar buscar com case-insensitive buscando todos e filtrando
      const allUsers = await User.findAll();
      const foundUser = allUsers.find(u => 
        u.email?.toLowerCase().trim() === email.toLowerCase().trim()
      );
      
      if (!foundUser) {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }
      
      // Retornar apenas dados públicos (sem password_hash)
      return NextResponse.json({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        is_active: foundUser.is_active,
        last_login: foundUser.last_login,
        created_at: foundUser.created_at,
        updated_at: foundUser.updated_at,
      });
    }

    // Retornar apenas dados públicos (sem password_hash)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      last_login: user.last_login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  } catch (error: any) {
    console.error('[Users API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

