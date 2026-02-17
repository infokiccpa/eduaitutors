import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ valid: false, message: 'Token missing' }, { status: 400 });
        }

        try {
            await dbConnect();
        } catch (dbErr) {
            console.error("❌ Database Connection Error:", dbErr);
            return NextResponse.json({
                valid: false,
                message: "Database connection failed.",
                error: dbErr instanceof Error ? dbErr.message : String(dbErr)
            }, { status: 500 });
        }
        // Check if a lead exists with this access code
        const lead = await Lead.findOne({ accessCode: token });

        if (!lead) {
            return NextResponse.json({ valid: false, message: 'Invalid token' }, { status: 401 });
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
