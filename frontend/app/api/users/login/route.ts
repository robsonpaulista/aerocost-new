import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar credenciais
    const user = await User.verifyCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

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
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
