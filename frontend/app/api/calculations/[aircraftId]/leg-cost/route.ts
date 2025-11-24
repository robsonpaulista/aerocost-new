// API Route do Next.js para Leg Cost
import { NextRequest, NextResponse } from 'next/server';
import { CalculationService } from '@/lib/services/calculationService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { aircraftId } = resolvedParams;
    
    // Obter query params
    const searchParams = request.nextUrl.searchParams;
    const legTimeParam = searchParams.get('legTime');
    const routeIdParam = searchParams.get('routeId');
    
    const legTime = legTimeParam ? parseFloat(legTimeParam) : undefined;
    const routeId = routeIdParam || undefined;
    
    // Calcular custo usando o CalculationService
    const result = await CalculationService.calculateLegCost(
      aircraftId,
      legTime,
      routeId || null
    );
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Calculations API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

