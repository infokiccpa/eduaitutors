import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Get upcoming classes (started after now or ending after now)
        const now = new Date();
        const classes = await Schedule.find({ startTime: { $gte: now } }).sort({ startTime: 1 });
        return NextResponse.json(classes);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching schedule' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const data = await req.json();
        await dbConnect();

        const newSchedule = await Schedule.create(data);
        return NextResponse.json(newSchedule, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error creating schedule' }, { status: 500 });
    }
}
