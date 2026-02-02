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

const CourseTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
    const [status, setStatus] = useState<'UPCOMING' | 'LIVE' | 'ENDED'>('UPCOMING');

    React.useEffect(() => {
        const target = new Date(targetDate).getTime();
        const end = target + (3 * 60 * 60 * 1000); // Assume 3 hours duration for "LIVE" status check

        const calculateTime = () => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff > 0) {
                setStatus('UPCOMING');
                setTimeLeft({
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000),
                });
            } else if (now < end) {
                setStatus('LIVE');
                setTimeLeft(null);
            } else {
                setStatus('ENDED');
                setTimeLeft(null);
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (status === 'ENDED') return (
        <div className="py-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider border border-slate-200">
                Class Ended
            </span>
        </div>
    );

    if (status === 'LIVE') return (
        <div className="py-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 font-bold text-xs uppercase tracking-wider border border-red-100 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                Live Now
            </span>
        </div>
    );

    if (!timeLeft) return null;

    return (
        <div className="flex justify-center items-end gap-1.5 py-1">
            {[
                { label: 'D', val: timeLeft.d },
                { label: 'H', val: timeLeft.h },
                { label: 'M', val: timeLeft.m },
                { label: 'S', val: timeLeft.s }
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="relative group">
                        <div className="w-8 h-8 bg-slate-100 text-slate-900 rounded-md flex items-center justify-center font-black text-xs border border-slate-200">
                            {item.val < 10 ? `0${item.val}` : item.val}
                        </div>
                    </div>
                    <span className="text-[7px] font-bold text-slate-400 mt-1 tracking-widest">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const HeroCountdown = ({ classes }: { classes: any[] }) => {
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
    const [targetClass, setTargetClass] = useState<any>(null);

    React.useEffect(() => {
        const findNextClass = () => {
            const now = new Date().getTime();
            // Filter and sort classes to find the nearest upcoming one
            const upcoming = classes
                .map(c => ({ ...c, startTime: new Date(c.startDate).getTime() }))
                .filter(c => c.startTime > now)
                .sort((a, b) => a.startTime - b.startTime)[0];

            setTargetClass(upcoming);
        };

        findNextClass();
        const interval = setInterval(findNextClass, 60000); // Check every minute for next class updates
        return () => clearInterval(interval);
    }, [classes]);

    React.useEffect(() => {
        if (!targetClass) return;

        const calculateTime = () => {
            const now = new Date().getTime();
            const diff = targetClass.startTime - now;

            if (diff > 0) {
                setTimeLeft({
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000),
                });
            } else {
                setTimeLeft(null);
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [targetClass]);

    if (!timeLeft || !targetClass) return null;

    return (
        <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <p className="text-orange-300 font-bold text-sm tracking-wider uppercase">
                    Next Live Class: <span className="text-white">{targetClass.subject} ({targetClass.grade === 'Grade 10' ? '10th' : '12th'})</span>
                </p>
            </div>
            <div className="flex gap-4">
                {[
                    { label: 'DAYS', val: timeLeft.d },
                    { label: 'HOURS', val: timeLeft.h },
                    { label: 'MINUTES', val: timeLeft.m },
                    { label: 'SECONDS', val: timeLeft.s }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-4xl font-black text-white shadow-xl">
                            {item.val < 10 ? `0${item.val}` : item.val}
                        </div>
                        <span className="text-[10px] sm:text-xs text-orange-200/80 font-bold uppercase tracking-widest mt-2">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

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
        { grade: 'Grade 10', subject: 'MATHEMATICS', date: '15 FEBRUARY', time: '8 AM - 3 PM', startDate: '2026-02-15T08:00:00', color: 'bg-blue-600', image: '/grade_10_maths_bg.png' },
        { grade: 'Grade 10', subject: 'SCIENCE', date: '22 FEBRUARY', time: '8 AM - 3 PM', startDate: '2026-02-22T08:00:00', color: 'bg-emerald-600', image: '/science_10_bg.png' }
    ]

    const grade12Classes = [
        { grade: 'Grade 12', subject: 'PHYSICS', date: '13-14 FEB', time: '4 PM - 8 PM & 8 AM - 1 PM', startDate: '2026-02-13T16:00:00', color: 'bg-pink-600', image: '/physics_bg.png' },
        { grade: 'Grade 12', subject: 'BIOLOGY', date: '21-22 FEB', time: '4 PM - 8 PM & 8 AM - 1 PM', startDate: '2026-02-21T16:00:00', color: 'bg-emerald-600', image: '/biology_bg.png' },
        { grade: 'Grade 12', subject: 'MATHEMATICS', date: '28 FEB - 1 MAR', time: '4 PM - 8 PM & 8 AM - 1 PM', startDate: '2026-02-28T16:00:00', color: 'bg-purple-600', image: '/maths_12_bg.png' },
        { grade: 'Grade 12', subject: 'CHEMISTRY', date: '21-24 FEB', time: '4 PM - 8 PM & 8 AM - 1 PM', startDate: '2026-02-21T16:00:00', color: 'bg-teal-600', image: '/science_bg.png' }
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
                                Join the ultimate <strong>Free Revision Series</strong>. Master Maths, Science, Physics & Chemistry with India's best educators before it's too late.
                            </p>

                            {/* Hero Countdown - Automatically shows next upcoming class */}
                            <HeroCountdown classes={[...grade10Classes, ...grade12Classes]} />

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
            {/* Class Cards Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                        <h2 className="text-5xl font-black mb-4 tracking-tight relative z-10 text-slate-900">
                            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Class</span>
                        </h2>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto relative z-10">
                            Select your grade to view schedule & register
                        </p>
                    </div>

                    {/* Grade 10 Section */}
                    <div className="mb-16">
                        <div className="relative flex items-center justify-center py-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative z-10 bg-white px-6">
                                <span className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700 font-black tracking-widest uppercase shadow-sm text-lg">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                                    Grade 10
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {/* @ts-ignore */}
                            {grade10Classes.map((cls, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 w-full max-w-[240px] group flex flex-col"
                                >
                                    {/* Card Image Header */}
                                    <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                                        {cls.image ? (
                                            <img
                                                src={cls.image}
                                                alt={cls.subject}
                                                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className={`w-full h-full ${cls.color} flex items-center justify-center`}>
                                                <span className="text-white font-black text-2xl opacity-20">{cls.subject.substring(0, 3)}</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                                                <TrendingUp className="w-3 h-3 text-blue-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-3 flex flex-col gap-2 flex-1">
                                        {/* Tags */}
                                        <div className="flex gap-1.5">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-bold uppercase tracking-wide border border-blue-100">
                                                Grade 10
                                            </span>
                                            <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full text-[9px] font-bold uppercase tracking-wide border border-slate-100">
                                                Revision
                                            </span>
                                        </div>

                                        {/* Title & Price */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 leading-tight">{cls.subject}</h3>
                                                <p className="text-[10px] font-bold text-slate-500 mt-0.5">{cls.date}</p>
                                            </div>
                                            <span className="text-emerald-500 font-black text-base">FREE</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                                            Live on <span className="text-slate-900 font-bold">{cls.time}</span>. Covers key concepts.
                                        </p>

                                        {/* Timer Section */}
                                        <div className="mt-auto pt-2 border-t border-slate-100">
                                            <p className="text-[8px] uppercase font-black text-slate-400 mb-1.5 tracking-wider text-center">Class Starts In</p>
                                            <CourseTimer targetDate={cls.startDate} />
                                        </div>

                                        <button
                                            onClick={() => handleClassSelect('Grade 10')}
                                            className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold uppercase text-[9px] tracking-wider hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            Register Now
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Grade 12 Section */}
                    <div>
                        <div className="relative flex items-center justify-center py-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative z-10 bg-white px-6">
                                <span className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full border border-orange-100 bg-orange-50 text-orange-700 font-black tracking-widest uppercase shadow-sm text-lg">
                                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
                                    Grade 12
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {grade12Classes.map((cls, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 w-full max-w-[240px] group flex flex-col"
                                >
                                    {/* Card Image Header */}
                                    <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                                        {cls.image ? (
                                            <img
                                                src={cls.image}
                                                alt={cls.subject}
                                                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className={`w-full h-full ${cls.color} flex items-center justify-center`}>
                                                <span className="text-white font-black text-2xl opacity-20">{cls.subject.substring(0, 3)}</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                                                <TrendingUp className="w-3 h-3 text-orange-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-3 flex flex-col gap-2 flex-1">
                                        {/* Tags */}
                                        <div className="flex gap-1.5">
                                            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full text-[9px] font-bold uppercase tracking-wide border border-orange-100">
                                                Grade 12
                                            </span>
                                            <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full text-[9px] font-bold uppercase tracking-wide border border-slate-100">
                                                One-Shot
                                            </span>
                                        </div>

                                        {/* Title & Price */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 leading-tight">{cls.subject}</h3>
                                                <p className="text-[10px] font-bold text-slate-500 mt-0.5">{cls.date}</p>
                                            </div>
                                            <span className="text-emerald-500 font-black text-base">FREE</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                                            Live on <span className="text-slate-900 font-bold">{cls.time}</span>. Master the subject.
                                        </p>

                                        {/* Timer Section */}
                                        <div className="mt-auto pt-2 border-t border-slate-100">
                                            <p className="text-[8px] uppercase font-black text-slate-400 mb-1.5 tracking-wider text-center">Class Starts In</p>
                                            <CourseTimer targetDate={cls.startDate} />
                                        </div>

                                        <button
                                            onClick={() => handleClassSelect('Grade 12')}
                                            className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold uppercase text-[9px] tracking-wider hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            Register Now
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* What You'll Revise */}
            {/* What You'll Revise */}
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
                                className="p-6 bg-orange-50/50 rounded-xl border border-orange-100 hover:bg-orange-50 hover:border-orange-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] transition-all duration-300 text-center hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <p className="font-bold text-slate-800">{item.text}</p>
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
            <section className="py-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
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
