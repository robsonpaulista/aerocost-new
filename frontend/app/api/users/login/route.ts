import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('[Login API] Recebida requisição de login');
    console.log('[Login API] Email:', email);
    console.log('[Login API] Senha fornecida:', password ? `SIM (${password.length} caracteres)` : 'NÃO');

    if (!email || !password) {
      console.log('[Login API] Erro: Email ou senha faltando');
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar credenciais
    const user = await User.verifyCredentials(email, password);

    if (!user) {
      console.log('[Login API] Credenciais inválidas para:', email);
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

    console.log('[Login API] Login bem-sucedido para:', email);
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
      message: 'Login realizado com sucesso',
    });
  } catch (error: any) {
    console.error('[Login API Error]', error);
    console.error('[Login API Error] Stack:', error.stack);
    
    // Se for erro de usuário inativo, retornar 403
    if (error.message === 'Usuário inativo') {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
