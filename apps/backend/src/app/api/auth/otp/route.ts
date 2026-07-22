import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { phone, otp, action, name, language, userId, consentAudioMonitoring } = await req.json();

    if (action === 'REQUEST_OTP') {
      if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
      // In production, Twilio/SMS service sends OTP. In dev, OTP is 123456
      return NextResponse.json({ success: true, message: 'OTP sent to ' + phone, testOtp: '123456' });
    }

    if (action === 'VERIFY_OTP') {
      if (otp !== '123456' && otp !== '999999') {
        return NextResponse.json({ error: 'Invalid OTP code. Use 123456 for testing.' }, { status: 400 });
      }

      let user = await prisma.user.findUnique({
        where: { phone },
        include: { guardians: { orderBy: { priorityOrder: 'asc' } } }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            phone,
            name: name || 'Adishakti User',
            language: language || 'te'
          },
          include: { guardians: { orderBy: { priorityOrder: 'asc' } } }
        });
      }

      return NextResponse.json({ success: true, user });
    }

    if (action === 'UPDATE_PROFILE') {
      if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name,
          consentAudioMonitoring: !!consentAudioMonitoring,
          consentTimestamp: consentAudioMonitoring ? new Date() : undefined
        },
        include: { guardians: { orderBy: { priorityOrder: 'asc' } } }
      });

      return NextResponse.json({ success: true, user: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
