'use client'

import React, { useState } from 'react'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import { motion } from 'framer-motion'
import {
    CheckCircle2,
    X,
    Zap,
    BookOpen,
    Target,
    TrendingUp,
    AlertCircle,
    Clock,
    Users,
    Award,
    Phone,
    Mail,
    User,
    Sparkles,
    Star,
    ArrowRight
} from 'lucide-react'
import { toast } from 'react-toastify'
import Script from 'next/script'

const CBSERevisionPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: ''
    })
    const [phoneOtpSent, setPhoneOtpSent] = useState(false)
    const [phoneVerified, setPhoneVerified] = useState(false)
    const [phoneOtp, setPhoneOtp] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedGrade, setSelectedGrade] = useState<'Grade 10' | 'Grade 12'>('Grade 10')
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

    const grade10Classes = [
        { subject: 'MATH', date: '15 FEBRUARY', time: '8 AM - 3 PM', color: 'bg-blue-600' },
        { subject: 'SCIENCE', date: '22 FEBRUARY', time: '8 AM - 3 PM', color: 'bg-emerald-600' }
    ]

    const grade12Classes = [
        { subject: 'MATHEMATICS', date: '28 FEB - 1 MAR', time: '4 PM - 8 PM & 8 AM - 1 PM', color: 'bg-orange-600' },
        { subject: 'PHYSICS', date: '13-14 FEB', time: '4 PM - 8 PM & 8 AM - 7 PM', color: 'bg-pink-600' },
        { subject: 'CHEMISTRY', date: '21-24 FEB', time: '4 PM - 8 PM & 8 AM - 1 PM', color: 'bg-purple-600' },
        { subject: 'BIOLOGY', date: '21-22 MAR', time: '4 PM - 8 PM & 8 AM - 1 PM', color: 'bg-teal-600' }
    ]

    const handleClassSelect = (grade: 'Grade 10' | 'Grade 12') => {
        setSelectedGrade(grade)
        if (grade === 'Grade 10') {
            setSelectedSubjects(grade10Classes.map(c => c.subject))
        } else {
            setSelectedSubjects(grade12Classes.map(c => c.subject))
        }
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })
    }

    const toggleSubject = (subject: string) => {
        if (selectedSubjects.includes(subject)) {
            setSelectedSubjects(prev => prev.filter(s => s !== subject))
        } else {
            setSelectedSubjects(prev => [...prev, subject])
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (name === 'phoneNumber') {
            setPhoneVerified(false)
            setPhoneOtpSent(false)
        }
    }

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const validatePhone = (phone: string) => /^\d{10}$/.test(phone)

    const handleSendPhoneOtp = () => {
        if (!validatePhone(formData.phoneNumber)) {
            toast.error("Please enter a valid 10-digit phone number")
            return
        }
        setIsLoading(true)

        // @ts-ignore
        if (!window.sendOtp) {
            toast.error("OTP service not ready. Please refresh or check console.")
            console.error("MSG91 window.sendOtp is undefined. Widget might not have initialized.")
            setIsLoading(false)
            return
        }

        // @ts-ignore
        window.sendOtp(
            `91${formData.phoneNumber}`,
            (data: any) => {
                console.log("OTP Sent:", data)
                setPhoneOtpSent(true)
                toast.success("OTP sent to your phone")
                setIsLoading(false)
            },
            (error: any) => {
                console.error("OTP Send Error:", error)
                // Try to extract readable error message
                const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error))
                toast.error(`Failed to send OTP: ${msg}`)
                setIsLoading(false)
            }
        )
    }

    const handleVerifyPhone = () => {
        if (!phoneOtp) {
            toast.error("Please enter OTP")
            return
        }
        setIsLoading(true)

        // @ts-ignore
        window.verifyOtp(
            Number(phoneOtp),
            (data: any) => {
                console.log("Verified:", data)
                setPhoneVerified(true)
                toast.success("Phone verified successfully!")
                setIsLoading(false)
            },
            (error: any) => {
                console.error("Verification Error:", error)
                const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error))
                toast.error(`Invalid OTP: ${msg}`)
                setIsLoading(false)
            }
        )
    }

    const handleMsg91Load = () => {
        const configuration = {
            widgetId: process.env.NEXT_PUBLIC_MSG91_WIDGET_ID,
            tokenAuth: process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH,
            exposeMethods: true,
        }
        console.log("Initializing MSG91 Widget with:", configuration)
        // @ts-ignore
        if (window.initSendOTP) {
            // @ts-ignore
            window.initSendOTP(configuration)
        } else {
            console.error("window.initSendOTP is missing even after script load")
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.fullName || !phoneVerified || !validateEmail(formData.email)) {
            toast.error("Please complete all details and verify your phone")
            return
        }
        if (selectedSubjects.length === 0) {
            toast.error("Please select at least one subject")
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    phone: `91${formData.phoneNumber}`,
                    grade: selectedGrade,
                    subjects: selectedSubjects,
                    courseInterest: `CBSE One-Shot Revision - ${selectedGrade}`,
                    source: 'CBSE Revision Registration'
                })
            })
            if (res.ok) {
                toast.success("Registration successful! We will send you the class link shortly.")
                setFormData({ fullName: '', phoneNumber: '', email: '' })
                setPhoneVerified(false)
                setPhoneOtpSent(false)
                setPhoneOtp('')
                setSelectedSubjects([])
            } else {
                toast.error("Failed to register. Please try again.")
            }
        } catch (error) {
            toast.error("Failed to register. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <PublicHeader />

            {/* Hero Section - New Design */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900 min-h-[85vh] flex items-center">
                {/* CSS Based Abstract Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-sm font-bold mb-8 backdrop-blur-sm">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                </span>
                                LIVE CRASH COURSE BATCH
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                                Ace Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-200">
                                    Board Exams
                                </span>
                            </h1>

                            <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium max-w-xl">
                                Join the ultimate <strong>Free Revision Series</strong>. Master Math & Science with India's best educators before it's too late.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <button
                                    onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black uppercase tracking-wider transition-all shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1"
                                >
                                    Save My Spot
                                </button>
                                <div className="flex -space-x-4 items-center px-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold text-white relative z-0 hover:z-10 hover:scale-110 transition-transform cursor-pointer">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                    <div className="pl-6 text-sm font-bold text-slate-400">
                                        <span className="text-white">500+</span> Students Joined
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Abstract Composition */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            {/* Decorative Cards */}
                            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                                {/* Card 1: Math */}
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-0 right-10 z-20"
                                >
                                    <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-48">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                                            <TrendingUp className="text-white" />
                                        </div>
                                        <p className="text-slate-200 text-sm font-medium">Math Score</p>
                                        <p className="text-3xl font-black text-white">+25%</p>
                                    </div>
                                </motion.div>

                                {/* Card 2: Science */}
                                <motion.div
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-20 left-0 z-30"
                                >
                                    <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-56">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                                                <Zap className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">Science</p>
                                                <p className="text-xs text-slate-300">Revision</p>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full w-[85%] bg-emerald-400" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Center Circle */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full z-0 flex items-center justify-center">
                                    <div className="w-64 h-64 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute w-full h-full border border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>



            {/* Class Cards Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Choose Your Class</h2>
                        <p className="text-slate-600 font-medium">Select your grade to view schedule & register</p>
                    </div>

                    {/* Grade 10 Section */}
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-slate-200"></div>
                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-wider bg-slate-100 px-6 py-2 rounded-full">Grade 10</h3>
                            <div className="h-px flex-1 bg-slate-200"></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {grade10Classes.map((cls, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden hover:border-blue-200 hover:shadow-2xl transition-all group"
                                >
                                    <div className="p-8 text-center space-y-4">
                                        <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm tracking-wide mb-2">
                                            GRADE 10
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">{cls.date}</p>
                                            <p className="text-slate-900 font-bold">{cls.time}</p>
                                        </div>

                                        <h3 className="text-4xl font-black text-blue-600 py-2">{cls.subject}</h3>

                                        <div className="py-2">
                                            <span className="text-slate-400 font-bold tracking-[0.2em] text-sm uppercase">FREE</span>
                                        </div>

                                        <button
                                            onClick={() => handleClassSelect('Grade 10')}
                                            className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all"
                                        >
                                            Register
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Grade 12 Section */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-slate-200"></div>
                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-wider bg-slate-100 px-6 py-2 rounded-full">Grade 12</h3>
                            <div className="h-px flex-1 bg-slate-200"></div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {grade12Classes.map((cls, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden hover:border-orange-200 hover:shadow-2xl transition-all group"
                                >
                                    <div className="p-6 text-center space-y-4">
                                        <div className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 rounded-lg font-bold text-xs tracking-wide mb-2">
                                            GRADE 12
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">{cls.date}</p>
                                            <p className="text-slate-900 font-bold text-xs">{cls.time}</p>
                                        </div>

                                        <h3 className={`text-2xl font-black py-2 ${cls.subject === 'MATHEMATICS' ? 'text-orange-500' :
                                            cls.subject === 'PHYSICS' ? 'text-pink-500' :
                                                cls.subject === 'CHEMISTRY' ? 'text-purple-500' : 'text-teal-500'
                                            }`}>{cls.subject}</h3>

                                        <div className="py-2">
                                            <span className="text-slate-400 font-bold tracking-[0.2em] text-[10px] uppercase">FREE</span>
                                        </div>

                                        <button
                                            onClick={() => handleClassSelect('Grade 12')}
                                            className="w-full py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-black uppercase tracking-wider text-xs hover:border-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                                        >
                                            Register
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* What You'll Revise */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">What You'll Revise</h2>
                        <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto">
                            Our FREE CBSE One-Shot Revision Class for Class 10 & 12 (Maths & Science) is designed to help students revise the entire syllabus quickly and effectively just before exams.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-10">
                        {[
                            { icon: <Zap className="w-6 h-6" />, text: 'All key formulas and important definitions', color: 'bg-yellow-500' },
                            { icon: <Target className="w-6 h-6" />, text: 'Core concepts frequently tested in CBSE exams', color: 'bg-blue-500' },
                            { icon: <TrendingUp className="w-6 h-6" />, text: 'Exam-oriented shortcuts and smart problem-solving methods', color: 'bg-emerald-500' },
                            { icon: <BookOpen className="w-6 h-6" />, text: 'High-weightage chapters and question patterns', color: 'bg-purple-500' },
                            { icon: <AlertCircle className="w-6 h-6" />, text: 'Common mistakes to avoid losing easy marks', color: 'bg-rose-500' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200 hover:border-orange-200 hover:shadow-md transition-all"
                            >
                                <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                                    {item.icon}
                                </div>
                                <p className="text-slate-700 font-bold leading-relaxed pt-2">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-6 bg-gradient-to-r from-orange-50 to-primary-50 rounded-2xl border-2 border-orange-100">
                        <p className="text-center text-lg font-bold text-slate-800">
                            This class is ideal for <span className="text-orange-600">last-minute revision</span> to boost confidence and exam readiness.
                        </p>
                    </div>
                </div>
            </section>

            {/* Who Should Attend */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 text-center">Who Should Attend?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { icon: <Users className="w-6 h-6" />, text: 'Class 10 & 12 CBSE students' },
                            { icon: <Clock className="w-6 h-6" />, text: 'Students who want quick, structured revision' },
                            { icon: <AlertCircle className="w-6 h-6" />, text: 'Those feeling short on time before exams' },
                            { icon: <Award className="w-6 h-6" />, text: 'Students aiming to reduce mistakes and improve accuracy' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-orange-200 hover:shadow-lg transition-all text-center"
                            >
                                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    {item.icon}
                                </div>
                                <p className="font-bold text-slate-700">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Do's and Don'ts */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Do's */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">Do's for Students</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    'Join the class on time and stay till the end',
                                    'Keep notebook, pen, and formula sheet ready',
                                    'Listen actively — this is revision, not detailed teaching',
                                    'Note down shortcuts, tricks, and important pointers',
                                    'Revise the notes again on the same day'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-emerald-100">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-slate-700 font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Don'ts */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white">
                                    <X className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">Don'ts During Class</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    "Don't try to learn new topics for the first time",
                                    "Don't multitask (no phone, reels, or chatting)",
                                    "Don't panic if something feels unfamiliar — focus on what you know",
                                    "Don't skip revision thinking 'I already know this'"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-rose-100">
                                        <X className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-slate-700 font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Exam Prep Tips */}
            < section className="py-20 bg-gradient-to-br from-primary-600 to-indigo-700 text-white" >
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <h2 className="text-3xl md:text-4xl font-black mb-10 text-center">Last-Minute Exam Preparation Tips</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            'Revise formulas and key concepts daily',
                            'Focus more on high-weightage chapters',
                            'Practice 2–3 sample questions per topic',
                            'Avoid starting new chapters at the last moment',
                            'Sleep well — a calm mind scores better'
                        ].map((tip, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="font-black text-sm">{idx + 1}</span>
                                    </div>
                                    <p className="font-bold leading-relaxed">{tip}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Bottom Registration Form Section */}
            < section className="py-24 bg-slate-50 relative overflow-hidden" >
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />

                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <motion.div
                        id="registration-form"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-4 border-white ring-4 ring-slate-100"
                    >
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/30 rotate-3 hover:rotate-6 transition-transform">
                                <Star className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Secure Your Spot</h2>
                            <p className="text-lg text-slate-600 font-medium">Register for FREE • Limited seats for this batch</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-6">
                            {/* Grade & Subject Selection */}
                            <div className="space-y-3 p-6 bg-slate-50/80 rounded-2xl border border-slate-200">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-700">Select Grade & Subjects</label>

                                <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 mb-4 shadow-sm">
                                    {(['Grade 10', 'Grade 12'] as const).map((grade) => (
                                        <button
                                            key={grade}
                                            type="button"
                                            onClick={() => {
                                                setSelectedGrade(grade)
                                                setSelectedSubjects([])
                                            }}
                                            className={`flex-1 py-3 text-sm font-black rounded-lg transition-all ${selectedGrade === grade
                                                ? 'bg-orange-500 text-white shadow-md'
                                                : 'text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            {grade}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {(selectedGrade === 'Grade 10' ? grade10Classes : grade12Classes).map((item) => (
                                        <div
                                            key={item.subject}
                                            onClick={() => toggleSubject(item.subject)}
                                            className={`cursor-pointer px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center gap-3 active:scale-95 ${selectedSubjects.includes(item.subject)
                                                ? 'bg-orange-50 border-orange-500 text-orange-700'
                                                : 'bg-white border-slate-100 text-slate-600 hover:border-orange-300'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${selectedSubjects.includes(item.subject)
                                                ? 'bg-orange-500 border-orange-500'
                                                : 'border-slate-300'
                                                }`}>
                                                {selectedSubjects.includes(item.subject) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            {item.subject}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 text-center pt-2 font-medium">Select all the subjects you want to revise</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-700 ml-1">Phone Number</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            disabled={phoneVerified || isLoading}
                                            placeholder="10-digit number"
                                            className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:font-medium ${phoneVerified ? 'opacity-60' : ''}`}
                                        />
                                        {phoneVerified && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />}
                                    </div>
                                    {!phoneVerified && (
                                        <button
                                            type="button"
                                            disabled={isLoading || !validatePhone(formData.phoneNumber)}
                                            onClick={handleSendPhoneOtp}
                                            className="px-6 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 active:scale-95"
                                        >
                                            {phoneOtpSent ? 'Resend' : 'Get OTP'}
                                        </button>
                                    )}
                                </div>
                                {phoneOtpSent && !phoneVerified && (
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            type="text"
                                            maxLength={4}
                                            placeholder="Enter OTP"
                                            className="flex-1 px-4 py-3 bg-white border-2 border-orange-200 focus:border-orange-500 rounded-xl outline-none text-sm font-bold text-center"
                                            value={phoneOtp}
                                            onChange={(e) => setPhoneOtp(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            disabled={isLoading || phoneOtp.length !== 4}
                                            onClick={handleVerifyPhone}
                                            className="px-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-50 transition-all"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 placeholder:font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !phoneVerified || !formData.fullName || !validateEmail(formData.email) || selectedSubjects.length === 0}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-wider text-lg transition-all shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 active:scale-95 ${(phoneVerified && formData.fullName && validateEmail(formData.email) && selectedSubjects.length > 0)
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {isLoading ? 'Processing...' : 'Complete Registration'}
                            </button>

                            <p className="text-xs text-center text-slate-500 font-medium">
                                By registering, you agree to receive class updates via email and SMS.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </section>

            <PublicFooter />
            <Script
                src="https://verify.msg91.com/otp-provider.js"
                onLoad={handleMsg91Load}
                strategy="afterInteractive"
            />
        </div>
    )
}

export default CBSERevisionPage
