// API Route temporária para atualizar role do usuário
// ⚠️ REMOVER ESTA ROTA APÓS USAR!
// Use apenas para definir o primeiro admin
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, role, secret } = await request.json();

    // Token de segurança para evitar uso acidental
    if (secret !== 'UPDATE_ROLE_2024') {
      return NextResponse.json(
        { error: 'Token de segurança inválido' },
        { status: 403 }
      );
    }

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email e role são obrigatórios' },
        { status: 400 }
      );
    }

    if (role !== 'admin' && role !== 'user') {
      return NextResponse.json(
        { error: 'Role deve ser "admin" ou "user"' },
        { status: 400 }
      );
    }

    // Buscar usuário por email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar role
    const updatedUser = await User.update(user.id, { role });

    console.log(`[Update Role] Role atualizado para ${role} para usuário: ${email}`);

    return NextResponse.json({
      message: 'Role atualizado com sucesso',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        name: updatedUser.name
      }
    });
  } catch (error: any) {
    console.error('[Update Role API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
