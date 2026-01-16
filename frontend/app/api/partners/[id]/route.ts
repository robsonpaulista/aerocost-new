// API Route do Next.js para Partner por ID
import { NextRequest, NextResponse } from 'next/server';
import { Partner } from '@/lib/models/Partner';
import { requireAuth } from '@/lib/auth/validateAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const partner = await Partner.findById(id);
    if (!partner) {
      return NextResponse.json(
        { error: 'Sócio não encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(partner);
  } catch (error: any) {
    console.error('[Partners API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Validar se está autenticado (não precisa ser admin)
    const { user, error } = await requireAuth(request);
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Acesso negado. Faça login para continuar.' },
        { status: 403 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const { name, email, phone, color, is_active } = await request.json();

    // Verifica se sócio existe
    const existingPartner = await Partner.findById(id);
    if (!existingPartner) {
      return NextResponse.json(
        { error: 'Sócio não encontrado' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (color) updateData.color = color;
    if (is_active !== undefined) updateData.is_active = is_active;

    const partner = await Partner.update(id, updateData);
    return NextResponse.json(partner);
  } catch (error: any) {
    console.error('[Partners API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Validar se está autenticado (não precisa ser admin)
    const { user, error } = await requireAuth(request);
    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Acesso negado. Faça login para continuar.' },
        { status: 403 }
      );
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    await Partner.delete(id);
    return NextResponse.json({ message: 'Sócio desativado com sucesso' });
  } catch (error: any) {
    console.error('[Partners API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
