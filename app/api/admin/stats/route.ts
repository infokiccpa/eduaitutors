import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import QuizResult from '@/models/QuizResult';
import Activity from '@/models/Activity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Authorization check
        if (!session || !['admin', 'superadmin'].includes((session.user as any).role)) {
            return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        await dbConnect();
        const Payment = (await import("@/models/Payment")).default;

        // Aggregate core metrics
        const [
            totalStudents,
            totalUsers,
            totalQuizzesTaken,
            totalActivities,
            payments
        ] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            User.countDocuments({}),
            QuizResult.countDocuments({}),
            Activity.countDocuments({}),
            Payment.find({ status: 'success' }).select('amount')
        ]);

        const totalRevenue = payments.reduce((acc: number, curr: any) => acc + (parseFloat(curr.amount) || 0), 0);

        return NextResponse.json({
            totalRevenue: totalRevenue.toLocaleString(),
            activeUsers: totalUsers,
            metrics: {
                totalStudents,
                totalQuizzesTaken,
                totalActivities,
            },
            // Keep specific structure if other dashboards use it, but add top level fields for superadmin
        });

    } catch (error: any) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ message: 'Error fetching admin stats' }, { status: 500 });
    }
}
