import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTP from '@/models/OTP';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        try {
            await dbConnect();
        } catch (dbErr) {
            console.error("❌ Database Connection Error:", dbErr);
            return NextResponse.json({
                message: "Database connection failed.",
                error: dbErr instanceof Error ? dbErr.message : String(dbErr)
            }, { status: 500 });
        }

        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
        }

        const otpDoc = await OTP.findOne({ email, otp });

        if (otpDoc) {
            // Delete OTP after successful verification
            await OTP.deleteOne({ _id: otpDoc._id });
            return NextResponse.json({ message: "Email verified successfully" });
        } else {
            return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
        }
    } catch (error) {
        console.error("Email OTP Verify Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
