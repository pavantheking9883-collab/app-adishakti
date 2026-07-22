import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const guardians = await prisma.guardian.findMany({
    where: { userId },
    orderBy: { priorityOrder: 'asc' }
  });

  return NextResponse.json({ success: true, guardians });
}

export async function POST(req: Request) {
  try {
    const { userId, name, phone, priorityOrder } = await req.json();

    if (!userId || !name || !phone) {
      return NextResponse.json({ error: 'userId, name, phone required' }, { status: 400 });
    }

    const count = await prisma.guardian.count({ where: { userId } });

    const guardian = await prisma.guardian.create({
      data: {
        userId,
        name,
        phone,
        priorityOrder: priorityOrder || count + 1,
        verified: true
      }
    });

    return NextResponse.json({ success: true, guardian });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.guardian.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
