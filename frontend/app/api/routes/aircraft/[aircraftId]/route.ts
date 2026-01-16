// API Route do Next.js para Rotas por Aircraft ID
// NOTA: Rotas são independentes de aeronave, então retorna todas as rotas
import { NextRequest, NextResponse } from 'next/server';
import { Route } from '@/lib/models/Route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    // Rotas são independentes de aeronave, então retorna todas as rotas
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

