import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { mobile, otp } = await req.json();
        const authKey = process.env.MSG91_AUTH_KEY;

        console.log('OTP Verify Request:', { mobile, otp, hasAuthKey: !!authKey });

        if (!authKey) {
            console.error('MSG91_AUTH_KEY is not configured');
            return NextResponse.json({ message: "MSG91 API key is not configured" }, { status: 500 });
        }

        if (!mobile || !otp) {
            return NextResponse.json({ message: "Mobile number and OTP are required" }, { status: 400 });
        }

        // MSG91 OTP Verify API
        const url = `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${mobile}&authkey=${authKey}`;
        console.log('MSG91 Verify URL:', url.replace(authKey, '***'));

        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        console.log('MSG91 Verify Response:', data);

        if (data.type === 'success') {
            return NextResponse.json({ message: "OTP verified successfully" });
        } else {
            console.error('MSG91 Verify Error:', data);
            return NextResponse.json({
                message: data.message || "Invalid OTP",
                error: data
            }, { status: 400 });
        }
    } catch (error) {
        console.error("OTP Verify Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
