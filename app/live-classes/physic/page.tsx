'use client'

import React, { useState } from 'react'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import {
    MessageCircle,
    Users,
    Share2,
    Volume2,
    Settings,
    Maximize2,
    Info,
    FileText,
    History,
    Download,
    Lock,
    Phone,
    ArrowRight,
    CheckCircle2,
    Loader2,
    Mail
} from 'lucide-react'

const PhysicsLiveStreamPage = () => {
    const [isAccessGranted, setIsAccessGranted] = useState(false)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSendOtp = async () => {
        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid email address")
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch('/api/otp/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            if (res.ok) {
                setOtpSent(true)
                toast.success("OTP sent to your registered email")
            } else {
                toast.error("Failed to send OTP. Please ensure you are registered.")
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyAccess = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter 6-digit OTP")
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch('/api/otp/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    otp: otp
                })
            })
            if (res.ok) {
                setIsAccessGranted(true)
                toast.success("Access Granted! Enjoy the session.")
            } else {
                const data = await res.json()
                toast.error(data.message || "Invalid OTP")
            }
        } catch (error) {
            toast.error("Verification failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F172A] selection:bg-primary-500/30 selection:text-white relative">
            <PublicHeader />

            {/* Access Protection Overlay */}
            <AnimatePresence>
                {!isAccessGranted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-lg w-full text-center"
                        >
                            <div className="w-20 h-20 bg-primary-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary-500">
                                <Lock className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4">Student Access Only</h2>
                            <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                                This live session is exclusive to registered students. Please verify your email address to continue.
                            </p>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="email"
                                        disabled={otpSent || isLoading}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Registered Email Address"
                                        className="w-full pl-16 pr-6 py-5 bg-slate-800 border-2 border-transparent focus:border-primary-500/50 rounded-2xl outline-none text-white font-bold transition-all disabled:opacity-50"
                                    />
                                    {!otpSent && (
                                        <button
                                            onClick={handleSendOtp}
                                            disabled={isLoading || !email.includes('@')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get OTP'}
                                        </button>
                                    )}
                                </div>

                                {otpSent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter 6-Digit OTP"
                                            className="w-full px-6 py-5 bg-slate-800 border-2 border-primary-500/30 focus:border-primary-500 rounded-2xl outline-none text-white font-bold text-center tracking-[1em] transition-all"
                                        />
                                        <button
                                            onClick={handleVerifyAccess}
                                            disabled={isLoading || otp.length !== 6}
                                            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Stream'}
                                            {!isLoading && <ArrowRight className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => setOtpSent(false)}
                                            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                                        >
                                            Change Email Address
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="pt-24 pb-12">
                <div className="max-w-[95rem] mx-auto px-4 md:px-8">
                    {/* Top Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                                <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.2em]">Live Session</span>
                                <div className="h-4 w-[1px] bg-slate-800 mx-2" />
                                <span className="text-slate-400 text-sm font-medium">Class 10 Physics</span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                                Principles of <span className="text-primary-400">Electromagnetism</span> & Applications
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F172A] bg-slate-800 flex items-center justify-center overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-[#0F172A] bg-primary-600 flex items-center justify-center text-[10px] font-bold text-white">
                                    +240
                                </div>
                            </div>
                            <div className="hidden lg:block text-slate-400">
                                <span className="text-white font-bold block leading-none">244 students</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Watching Now</span>
                            </div>
                            <button className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-2xl text-white transition-all">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                        {/* Video Player Section */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-500/10 border border-slate-800 group"
                            >
                                {/* This is a placeholder for the actual stream - Replace with YouTube/Vimeo/Custom SDK */}
                                <iframe
                                    className="w-full h-full pointer-events-none"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&loop=1&playlist=dQw4w9WgXcQ"
                                    title="Physics Live Stream"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                ></iframe>

                                {/* Custom Overlay for Premium Look */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none p-8 flex flex-col justify-end">
                                    <div className="flex items-center justify-between pointer-events-auto">
                                        <div className="flex items-center gap-6">
                                            <button className="text-white hover:text-primary-400 transition-colors">
                                                <Volume2 className="w-6 h-6" />
                                            </button>
                                            <div className="text-white text-sm font-bold">12:45 / 45:00</div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button className="text-white hover:text-primary-400 transition-colors">
                                                <Settings className="w-6 h-6" />
                                            </button>
                                            <button className="text-white hover:text-primary-400 transition-colors">
                                                <Maximize2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-6 left-6 flex items-center gap-3">
                                    <div className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                        Live
                                    </div>
                                    <div className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                                        1080p HD
                                    </div>
                                </div>
                            </motion.div>

                            {/* Class Meta & Resources */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-slate-800">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                                            <Info className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-white uppercase tracking-wider text-sm">Class Information</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                                        In this session, we dive deep into electromagnetic induction, Lenz's law, and Faraday's experiments. Essential for board exams.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                            <img src="https://api.dicebear.com/7.x/initials/svg?seed=Dr.S" alt="Mentor" />
                                        </div>
                                        <div>
                                            <span className="text-white font-bold text-sm block leading-none">Dr. Sameer Khan</span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase">Senior Physics Mentor</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-slate-800">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-white uppercase tracking-wider text-sm">Study Resources</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Class Notes PDF', size: '2.4 MB' },
                                            { name: 'Practice Sheet #04', size: '1.1 MB' }
                                        ].map((file, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <Download className="w-4 h-4 text-slate-500 group-hover:text-primary-400" />
                                                    <span className="text-slate-300 text-sm font-bold">{file.name}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-600 font-bold">{file.size}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Chat & Updates */}
                        <div className="space-y-8 flex flex-col h-full">
                            <div className="flex-1 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <h3 className="font-black text-white uppercase tracking-widest text-xs">Live Chat</h3>
                                    </div>
                                    <div className="px-2 py-1 bg-slate-800 rounded-lg text-[10px] text-slate-400 font-black">
                                        Active
                                    </div>
                                </div>

                                <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[500px] scrollbar-hide">
                                    {[
                                        { user: 'Aryan', msg: 'Is this important for CBSE Boards?', color: 'text-blue-400' },
                                        { user: 'Priya', msg: 'Can you repeat Lenz\'s Law once?', color: 'text-orange-400' },
                                        { user: 'Rahul', msg: 'The explanation is amazing sir!', color: 'text-emerald-400' },
                                        { user: 'Sneha', msg: 'Joined from Delhi. Hello everyone!', color: 'text-purple-400' },
                                        { user: 'Admin', msg: 'Notes are uploaded in the resources section.', color: 'text-primary-500' },
                                    ].map((chat, i) => (
                                        <div key={i} className="animate-in slide-in-from-bottom-2 fade-in duration-500">
                                            <span className={`font-black tracking-tight ${chat.color} text-[11px] mr-2`}>{chat.user}:</span>
                                            <span className="text-slate-400 text-xs font-medium">{chat.msg}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 border-t border-slate-800 pt-auto">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Ask a question..."
                                            className="w-full bg-slate-800 border-2 border-transparent focus:border-primary-500/50 rounded-2xl px-6 py-4 text-sm text-white outline-none transition-all pr-14 font-medium"
                                        />
                                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-primary-500 hover:bg-slate-700/50 rounded-xl transition-all">
                                            <MessageCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Sessions */}
                            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-indigo-700 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <History className="w-5 h-5 text-white/80" />
                                        <h3 className="font-black text-white uppercase tracking-widest text-xs">Next Session</h3>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2 leading-tight">Light: Reflection & Refraction Part 2</h4>
                                    <p className="text-white/60 text-xs font-medium mb-6">Tomorrow at 4:30 PM IST</p>
                                    <button className="w-full py-3 bg-white text-primary-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all shadow-xl shadow-black/20">
                                        Set Reminder
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}

export default PhysicsLiveStreamPage
