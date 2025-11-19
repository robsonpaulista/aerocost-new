// API Route do Next.js para Variable Costs
import { NextRequest, NextResponse } from 'next/server';
import { VariableCost } from '@/lib/models/VariableCost';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const variableCost = await VariableCost.upsert(body);
    return NextResponse.json(variableCost, { status: 201 });
  } catch (error: any) {
    console.error('[Variable Costs API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 400 }
    );
  }
}

