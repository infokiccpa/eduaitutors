import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import LiveJoinLog from '@/models/LiveJoinLog';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, email, grade, subject } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // Get some basic request info
        const userAgent = req.headers.get('user-agent') || 'unknown';
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

        // Check for duplicate join within last 5 minutes to avoid spamming the log
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentLog = await LiveJoinLog.findOne({
            email,
            subject,
            grade,
            createdAt: { $gt: fiveMinutesAgo }
        });

        if (recentLog) {
            return NextResponse.json({ success: true, message: 'Already logged recently' });
        }

        const log = await LiveJoinLog.create({
            name,
            email,
            grade,
            subject,
            userAgent,
            ip,
            device: userAgent.includes('Mobi') ? 'Mobile' : 'Desktop'
        });

        console.log(`✅ Attendance recorded for: ${name} (${email}) for ${subject}`);

        return NextResponse.json({ success: true, logId: log._id });
    } catch (error: any) {
        console.error('Error tracking live join:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
