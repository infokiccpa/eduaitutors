'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Search, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function Transactions() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        try {
            const res = await fetch('/api/admin/payments')
            const data = await res.json()
            setPayments(data)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success': return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"><CheckCircle className="w-3 h-3" /> Success</span>
            case 'failure': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"><XCircle className="w-3 h-3" /> Failed</span>
            default: return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"><Clock className="w-3 h-3" /> Pending</span>
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="lg:ml-72 min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-slate-900">Transactions</h1>
                            <p className="text-slate-500">Real-time payment history and revenue tracking.</p>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction ID</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading transactions...</td></tr>
                                        ) : payments.length === 0 ? (
                                            <tr><td colSpan={6} className="p-8 text-center text-slate-400">No transactions recorded</td></tr>
                                        ) : (
                                            payments.map((p: any) => (
                                                <tr key={p._id} className="hover:bg-slate-50/50 transition">
                                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                                        {p.txnid}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{p.userId?.name || p.firstname || 'Guest'}</p>
                                                            <p className="text-xs text-slate-500">{p.userId?.email || p.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-black text-slate-900">₹{p.amount}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(p.status)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {p.productInfo}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        {new Date(p.createdAt || new Date()).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
