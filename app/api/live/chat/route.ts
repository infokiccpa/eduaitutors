import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import LiveChatMessage from '@/models/LiveChatMessage';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const subject = searchParams.get('subject');
        const grade = searchParams.get('grade');

        if (!subject || !grade) {
            return NextResponse.json({ error: 'Subject and grade are required' }, { status: 400 });
        }

        // Fetch messages for the last 24 hours to keep it relevant
        const messages = await LiveChatMessage.find({
            subject,
            grade,
            createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }).sort({ createdAt: 1 }).limit(100);

        return NextResponse.json({ success: true, messages });
    } catch (error: any) {
        console.error('Error fetching chat:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, email, message, grade, subject, isAdmin } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const chat = await LiveChatMessage.create({
            name,
            email,
            message,
            grade,
            subject,
            isAdmin: !!isAdmin
        });

        return NextResponse.json({ success: true, chat });
    } catch (error: any) {
        console.error('Error sending chat:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
