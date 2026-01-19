import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Config from '@/models/Config';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'superadmin') { // Only superadmin
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        await dbConnect();
        const configs = await Config.find({});
        // Convert array to object for easier frontend consumption
        const configMap: any = {};
        configs.forEach(c => configMap[c.key] = c.value);
        return NextResponse.json(configMap);
    } catch (error) {
        return NextResponse.json({ message: 'Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'superadmin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        await dbConnect();
        const body = await req.json();

        // Update or Insert
        for (const [key, value] of Object.entries(body)) {
            await Config.findOneAndUpdate({ key }, { key, value, updatedAt: new Date() }, { upsert: true });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: 'Error saving config' }, { status: 500 });
    }
}
