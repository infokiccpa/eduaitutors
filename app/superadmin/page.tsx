'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import {
    ShieldCheck,
    Users,
    Zap,
    TrendingUp,
    Globe,
    ShieldAlert,
    Server,
    Activity,
    Plus,
    Calendar,
    ChevronRight,
    DollarSign,
    LayoutGrid,
    Search,
    Filter,
    X,
    Bell,
    Megaphone
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function SuperAdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [noticeFormData, setNoticeFormData] = useState({
        title: '',
        content: '',
        priority: 'medium'
    })

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && (session.user as any).role !== 'superadmin')) {
            router.push('/dashboard')
        }
    }, [status, session, router])

    useEffect(() => {
        if (status === 'authenticated') {
            fetchStats()
        }
    }, [status])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats')
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Fetch Stats Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleNoticeSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/admin/notices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noticeFormData)
            })
            if (res.ok) {
                toast.success('Announcement blasted to all students!')
                setIsNoticeModalOpen(false)
                setNoticeFormData({ title: '', content: '', priority: 'medium' })
            } else {
                const errorData = await res.json()
                toast.error(errorData.message || 'Announcement failed')
            }
        } catch (error) {
            toast.error('Announcement failed')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-xs uppercase tracking-widest text-slate-400">Locking System...</p>
                </div>
            </div>
        )
    }

    const metrics = [
        { label: 'Global Revenue', value: `$${stats?.totalRevenue || '42,500'}`, icon: DollarSign, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Users', value: stats?.activeUsers || '1,284', icon: Users, trend: '+8.2%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'System Load', value: '24%', icon: Server, trend: 'Optimal', color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Security Status', value: 'High', icon: ShieldAlert, trend: 'No Threats', color: 'text-red-600', bg: 'bg-red-50' },
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="lg:ml-72 min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        {/* Super Welcome */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-red-600">Level 5 Access Granted</span>
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">Super Management</h1>
                            <p className="text-slate-500 font-medium text-lg">Platform-wide oversight, financial metrics, and administrative control.</p>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setIsNoticeModalOpen(true)}
                                    className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition shadow-xl shadow-red-600/20 flex items-center gap-2"
                                >
                                    <Megaphone className="w-4 h-4" /> Blast Announcement
                                </button>
                                <button className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Regional Admin
                                </button>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            {metrics.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                                >
                                    <div className={`w-14 h-14 ${m.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <m.icon className={`w-7 h-7 ${m.color}`} />
                                    </div>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{m.label}</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-3xl font-black text-slate-900">{m.value}</h3>
                                        <span className="text-[10px] font-black text-emerald-500 px-2 py-1 bg-emerald-50 rounded-lg">{m.trend}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Platform Activity */}
                            <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-5">
                                    <Globe className="w-40 h-40 text-slate-900" />
                                </div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                        <Activity className="w-6 h-6 text-red-600" />
                                        Platform Traffic Visualizer
                                    </h2>
                                    <div className="h-64 flex items-end gap-3 px-4">
                                        {[40, 70, 45, 90, 65, 85, 40, 100, 75, 55, 80, 95].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ delay: i * 0.05, duration: 1 }}
                                                    className="w-full bg-slate-100 rounded-t-xl hover:bg-red-600 transition-colors cursor-pointer relative group"
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                                        {h}k
                                                    </div>
                                                </motion.div>
                                                <span className="text-[9px] font-bold text-slate-300">M{i + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Global Actions */}
                            <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
                                <div className="relative z-10">
                                    <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                                        <Zap className="w-6 h-6 text-red-500" />
                                        System Actions
                                    </h2>
                                    <div className="space-y-4">
                                        <button className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition">
                                            <div className="text-left">
                                                <p className="text-sm font-black text-white">Full Backup</p>
                                                <p className="text-[10px] font-bold text-white/40 uppercase">Global Database Sync</p>
                                            </div>
                                            <Server className="w-5 h-5 text-white/20 group-hover:text-red-500 transition" />
                                        </button>
                                        <button className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition">
                                            <div className="text-left">
                                                <p className="text-sm font-black text-white">Revenue Report</p>
                                                <p className="text-[10px] font-bold text-white/40 uppercase">Export P&L 2025</p>
                                            </div>
                                            <DollarSign className="w-5 h-5 text-white/20 group-hover:text-emerald-500 transition" />
                                        </button>
                                    </div>
                                </div>
                                <div className="relative z-10 mt-8 pt-8 border-t border-white/5">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Core System Health</p>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Notice Modal */}
            <AnimatePresence>
                {isNoticeModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsNoticeModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Global Announcement</h2>
                                    <p className="text-sm font-medium text-slate-500">Reach every student on the platform</p>
                                </div>
                                <button onClick={() => setIsNoticeModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleNoticeSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Announcement Title</label>
                                    <input required type="text" value={noticeFormData.title} onChange={(e) => setNoticeFormData({ ...noticeFormData, title: e.target.value })} placeholder="e.g. Server Maintenance or New Course Launch" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Priority</label>
                                    <select value={noticeFormData.priority} onChange={(e) => setNoticeFormData({ ...noticeFormData, priority: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                        <option value="low">Low - General Info</option>
                                        <option value="medium">Medium - Important</option>
                                        <option value="high">High - Urgent Action</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Notice Content</label>
                                    <textarea required rows={4} value={noticeFormData.content} onChange={(e) => setNoticeFormData({ ...noticeFormData, content: e.target.value })} placeholder="Write your message here..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" />
                                </div>
                                <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 disabled:opacity-50">
                                    {isSubmitting ? 'Blasting...' : 'Blast Announcement Now'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
