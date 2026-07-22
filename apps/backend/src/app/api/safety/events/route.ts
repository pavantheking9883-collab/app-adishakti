import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const priority = searchParams.get('priority'); // RED or WARNING
    const status = searchParams.get('status') || 'ACTIVE';

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (priority) whereClause.type = priority;

    const events = await prisma.safetyEvent.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            guardians: { orderBy: { priorityOrder: 'asc' } }
          }
        },
        ivrCallLogs: { include: { guardian: true } }
      },
      orderBy: { startedAt: 'desc' }
    });

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, lastLat, lastLng, lastAddress, lastBattery, lastNetworkStatus, audioFlag, audioUrl, notes } = body;

    if (!userId || !type) {
      return NextResponse.json({ error: 'userId and type (WARNING | RED) required' }, { status: 400 });
    }

    // Create safety event
    const event = await prisma.safetyEvent.create({
      data: {
        userId,
        type: type === 'RED' ? 'RED' : 'WARNING',
        status: 'ACTIVE',
        lastLat: lastLat || 16.9891,
        lastLng: lastLng || 81.7835,
        lastAddress: lastAddress || 'Location synced via GPS',
        lastBattery: lastBattery || 90,
        lastNetworkStatus: lastNetworkStatus || '4G Active',
        audioFlag: !!audioFlag,
        audioUrl,
        notes: notes || (type === 'RED' ? 'SOS Red Alert triggered' : 'Yellow Warning Trigger activated')
      },
      include: {
        user: { include: { guardians: { orderBy: { priorityOrder: 'asc' } } } }
      }
    });

    // If Red Alert, auto-trigger IVR call logs for top guardians
    if (type === 'RED' && event.user.guardians.length > 0) {
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
      const hasTwilio = twilioAccountSid && twilioAuthToken && twilioPhoneNumber;

      for (const g of event.user.guardians) {
        let callOutcome = g.priorityOrder === 1 ? 'ESCALATED_SMS_IVR' : 'PENDING';

        if (hasTwilio && g.priorityOrder === 1) {
          try {
            const twilio = require('twilio');
            const client = twilio(twilioAccountSid, twilioAuthToken);
            
            const twiml = `
              <Response>
                <Say language="te-IN" voice="Polly.Aditi">
                  జాగ్రత్త. ఆదిశక్తి అత్యవసర సహాయ అలర్ట్. మీ కుటుంబ సభ్యులు ${event.user.name} రాజమండ్రి వద్ద ప్రమాదంలో ఉన్నారు. వెంటనే స్పందించండి.
                </Say>
                <Say language="en-IN">
                  Emergency Alert. Your family member, ${event.user.name}, is in danger. Last tracked coordinates at ${lastAddress || 'Rajahmundry'}. Device battery is ${lastBattery || 80} percent.
                </Say>
              </Response>
            `;
            
            const twilioCall = await client.calls.create({
              twiml,
              to: g.phone, // Make sure this matches verified Twilio trial numbers for testing
              from: twilioPhoneNumber
            });
            callOutcome = `DIALED_LIVE_${twilioCall.sid}`;
          } catch (callErr: any) {
            console.error("Twilio live call dispatch failed:", callErr);
            callOutcome = `FAILED_LIVE_${callErr.message ? callErr.message.substring(0, 30) : ''}`;
          }
        }

        await prisma.iVRCallLog.create({
          data: {
            safetyEventId: event.id,
            guardianId: g.id,
            outcome: callOutcome
          }
        });
      }
    }

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { eventId, status, notes } = await req.json();

    if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 });

    const updated = await prisma.safetyEvent.update({
      where: { id: eventId },
      data: {
        status: status,
        resolvedAt: status === 'RESOLVED' ? new Date() : undefined,
        notes: notes ? `${notes}` : undefined
      },
      include: { user: true }
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
