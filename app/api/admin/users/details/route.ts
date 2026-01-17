import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import QuizResult from '@/models/QuizResult';
import Activity from '@/models/Activity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'superadmin', 'mentor', 'parent'].includes((session.user as any).role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });

        await dbConnect();

        const [user, quizHistory, activities] = await Promise.all([
            User.findById(userId).select('-password'),
            QuizResult.find({ userId }).populate('quizId', 'title subject').sort({ createdAt: -1 }),
            Activity.find({ userId }).sort({ createdAt: -1 }).limit(20)
        ]);

        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        // Calculate analytics
        const avgScore = quizHistory.length > 0
            ? Math.round(quizHistory.reduce((acc, res) => acc + (res.score / res.totalQuestions), 0) / quizHistory.length * 100)
            : 0;

        return NextResponse.json({
            user,
            quizHistory,
            activities,
            analytics: {
                avgScore,
                quizzesCompleted: quizHistory.length,
                totalActivityPoints: activities.length * 10 // Mock point system
            }
        });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
