import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment'; // Ensure this model exists and is exported
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'superadmin'].includes((session.user as any).role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        // We might want to populate user details, but Payment model stores some user info directly or links via userId?
        // Let's check Payment model. It has 'userId'.
        // We will populate basic user info.

        const payments = await Payment.find({})
            .sort({ createdAt: -1 })
            .limit(100)
            .populate('userId', 'name email phone');

        return NextResponse.json(payments);
    } catch (error: any) {
        console.error("Payment Fetch Error", error);
        return NextResponse.json({ message: 'Error fetching payments' }, { status: 500 });
    }
}
