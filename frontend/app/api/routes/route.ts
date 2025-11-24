// API Route do Next.js para Rotas
import { NextRequest, NextResponse } from 'next/server';
import { Route } from '@/lib/models/Route';

export async function GET(request: NextRequest) {
  try {
    // Rotas são independentes de aeronave - retornar todas
    const routes = await Route.findAll();
    return NextResponse.json(routes);
  } catch (error: any) {
    console.error('[Routes API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const route = await Route.create(body);
    return NextResponse.json(route, { status: 201 });
  } catch (error: any) {
    console.error('[Routes API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 400 }
    );
  }
}
