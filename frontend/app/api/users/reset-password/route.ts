// API Route do Next.js para Resetar Senha
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();

    console.log('[Reset Password API] Recebida requisição de reset de senha');
    console.log('[Reset Password API] Email:', email);
    console.log('[Reset Password API] Nova senha fornecida:', newPassword ? `SIM (${newPassword.length} caracteres)` : 'NÃO');

    if (!email || !newPassword) {
      console.log('[Reset Password API] Erro: Email ou nova senha faltando');
      return NextResponse.json(
        { error: 'Email e nova senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário por email
    console.log('[Reset Password API] Buscando usuário...');
    const user = await User.findByEmail(email);
    
    if (!user) {
      console.log('[Reset Password API] Usuário não encontrado:', email);
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    console.log('[Reset Password API] Usuário encontrado:', {
      id: user.id,
      email: user.email,
      hasPasswordHash: !!user.password_hash
    });

    // Atualizar senha (o método User.update já faz o hash)
    console.log('[Reset Password API] Atualizando senha...');
    await User.update(user.id, { password: newPassword });

    console.log('[Reset Password API] Senha atualizada com sucesso para:', email);
    return NextResponse.json({
      message: 'Senha resetada com sucesso',
      email: user.email
    });
  } catch (error: any) {
    console.error('[Reset Password API Error]', error);
    console.error('[Reset Password API Error] Stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}




