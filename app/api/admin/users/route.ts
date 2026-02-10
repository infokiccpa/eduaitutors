import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'superadmin'].includes((session.user as any).role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const pkg = searchParams.get('package') || '';
        const role = searchParams.get('role');

        await dbConnect();

        let query: any = {};

        if (role) {
            query.role = role;
        } else {
            // Default behavior if no role specified: fetch students? 
            // Or fetch all? Let's default to students if generic admin, or strict filter if needed.
            // Existing code defaulted to student. Let's keep it unless role is passed.
            query.role = 'student';
            // EDIT: Actually, for superadmin viewing all users, we might want all. 
            // But to preserve backward compatibility with specific admin pages, let's say if 'role' param is provided, use it. 
            // If 'role' is 'all', remove the filter.
        }

        if (role === 'all') {
            delete query.role;
        }

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
            .select('name email role package grade board subjects createdAt')
            .limit(100);

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}
