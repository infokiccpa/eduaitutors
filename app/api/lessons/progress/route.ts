import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import LessonProgress from '@/models/LessonProgress';
import Activity from '@/models/Activity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { courseId, chapterIndex, progress, watchTime, isCompleted, title, subject } = await req.json();
        const userId = (session.user as any).id;

        await dbConnect();

        const update: any = {
            progress,
            watchTime,
            lastWatched: new Date(),
        };

        if (isCompleted) {
            update.isCompleted = true;
        }

        const lessonProgress = await LessonProgress.findOneAndUpdate(
            { userId, courseId, chapterIndex },
            update,
            { upsert: true, new: true }
        );

        // Track as activity if it's the first time completing or some significant progress
        if (isCompleted) {
            // Check if activity already exists for this completion
            const existingActivity = await Activity.findOne({
                userId,
                type: 'lesson',
                title: `Completed: ${title}`
            });

            if (!existingActivity) {
                await Activity.create({
                    userId,
                    type: 'lesson',
                    title: `Completed: ${title}`,
                    subject: subject || 'General',
                });
            }
        }

        return NextResponse.json(lessonProgress);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');
        const userId = (session.user as any).id;

        await dbConnect();
        const progress = await LessonProgress.find({ userId, courseId });
        return NextResponse.json(progress);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
