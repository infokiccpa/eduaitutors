import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { sendLeadNotificationToAdmin } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await dbConnect();
        const lead = await Lead.create(body);

        // Send notification to admin (fire and forget)
        sendLeadNotificationToAdmin(lead).catch(err =>
            console.error('Email notification failed:', err)
        );

        return NextResponse.json(lead, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
