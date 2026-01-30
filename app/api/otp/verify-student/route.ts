import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Lead from '@/models/Lead';

export async function POST(req: Request) {
    try {
        const { mobile, otp } = await req.json();
        const authKey = process.env.MSG91_AUTH_KEY;

        if (!authKey) {
            return NextResponse.json({ message: "MSG91 API key is not configured" }, { status: 500 });
        }

        // 1. Verify OTP via MSG91
        const response = await fetch(
            `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${mobile}&authkey=${authKey}`,
            { method: 'GET' }
        );

        const data = await response.json();

        if (data.type === 'success') {
            // 2. Check if student is registered (exists in User or Lead)
            await dbConnect();

            const userExists = await User.findOne({ phone: mobile });
            const leadExists = await Lead.findOne({ phone: mobile });

            if (userExists || leadExists) {
                return NextResponse.json({
                    message: "Access Granted",
                    success: true,
                    user: userExists || leadExists
                });
            } else {
                return NextResponse.json({
                    message: "Student not found in registered records. Please register first.",
                    success: false,
                    needsRegistration: true
                }, { status: 403 });
            }
        } else {
            return NextResponse.json({ message: data.message || "Invalid OTP" }, { status: 400 });
        }
    } catch (error) {
        console.error("Student Verify Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
