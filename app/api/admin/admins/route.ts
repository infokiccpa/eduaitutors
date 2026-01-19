import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'superadmin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        const { name, email, password, role } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        if (!['admin', 'superadmin', 'support'].includes(role)) {
            return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
        }

        await dbConnect();

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        return NextResponse.json({
            message: 'Admin created successfully',
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Create Admin Error:', error);
        return NextResponse.json({ message: error.message || 'Error creating admin' }, { status: 500 });
    }
}
