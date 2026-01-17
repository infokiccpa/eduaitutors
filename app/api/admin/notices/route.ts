import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notice from '@/models/Notice';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    await dbConnect();
    const notices = await Notice.find({ active: true }).sort({ createdAt: -1 });
    return NextResponse.json(notices);
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'superadmin') {
            return NextResponse.json({ message: 'Only Superadmins can post notices' }, { status: 403 });
        }
        const body = await req.json();
        await dbConnect();
        const notice = await Notice.create({ ...body, createdBy: (session.user as any).id });
        return NextResponse.json(notice, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
