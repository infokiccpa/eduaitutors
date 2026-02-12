import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTP from '@/models/OTP';
import { sendOTPEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        try {
            await dbConnect();
        } catch (dbErr) {
            console.error("❌ Database Connection Error:", dbErr);
            return NextResponse.json({
                message: "Database connection failed. Please ensure MONGODB_URI is set.",
                error: dbErr instanceof Error ? dbErr.message : String(dbErr)
            }, { status: 500 });
        }

        const { email } = await req.json();
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (!smtpUser || !smtpPass) {
            console.error("❌ SMTP Credentials missing in environment variables");
            return NextResponse.json({
                message: "Email service is not configured on the server",
                error: "Missing SMTP_USER or SMTP_PASS"
            }, { status: 500 });
        }

        if (!email || !email.includes('@')) {
            return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save or update OTP
        try {
            await OTP.findOneAndUpdate(
                { email },
                { otp: otpCode, createdAt: new Date() },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`✅ OTP ${otpCode} saved for ${email}`);
        } catch (dbError) {
            console.error("❌ Database Error saving OTP:", dbError);
            return NextResponse.json({ message: "Database error. Please try again." }, { status: 500 });
        }

        // Send email
        console.log(`📧 Attempting to send OTP email to ${email}...`);
        const startTime = Date.now();
        const emailRes = await sendOTPEmail(email, otpCode);
        const duration = Date.now() - startTime;

        if (emailRes.success) {
            console.log(`✅ OTP email sent successfully to ${email} in ${duration}ms`);
            return NextResponse.json({ message: "OTP sent to your email" });
        } else {
            console.error(`❌ SMTP Error for ${email}:`, emailRes.message || emailRes.error);
            return NextResponse.json({
                message: "Failed to send email OTP",
                error: emailRes.message || emailRes.error,
                details: "Please check if SMTP is correctly configured in .env"
            }, { status: 500 });
        }
    } catch (error) {
        console.error("Email OTP Send Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
