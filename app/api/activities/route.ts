import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const activities = await Activity.find({ userId: (session.user as any).id })
            .sort({ createdAt: -1 })
            .limit(10);

        return NextResponse.json(activities);
    } catch (error: any) {
        console.error('Fetch Activities Error:', error);
        return NextResponse.json({ message: 'Error fetching activities' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { type, title, subject, score } = await req.json();

        await dbConnect();

        const newActivity = await Activity.create({
            userId: (session.user as any).id,
            type,
            title,
            subject,
            score,
        });

        return NextResponse.json(newActivity, { status: 201 });
    } catch (error: any) {
        console.error('Post Activity Error:', error);
        return NextResponse.json({ message: 'Error creating activity' }, { status: 500 });
    }
}
