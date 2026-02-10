import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
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
        const packageName = searchParams.get('package');

        if (!packageName) {
            return NextResponse.json({ message: 'Package name is required' }, { status: 400 });
        }

        const courses = await Course.find({ packageName });

        return NextResponse.json(courses);
    } catch (error: any) {
        console.error('Fetch Courses Error:', error);
        return NextResponse.json({ message: 'Error fetching courses' }, { status: 500 });
    }
}
