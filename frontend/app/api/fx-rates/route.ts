// API Route do Next.js para FX Rates
import { NextRequest, NextResponse } from 'next/server';
import { FxRate } from '@/lib/models/FxRate';

export async function GET(request: NextRequest) {
  try {
    const rates = await FxRate.findAll();
    return NextResponse.json(rates);
  } catch (error: any) {
    console.error('[FX Rates API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rate = await FxRate.create(body);
    return NextResponse.json(rate, { status: 201 });
  } catch (error: any) {
    console.error('[FX Rates API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 400 }
    );
  }
}

