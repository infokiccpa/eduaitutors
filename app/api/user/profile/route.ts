import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const updates = await req.json();
        const userId = (session.user as any).id;

        await dbConnect();

        // Prevent direct role changes via this endpoint for security
        delete updates.role;
        delete updates.email;
        delete updates.password;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                name: updatedUser.name,
                package: updatedUser.package,
                grade: updatedUser.grade,
                board: updatedUser.board,
                subjects: updatedUser.subjects
            }
        });

    } catch (error: any) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
    }
}
