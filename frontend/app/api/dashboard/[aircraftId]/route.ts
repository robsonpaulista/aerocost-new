// API Route do Next.js para Dashboard
import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/lib/services/dashboardService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ aircraftId: string }> | { aircraftId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { aircraftId } = resolvedParams;
    const data = await DashboardService.getDashboardData(aircraftId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Dashboard API Error]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

