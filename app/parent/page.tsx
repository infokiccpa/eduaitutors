'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import {
    Baby,
    BarChart4,
    Trophy,
    Target,
    CreditCard,
    Bell,
    ChevronRight,
    TrendingUp,
    Heart,
    Plus,
    Calendar,
    Users,
    Activity,
    Server,
    DollarSign,
    LayoutGrid,
    Search,
    Filter,
    X,
    MessageSquare,
    CheckCircle2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'

export default function ParentDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState<any[]>([])
    const [isInboxOpen, setIsInboxOpen] = useState(false)

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages')
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        } catch (e) { console.error("Failed to fetch messages:", e) }
    }

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && (session.user as any).role !== 'parent')) {
            router.push('/dashboard')
        }

        const fetchParentStats = async () => {
            // Mocking parent specific data for their child
            await new Promise(r => setTimeout(r, 800));
            setStats({
                childName: 'Rahul',
                courseProgress: '68%',
                avgScore: '85%',
                hoursStudied: '14h',
                badgesEarned: '4'
            })
            setLoading(false)
        }

        if (status === 'authenticated' && (session.user as any).role === 'parent') {
            fetchParentStats()
            fetchMessages() // Fetch messages when authenticated
        }
    }, [status, session, router])

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const metrics = [
        { label: 'Overall Progress', value: stats.courseProgress, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Academic Performance', value: stats.avgScore, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Total Study Time', value: stats.hoursStudied, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Achievements', value: stats.badgesEarned, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    ]

    return (
        <div className="min-h-screen bg-[#FDFEFE]">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Parent Monitoring Portal</span>
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Watching {stats.childName}'s Progress 🚀</h1>
                                <p className="text-slate-500 font-medium text-lg mt-1">Keep track of learning milestones and academic performance.</p>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setIsInboxOpen(true)}
                                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition shadow-xl shadow-emerald-600/20 flex items-center gap-2"
                                >
                                    <MessageSquare className="w-4 h-4" /> Mentor Notes {messages.length > 0 && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                                </button>
                                <button className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                                    <Bell className="w-4 h-4" /> Notification Settings
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                            {metrics.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm"
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center mb-6`}>
                                        <m.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</h3>
                                    <p className="text-3xl font-black text-slate-900">{m.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 bg-white rounded-[4rem] p-10 border border-slate-100 shadow-sm">
                                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <BarChart4 className="w-6 h-6 text-blue-600" />
                                    Weekly Activity Summary
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        { activity: 'Completed Mathematics Quiz', score: '92%', time: 'Today, 10:30 AM', icon: Trophy, color: 'text-amber-500' },
                                        { activity: 'Watched Physics Video: Newton\'s Laws', time: 'Yesterday, 4:15 PM', icon: Baby, color: 'text-blue-500' },
                                        { activity: 'Achieved 5-Day Study Streak', time: '2 days ago', icon: Heart, color: 'text-rose-500' },
                                    ].map((act, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center ${act.color} shadow-sm border border-slate-100`}>
                                                    <act.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-slate-900">{act.activity}</p>
                                                    <p className="text-xs font-bold text-slate-400 uppercase">{act.time}</p>
                                                </div>
                                            </div>
                                            {act.score && (
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-emerald-600">{act.score}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3.5rem] p-10 text-white shadow-2xl">
                                    <CreditCard className="w-10 h-10 mb-6 opacity-40" />
                                    <h3 className="text-xl font-black mb-2 tracking-tight">Subscription Status</h3>
                                    <p className="text-blue-100 font-medium mb-8">Next billing date: Feb 12, 2026</p>
                                    <div className="bg-white/10 rounded-2xl p-6 border border-white/10 mb-8">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Current Plan</p>
                                        <p className="text-lg font-black uppercase">JEE Mastery Accelerator</p>
                                    </div>
                                    <button className="w-full py-4 bg-white text-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition">
                                        Manage Billing
                                    </button>
                                </div>

                                <div className="bg-emerald-50 rounded-[3.5rem] p-10 border border-emerald-100">
                                    <Heart className="w-8 h-8 text-emerald-600 mb-4" />
                                    <h3 className="text-xl font-black text-emerald-900 mb-2 tracking-tight">Parent Teacher Meeting</h3>
                                    <p className="text-emerald-700/70 text-sm font-medium leading-relaxed mb-6">
                                        A session with Mentor Dr. Sarah Wilson is scheduled for next Monday.
                                    </p>
                                    <button className="w-full flex items-center justify-between text-emerald-600 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform">
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Inbox Modal */}
            <AnimatePresence>
                {isInboxOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsInboxOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Mentor Notes</h2>
                                    <p className="text-sm font-medium text-slate-500">Communication regarding Rahul's progress</p>
                                </div>
                                <button onClick={() => setIsInboxOpen(false)} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                                {messages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-slate-400 uppercase">No messages yet</p>
                                    </div>
                                ) : (
                                    messages.map((m: any, i: number) => (
                                        <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                                                        {m.senderId?.name.charAt(0)}
                                                    </div>
                                                    <p className="text-sm font-black text-slate-900">{m.senderId?.name}</p>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.senderId?.role}</span>
                                                </div>
                                                <p className="text-[10px] font-medium text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{m.content}"</p>
                                            <div className="flex items-center gap-2 pt-2">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                <p className="text-[9px] font-black uppercase text-emerald-600 tracking-tighter">Verified Official Update</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
