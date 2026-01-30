import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { mobile, otp } = await req.json();
        const authKey = process.env.MSG91_AUTH_KEY;

        if (!authKey) {
            return NextResponse.json({ message: "MSG91 API key is not configured" }, { status: 500 });
        }

        // MSG91 OTP Verify API
        const response = await fetch(
            `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${mobile}&authkey=${authKey}`,
            { method: 'GET' }
        );

        const data = await response.json();

        if (data.type === 'success') {
            return NextResponse.json({ message: "OTP verified successfully" });
        } else {
            return NextResponse.json({ message: data.message || "Invalid OTP" }, { status: 400 });
        }
    } catch (error) {
        console.error("OTP Verify Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
