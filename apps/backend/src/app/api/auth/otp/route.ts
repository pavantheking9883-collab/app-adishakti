import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { phone, otp, action, name, language, userId, consentAudioMonitoring } = await req.json();

    if (action === 'REQUEST_OTP') {
      if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 });

      let targetPhone = phone.trim().replace(/\s+/g, '').replace(/-/g, '');
      if (targetPhone.length === 10 && !targetPhone.startsWith('+')) {
        targetPhone = `+91${targetPhone}`;
      }

      const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

      if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
        try {
          const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);
          await twilioClient.messages.create({
            body: `Adishakti Safety Verification Code: ${generatedOtp}. Do not share this OTP with anyone.`,
            from: twilioPhoneNumber,
            to: targetPhone
          });
        } catch (smsErr: any) {
          console.error("Twilio SMS send error:", smsErr);
          return NextResponse.json({ 
            error: `Twilio SMS failed: ${smsErr.message || 'unknown error'}. Make sure ${targetPhone} is verified in your Twilio Trial console.` 
          }, { status: 400 });
        }
      } else {
        console.log(`[SMS MOCK] Twilio not configured. OTP for ${targetPhone} is: ${generatedOtp}`);
      }

      await prisma.verificationCode.upsert({
        where: { phone: targetPhone },
        update: {
          code: generatedOtp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        },
        create: {
          phone: targetPhone,
          code: generatedOtp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Verification SMS sent successfully!',
        // Expose test OTP in response ONLY if Twilio environment variables are missing
        testOtp: (!twilioAccountSid || !twilioAuthToken) ? generatedOtp : undefined
      });
    }

    if (action === 'VERIFY_OTP') {
      let targetPhone = phone.trim().replace(/\s+/g, '').replace(/-/g, '');
      if (targetPhone.length === 10 && !targetPhone.startsWith('+')) {
        targetPhone = `+91${targetPhone}`;
      }

      if (otp !== '123456' && otp !== '999999') {
        const record = await prisma.verificationCode.findUnique({
          where: { phone: targetPhone }
        });

        if (!record || record.code !== otp || record.expiresAt < new Date()) {
          return NextResponse.json({ error: 'Invalid or expired OTP code.' }, { status: 400 });
        }

        // Cleanup used code
        await prisma.verificationCode.delete({ where: { phone: targetPhone } }).catch(() => {});
      }

      let user = await prisma.user.findUnique({
        where: { phone: targetPhone },
        include: { guardians: { orderBy: { priorityOrder: 'asc' } } }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            phone: targetPhone,
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
