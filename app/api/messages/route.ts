import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const userId = (session.user as any).id;
        await dbConnect();
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).populate('senderId', 'name role').sort({ createdAt: -1 });

        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        await dbConnect();
        const message = await Message.create({
            ...body,
            senderId: (session.user as any).id
        });
        return NextResponse.json(message, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
