import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const stories = await prisma.communityStory.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, stories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const story = await prisma.communityStory.create({
      data: {
        title: body.title,
        content: body.content,
        authorName: body.authorName || 'Anonymous Sister',
        district: body.district || 'Andhra Pradesh',
        voiceUrl: body.voiceUrl,
        isApproved: true // Auto approve in dev
      }
    });

    return NextResponse.json({ success: true, story });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
