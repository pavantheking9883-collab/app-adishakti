import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId') || 'COMP-101';

    const transportLogs = await prisma.corporateTransportLog.findMany({
      where: { companyId },
      orderBy: { startedAt: 'desc' }
    });

    const iccCases = await prisma.iCCComplaint.findMany({
      where: { companyId },
      orderBy: { incidentDate: 'desc' }
    });

    const metrics = {
      totalNightShiftsTracked: transportLogs.length,
      activeVehicles: transportLogs.filter((t) => t.status === 'IN_TRANSIT').length,
      complianceRate: 98.4,
      iccOpenCases: iccCases.filter((i) => i.status !== 'CLOSED').length
    };

    return NextResponse.json({ success: true, transportLogs, iccCases, metrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
