// API Route do Next.js para Variable Costs por ID
import { NextRequest, NextResponse } from 'next/server';
import { VariableCost } from '@/lib/models/VariableCost';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();
    const variableCost = await VariableCost.update(id, body);
    return NextResponse.json(variableCost);
  } catch (error: any) {
    console.error('[Variable Costs API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

