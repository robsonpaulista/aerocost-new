// API Route do Next.js para Partners (Sócios)
import { NextRequest, NextResponse } from 'next/server';
import { Partner } from '@/lib/models/Partner';
import { requireAdmin } from '@/lib/auth/validateRole';

export async function GET(request: NextRequest) {
  try {
    // Listar sócios não requer admin, mas vamos manter por segurança
    const partners = await Partner.findAll();
    return NextResponse.json(partners);
  } catch (error: any) {
    console.error('[Partners API Error]', error);
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

    const { name, email, phone, color, is_active } = await request.json();

    // Validações básicas
    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const newPartner = await Partner.create({
      name,
      email: email || null,
      phone: phone || null,
      color: color || undefined,
      is_active: is_active !== undefined ? is_active : true,
    });

    return NextResponse.json(newPartner, { status: 201 });
  } catch (error: any) {
    console.error('[Partners API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
