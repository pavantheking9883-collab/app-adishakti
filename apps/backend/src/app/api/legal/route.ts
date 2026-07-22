import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') || 'te';

    const videos = await prisma.legalVideo.findMany({
      where: { verified: true },
      orderBy: { createdAt: 'desc' }
    });

    const officers = await prisma.protectionOfficer.findMany({
      orderBy: { district: 'asc' }
    });

    return NextResponse.json({ success: true, videos, officers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.type === 'VIDEO') {
      const video = await prisma.legalVideo.create({ data: body.data });
      return NextResponse.json({ success: true, video });
    }
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
