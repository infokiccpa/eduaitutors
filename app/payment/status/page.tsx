
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const txnid = searchParams.get("txnid");
    const status = searchParams.get("status");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (txnid && status) {
            setLoading(false);
        }
    }, [txnid, status]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {status === "success" ? (
                    <>
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Thank you for your purchase. Your transaction ID is <br />
                            <span className="font-mono font-medium text-gray-800">{txnid}</span>
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/dashboard"
                                className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-lg shadow-indigo-200"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                            <XCircle className="h-10 w-10 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                        <p className="text-gray-600 mb-6">
                            We couldn't process your payment. Please try again or contact support if the issue persists.
                            <br />
                            <span className="text-sm text-gray-400 mt-2 block">Ref: {txnid}</span>
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/dashboard"
                                className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition"
                            >
                                Return to Dashboard
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentStatusContent />
        </Suspense>
    )
}
