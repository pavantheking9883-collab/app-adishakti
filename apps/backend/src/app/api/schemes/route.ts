import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const targetGroup = searchParams.get('targetGroup');

    const where: any = {};
    if (category) where.category = category;
    if (targetGroup) where.targetGroup = { contains: targetGroup };

    const schemes = await prisma.scheme.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, schemes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scheme = await prisma.scheme.create({ data: body });
    return NextResponse.json({ success: true, scheme });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
