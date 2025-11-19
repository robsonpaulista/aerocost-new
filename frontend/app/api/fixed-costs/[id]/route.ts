// API Route do Next.js para Fixed Costs por ID
import { NextRequest, NextResponse } from 'next/server';
import { FixedCost } from '@/lib/models/FixedCost';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const body = await request.json();
    const fixedCost = await FixedCost.update(id, body);
    return NextResponse.json(fixedCost);
  } catch (error: any) {
    console.error('[Fixed Costs API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

