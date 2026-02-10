import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTP from '@/models/OTP';
import { sendOTPEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save or update OTP
        await OTP.findOneAndUpdate(
            { email },
            { otp: otpCode, createdAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send email
        const emailRes = await sendOTPEmail(email, otpCode);

        if (emailRes.success) {
            return NextResponse.json({ message: "OTP sent to your email" });
        } else {
            return NextResponse.json({
                message: "Failed to send email OTP",
                error: emailRes.message || emailRes.error
            }, { status: 500 });
        }
    } catch (error) {
        console.error("Email OTP Send Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
