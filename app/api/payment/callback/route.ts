
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { payuClient } from "@/lib/payu";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const formData = await req.formData();
        const data: any = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const { txnid, status, amount, productinfo, firstname, email, unmappedstatus } = data;

        // Verify Hash
        const isHashValid = payuClient.verifyHash(data);

        if (!isHashValid) {
            console.error("Hash verification failed for txnid:", txnid);
            // Even if hash fails, we might want to record it but treat as suspicious or failed
        }

        const paymentStatus = status === "success" && isHashValid ? "success" : "failed";

        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: txnid },
            {
                status: paymentStatus,
                gatewayResponse: data,
                mode: data.mode || "payu", // PayU returns 'mode' (CC, DC, NB, UPI, etc.)
            },
            { new: true }
        );

        if (paymentStatus === "success" && updatedPayment && updatedPayment.userId) {
            const User = (await import("@/models/User")).default; // Dynamic import to avoid circular dep if any, or just standard import
            await User.findByIdAndUpdate(updatedPayment.userId, {
                package: updatedPayment.productInfo,
                price: String(updatedPayment.amount),
                grade: updatedPayment.metadata?.grade,
                board: updatedPayment.metadata?.board,
                subjects: updatedPayment.metadata?.subjects
            });
        }

        const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
        // Redirect to frontend
        return NextResponse.redirect(`${baseUrl}/payment/status?txnid=${txnid}&status=${paymentStatus}`, 303);

    } catch (error) {
        console.error("Payment callback error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
