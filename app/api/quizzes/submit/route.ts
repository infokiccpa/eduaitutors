import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QuizResult from '@/models/QuizResult';
import Activity from '@/models/Activity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { quizId, quizTitle, subject, score, totalQuestions, answers } = await req.json();

        await dbConnect();

        // 1. Save detailed quiz result
        const newResult = await QuizResult.create({
            userId: (session.user as any).id,
            quizId,
            score,
            totalQuestions,
            answers
        });

        // 2. Create activity entry for dashboard/progress
        const percentage = Math.round((score / totalQuestions) * 100);
        await Activity.create({
            userId: (session.user as any).id,
            type: 'quiz',
            title: `Completed Quiz: ${quizTitle}`,
            subject,
            score: `${percentage}%`,
        });

        return NextResponse.json({
            message: 'Quiz submitted successfully',
            resultId: newResult._id
        }, { status: 201 });

    } catch (error: any) {
        console.error('Quiz Submission Error:', error);
        return NextResponse.json({ message: 'Error submitting quiz' }, { status: 500 });
    }
}
