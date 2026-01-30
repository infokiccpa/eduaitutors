import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { mobile } = await req.json();
        const authKey = process.env.MSG91_AUTH_KEY;
        const templateId = process.env.MSG91_TEMPLATE_ID;

        if (!authKey) {
            return NextResponse.json({ message: "MSG91 API key is not configured" }, { status: 500 });
        }

        // MSG91 OTP Send API
        const response = await fetch(
            `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${mobile}&authkey=${authKey}`,
            {
                method: 'POST', // Some versions use POST, others GET. v5 docs show query params often with POST.
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const data = await response.json();

        if (data.type === 'success') {
            return NextResponse.json({ message: "OTP sent successfully" });
        } else {
            return NextResponse.json({ message: data.message || "Failed to send OTP" }, { status: 400 });
        }
    } catch (error) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
