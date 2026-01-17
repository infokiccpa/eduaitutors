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

        // Authorization check
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        await dbConnect();

        // Aggregate core metrics
        const [
            totalStudents,
            totalQuizzesTaken,
            totalActivities,
            recentUsers,
            recentResults
        ] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            QuizResult.countDocuments({}),
            Activity.countDocuments({}),
            User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5).select('name email package createdAt'),
            QuizResult.find({}).sort({ createdAt: -1 }).limit(5).populate('userId', 'name').populate('quizId', 'title')
        ]);

        return NextResponse.json({
            metrics: {
                totalStudents,
                totalQuizzesTaken,
                totalActivities,
            },
            recentUsers,
            recentResults
        });

    } catch (error: any) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ message: 'Error fetching admin stats' }, { status: 500 });
    }
}
