// API Route do Next.js para Users
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const users = await User.findAll();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('[Users API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, is_active } = await request.json();

    // Validações básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verifica se email já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      is_active: is_active !== undefined ? is_active : true,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('[Users API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

