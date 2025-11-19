// API Route do Next.js para Route Cost
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { aircraftId } = resolvedParams;
    
    // Obter query params
    const searchParams = request.nextUrl.searchParams;
    const routeId = searchParams.get('routeId');
    
    // TODO: Implementar cálculo de custo por rota
    // Por enquanto, retorna estrutura básica
    return NextResponse.json({
      routeId: routeId || null,
      totalCostPerHour: 0,
      calculatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Calculations API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

