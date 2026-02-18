import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token && !email) {
            return NextResponse.json({ valid: false, message: 'Token or Email missing' }, { status: 400 });
        }

        try {
            await dbConnect();
        } catch (dbErr) {
            console.error("❌ Database Connection Error:", dbErr);
            return NextResponse.json({
                valid: false,
                message: "Database connection failed."
            }, { status: 500 });
        }

        let lead;
        if (token) {
            lead = await Lead.findOne({ accessCode: token });
        } else if (email) {
            // Find lead by email. Smart matching to handle case sensitivity.
            lead = await Lead.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        }

        if (!lead) {
            return NextResponse.json({ valid: false, message: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({
            valid: true,
            user: {
                name: lead.name,
                email: lead.email,
                grade: lead.grade,
                subject: lead.subjects ? lead.subjects[0] : null
            }
        });
    } catch (error: any) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ valid: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
