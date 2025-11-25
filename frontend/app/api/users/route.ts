// API Route do Next.js para Users
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import { requireAdmin } from '@/lib/auth/validateRole';

export async function GET(request: NextRequest) {
  try {
    // Validar se é admin para listar todos os usuários
    const { user, error } = await requireAdmin(request);
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Acesso negado' },
        { status: 403 }
      );
    }

    const users = await User.findAll();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validar se é admin
    const { user: adminUser, error } = await requireAdmin(request);
    if (error || !adminUser) {
      return NextResponse.json(
        { error: error || 'Acesso negado' },
        { status: 403 }
      );
    }

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

    const newUser = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      is_active: is_active !== undefined ? is_active : true,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

