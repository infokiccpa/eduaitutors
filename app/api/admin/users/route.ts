import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const pkg = searchParams.get('package') || '';

        await dbConnect();

        let query: any = { role: 'student' };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (pkg) {
            query.package = pkg;
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .select('name email package grade board subjects createdAt')
            .limit(50);

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}
