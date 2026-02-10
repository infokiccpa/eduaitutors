import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'superadmin'].includes((session.user as any).role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        await dbConnect();
        const leads = await Lead.find({}).sort({ createdAt: -1 });
        return NextResponse.json(leads);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'superadmin'].includes((session.user as any).role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        const { id, status, ...otherUpdates } = await req.json();
        await dbConnect();

        // Get the lead before update to check previous status
        const previousLead = await Lead.findById(id);

        // Update the lead
        const lead = await Lead.findByIdAndUpdate(
            id,
            { status, ...otherUpdates },
            { new: true }
        );

        // Send welcome email when status changes to "Contacted" for the first time
        if (lead && previousLead &&
            status === 'Contacted' &&
            previousLead.status !== 'Contacted') {
            sendWelcomeEmail(lead.email, lead.name).catch(err =>
                console.error('Welcome email failed:', err)
            );
        }

        return NextResponse.json(lead);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'superadmin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await dbConnect();
        await Lead.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Lead deleted' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
