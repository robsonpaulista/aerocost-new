// API Route do Next.js para Rota por ID (single)
import { NextRequest, NextResponse } from 'next/server';
import { Route } from '@/lib/models/Route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const route = await Route.findById(id);
    if (!route) {
      return NextResponse.json(
        { error: 'Route not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(route);
  } catch (error: any) {
    console.error('[Routes API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

