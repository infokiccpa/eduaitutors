import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const subjects = searchParams.get('subjects')?.split(',');

        let query = {};
        if (subjects && subjects.length > 0) {
            query = { subject: { $in: subjects } };
        }

        const quizzes = await Quiz.find(query);

        return NextResponse.json(quizzes);
    } catch (error: any) {
        console.error('Fetch Quizzes Error:', error);
        return NextResponse.json({ message: 'Error fetching quizzes' }, { status: 500 });
    }
}
