import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'superadmin'].includes((session.user as any).role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        await dbConnect();
        const quizzes = await Quiz.find({}).sort({ createdAt: -1 });
        return NextResponse.json(quizzes);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'superadmin'].includes((session.user as any).role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        const body = await req.json();
        await dbConnect();
        const quiz = await Quiz.create(body);
        return NextResponse.json(quiz, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'superadmin'].includes((session.user as any).role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });
        await dbConnect();
        await Quiz.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Quiz deleted' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
