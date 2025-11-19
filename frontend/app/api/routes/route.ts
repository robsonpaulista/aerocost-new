// API Route do Next.js para Rotas
import { NextRequest, NextResponse } from 'next/server';
import { Route } from '@/lib/models/Route';

export async function GET(request: NextRequest) {
  try {
    // Buscar aircraftId da query string
    const { searchParams } = new URL(request.url);
    const aircraftId = searchParams.get('aircraftId');
    
    if (aircraftId) {
      // Listar rotas por aircraft
      const routes = await Route.findByAircraftId(aircraftId);
      return NextResponse.json(routes);
    } else {
      return NextResponse.json(
        { error: 'aircraftId is required' },
        { status: 400 }
      );
    }
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
