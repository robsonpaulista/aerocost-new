// API Route do Next.js para FX Rate atual
import { NextRequest, NextResponse } from 'next/server';
import { FxRate } from '@/lib/models/FxRate';

export async function GET(request: NextRequest) {
  try {
    const rate = await FxRate.getCurrent();
    return NextResponse.json(rate);
  } catch (error: any) {
    console.error('[FX Rates API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

