import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { mobile } = await req.json();
        const authKey = process.env.MSG91_AUTH_KEY;
        const templateId = process.env.MSG91_TEMPLATE_ID;

        console.log('OTP Send Request:', { mobile, hasAuthKey: !!authKey, hasTemplateId: !!templateId });

        if (!authKey) {
            console.error('MSG91_AUTH_KEY is not configured');
            return NextResponse.json({ message: "MSG91 API key is not configured" }, { status: 500 });
        }

        if (!templateId) {
            console.error('MSG91_TEMPLATE_ID is not configured');
            return NextResponse.json({ message: "MSG91 Template ID is not configured" }, { status: 500 });
        }

        if (!mobile || mobile.length < 10) {
            return NextResponse.json({ message: "Invalid mobile number" }, { status: 400 });
        }

        // MSG91 OTP Send API
        const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${mobile}&authkey=${authKey}`;
        console.log('MSG91 API URL:', url.replace(authKey, '***'));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('MSG91 Response:', data);

        if (data.type === 'success') {
            return NextResponse.json({ message: "OTP sent successfully", requestId: data.request_id });
        } else {
            console.error('MSG91 Error:', data);
            return NextResponse.json({
                message: data.message || "Failed to send OTP",
                error: data
            }, { status: 400 });
        }
    } catch (error) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
