import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { name, email, password, invitationCode } = await req.json();

        // Optional: Simple check for invitation code to prevent random people from becoming tutors
        if (invitationCode !== 'EDUAI-TUTOR-2026') {
            return NextResponse.json({ message: 'Invalid invitation code' }, { status: 403 });
        }

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user with mentor role
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'mentor',
        });

        return NextResponse.json({
            message: 'Tutor account created successfully',
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: 'mentor' }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Mentor Signup Error:', error);
        return NextResponse.json({ message: error.message || 'Error creating tutor account' }, { status: 500 });
    }
}
