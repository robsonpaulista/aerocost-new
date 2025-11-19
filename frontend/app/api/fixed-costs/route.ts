// API Route do Next.js para Fixed Costs
import { NextRequest, NextResponse } from 'next/server';
import { FixedCost } from '@/lib/models/FixedCost';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fixedCost = await FixedCost.upsert(body);
    return NextResponse.json(fixedCost, { status: 201 });
  } catch (error: any) {
    console.error('[Fixed Costs API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 400 }
    );
  }
}

