import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { sendLeadNotificationToAdmin, sendWelcomeEmail, sendLiveClassLinkEmail } from '@/lib/email';

// GET - Fetch all leads
export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const grade = searchParams.get('grade');
        const limit = parseInt(searchParams.get('limit') || '100');

        // Build query
        const query: any = {};
        if (status && status !== 'all') query.status = status;
        if (grade && grade !== 'all') query.grade = grade;

        const leads = await Lead.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json({ leads, count: leads.length });
    } catch (error: any) {
        console.error('Error fetching leads:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST - Create new lead
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Creating new lead:', body);

        // Generate access code
        const accessCode = crypto.randomUUID();
        body.accessCode = accessCode;

        await dbConnect();
        const lead = await Lead.create(body);
        console.log('Lead created successfully:', lead._id);

        // Send welcome email to user (fire and forget)
        sendWelcomeEmail(lead.email, lead.name).catch(err =>
            console.error('Welcome email failed:', err)
        );

        // Send notification to admin (fire and forget)
        sendLeadNotificationToAdmin(lead).catch(err =>
            console.error('Email notification failed:', err)
        );

        // Send Live Class Link if applicable
        if (body.courseInterest && body.courseInterest.includes('Revision')) {
            sendLiveClassLinkEmail(lead.email, lead.name, lead.grade, lead.subjects || [], accessCode).catch(err =>
                console.error('Live class email failed:', err)
            );
        }

        return NextResponse.json(lead, { status: 201 });
    } catch (error: any) {
        console.error('Error creating lead:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PATCH - Update lead status
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status, notes } = body;

        if (!id) {
            return NextResponse.json({ message: 'Lead ID is required' }, { status: 400 });
        }

        await dbConnect();

        const updateData: any = {};
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true });

        if (!lead) {
            return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json(lead);
    } catch (error: any) {
        console.error('Error updating lead:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
