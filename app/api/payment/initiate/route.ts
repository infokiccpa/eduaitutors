
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { payuClient } from "@/lib/payu";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        let { amount, productinfo, firstname, email, phone, userId, metadata } = body;

        if (!amount || !productinfo || !firstname || !email || !phone) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // If userId is missing (e.g. from standard NextAuth session), try to find user by email
        if (!userId && email) {
            const User = (await import("@/models/User")).default;
            const user = await User.findOne({ email });
            if (user) {
                userId = user._id;
            }
        }

        const txnid = uuidv4().replace(/-/g, "").substring(0, 20); // PayU txnid usually max 25 chars

        // Create Payment Record
        await Payment.create({
            transactionId: txnid,
            userId: userId || null,
            amount,
            productInfo: productinfo,
            status: "pending",
            mode: "payu", // Initiated via PayU
            metadata,
        });

        const hash = payuClient.generateHash({
            txnid,
            amount: String(amount),
            productinfo,
            firstname,
            email,
        });

        const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
        const surl = `${baseUrl}/api/payment/callback`;
        const furl = `${baseUrl}/api/payment/callback`;

        const payload = {
            key: payuClient.merchantKey,
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            phone,
            surl,
            furl,
            hash,
            action: payuClient.getActionUrl(),
        };

        return NextResponse.json(payload);
    } catch (error) {
        console.error("Payment initiation error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
