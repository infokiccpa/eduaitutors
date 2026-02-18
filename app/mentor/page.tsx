'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import {
    Users,
    Video,
    MessageSquare,
    Star,
    Calendar,
    Clock,
    ArrowRight,
    Sparkles,
    Plus,
    ChevronRight,
    Trophy,
    TrendingUp,
    LayoutGrid,
    Search,
    Filter,
    X,
    Send,
    UserCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function MentorDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [students, setStudents] = useState<any[]>([])

    const [messageFormData, setMessageFormData] = useState({
        receiverId: '', // parentId
        studentId: '', // for ref
        content: ''
    })

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && (session.user as any).role !== 'mentor')) {
            router.push('/dashboard')
        }
    }, [status, session, router])

    const fetchMentorStats = async () => {
        // Mocking mentor specific stats
        await new Promise(r => setTimeout(r, 800));
        setStats({
            myStudents: '45',
            liveClassesToday: '3',
            pendingFeedback: '12',
            rating: '4.9/5'
        })
        setLoading(false)
    }

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/admin/users?role=student')
            if (res.ok) setStudents(await res.json())
        } catch (e) { console.error(e) }
    }

    useEffect(() => {
        if (status === 'authenticated' && (session.user as any).role === 'mentor') {
            fetchMentorStats()
            fetchStudents()
        }
    }, [status, session])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!messageFormData.content) return
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...messageFormData,
                    receiverId: '65a7f9876543210987654321' // Mock parent ID for demo
                })
            })
            if (res.ok) {
                toast.success('Note sent to parent!')
                setIsMessageModalOpen(false)
                setMessageFormData({ receiverId: '', studentId: '', content: '' })
            } else {
                toast.error('Failed to send message')
            }
        } catch (error) { toast.error('Failed to send') }
        finally { setIsSubmitting(false) }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const metrics = [
        { label: 'Assigned Students', value: stats.myStudents, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: "Today's Classes", value: stats.liveClassesToday, icon: Video, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Pending Reviews', value: stats.pendingFeedback, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Avg Instructor Rating', value: stats.rating, icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ]

    return (
        <div className="min-h-screen bg-[#FAFBFF]">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative mb-12 bg-white p-12 rounded-[4rem] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-indigo-50">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-70" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">Mentor Workspace</span>
                                </div>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Hello, Mentor! 👋</h1>
                                <p className="text-slate-500 font-medium text-xl max-w-2xl leading-relaxed">
                                    Ready to inspire? You have <span className="text-indigo-600 font-black">3 live classes</span> scheduled for today. Your students are making great progress!
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                            {metrics.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center mb-6`}>
                                        <m.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</h3>
                                    <p className="text-4xl font-black text-slate-900">{m.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                        <Calendar className="w-6 h-6 text-rose-500" />
                                        Upcoming Live Sessions
                                    </h2>
                                    <Link
                                        href="/live-classroom?admin=true&subject=PHYSICS&grade=Grade 12&startTime=2026-02-18T17:30:00+05:30&videoUrl=https://d2s1ewe54603y0.cloudfront.net/live_class/index.m3u8"
                                        className="px-4 py-2 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition shadow-lg shadow-rose-500/20 flex items-center gap-2"
                                    >
                                        <Video className="w-3.5 h-3.5" /> Start Live Class
                                    </Link>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { title: 'Organic Chemistry Q&A', time: '14:00 - 15:30', group: 'Grade 12 (JEE Mastery)', icon: Clock },
                                        { title: 'Physics Doubt Clearing', time: '16:30 - 17:30', group: 'Grade 11 (Foundation)', icon: Clock },
                                    ].map((session, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-lg transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 border border-slate-100">
                                                    <Clock className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-slate-900">{session.title}</p>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{session.group}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg inline-block">{session.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-indigo-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-center">
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mb-32 -mr-32" />
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black mb-6">Student Feedback is Live!</h2>
                                    <p className="text-indigo-200 text-lg font-medium mb-10 leading-relaxed">
                                        Students from your last Physics session have left their review. Your current teaching satisfaction rate is at an all-time high of 98%.
                                    </p>
                                    <div className="flex gap-3 mt-8">
                                        <button
                                            onClick={() => setIsMessageModalOpen(true)}
                                            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/20 flex items-center gap-2"
                                        >
                                            <MessageSquare className="w-4 h-4" /> Message Parent
                                        </button>
                                        <button className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> View Schedule
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Message Modal */}
            <AnimatePresence>
                {isMessageModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMessageModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Send Note to Parent</h2>
                                    <p className="text-sm font-medium text-slate-500">Communicate child's performance</p>
                                </div>
                                <button onClick={() => setIsMessageModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSendMessage} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Select Student</label>
                                    <select
                                        required
                                        value={messageFormData.studentId}
                                        onChange={(e) => setMessageFormData({ ...messageFormData, studentId: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                    >
                                        <option value="">Choose Student</option>
                                        {students.map((s: any) => <option key={s._id} value={s._id}>{s.name} ({s.grade}th)</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Parent (Auto-Linked)</label>
                                    <input required type="text" placeholder="Parent will be auto-linked" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none cursor-not-allowed" readOnly value="Verified Parent Account" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Note Content</label>
                                    <textarea required rows={4} value={messageFormData.content} onChange={(e) => setMessageFormData({ ...messageFormData, content: e.target.value })} placeholder="Enter your observation or progress update..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" />
                                </div>
                                <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2">
                                    <Send className="w-4 h-4" /> {isSubmitting ? 'Sending...' : 'Send Note Now'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
