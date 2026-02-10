import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { name, email, password, package: packageName, price, grade, board, subjects } = await req.json();

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

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            package: packageName,
            price,
            grade,
            board,
            subjects
        });

        // Send welcome email (fire and forget)
        sendWelcomeEmail(newUser.email, newUser.name).catch((err: any) =>
            console.error('Welcome email failed:', err)
        );

        return NextResponse.json({
            message: 'User created successfully',
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json({ message: error.message || 'Error creating user' }, { status: 500 });
    }
}
