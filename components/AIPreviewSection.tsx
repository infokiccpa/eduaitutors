'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User, Send, Sparkles, Brain, Zap, MessageSquare, ChevronRight, Calculator, Atom, FlaskConical } from 'lucide-react'

const SAMPLES = [
    {
        topic: 'Physics',
        icon: <Atom className="w-4 h-4" />,
        question: "How does gravity work?",
        answers: {
            'grade6': "Think of gravity like an invisible magnet that pulls everything toward the center of the Earth. It's what keeps your feet on the ground and makes an apple fall from a tree!",
            'grade12': "Gravity is a fundamental force of attraction between masses. According to General Relativity, it's actually the curvature of spacetime caused by mass and energy, governing the motion of planets and light itself."
        }
    },
    {
        topic: 'Mathematics',
        icon: <Calculator className="w-4 h-4" />,
        question: "What is Pi (π)?",
        answers: {
            'grade6': "Pi is a special number (about 3.14) that you get when you divide the distance around a circle by its width. It's the same for every circle in the world!",
            'grade12': "Pi is an irrational, transcendental constant representing the ratio of a circle's circumference to its diameter. It appears in countless formulas across trigonometry, calculus, and complex analysis."
        }
    },
    {
        topic: 'Chemistry',
        icon: <FlaskConical className="w-4 h-4" />,
        question: "What are atoms?",
        answers: {
            'grade6': "Atoms are like tiny LEGO bricks that build everything in the universe. Everything you see, touch, or smell is made of billions of these microscopic building blocks!",
            'grade12': "An atom is the smallest unit of matter that retains chemical properties, consisting of a dense nucleus of protons and neutrons surrounded by an electron cloud described by quantum probability wavefunctions."
        }
    }
]

export default function AIPreviewSection() {
    const [activeGrade, setActiveGrade] = useState<'grade6' | 'grade12'>('grade6')
    const [activeSample, setActiveSample] = useState(SAMPLES[0])
    const [displayText, setDisplayText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        let i = 0
        const fullText = activeSample.answers[activeGrade]
        setDisplayText('')
        setIsTyping(true)

        const interval = setInterval(() => {
            setDisplayText(fullText.slice(0, i))
            i++
            if (i > fullText.length) {
                clearInterval(interval)
                setIsTyping(false)
            }
        }, 20)

        return () => clearInterval(interval)
    }, [activeGrade, activeSample])

    return (
        <section className="py-32 bg-slate-950 relative overflow-hidden">
            {/* High-tech Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[150px] -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -ml-64 -mb-64" />

            {/* Circuit Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left Side: Content */}
                    <div className="space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/10 border border-primary-600/20 rounded-full text-primary-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                                <Sparkles className="w-3 h-3" />
                                Live AI Demonstration
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.05]">
                                One Tutor. <br />
                                <span className="text-primary-500 italic">One-Billion</span> <br />
                                Possibilities.
                            </h2>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg mb-12">
                                Our AI doesn't just give answers—it understands who you are. See how it adapts the same concept for different learning levels instantly.
                            </p>

                            {/* Sample Switcher */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Try a different topic</p>
                                <div className="flex flex-wrap gap-3">
                                    {SAMPLES.map((sample) => (
                                        <button
                                            key={sample.topic}
                                            onClick={() => setActiveSample(sample)}
                                            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 flex items-center gap-3 ${activeSample.topic === sample.topic
                                                    ? 'bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-600/20'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                                                }`}
                                        >
                                            {sample.icon}
                                            {sample.topic}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Interactive AI Interface */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Glowing Aura behind the interface */}
                        <div className="absolute inset-0 bg-primary-600/20 blur-[100px] rounded-full transform scale-75 opacity-50" />

                        <div className="bg-slate-900 rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden relative backdrop-blur-3xl">
                            {/* UI Header */}
                            <div className="bg-white/5 border-b border-white/10 p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-widest">EduAi Assistant</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Adaptive Mode Active</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Level Selector */}
                                <div className="bg-black/40 p-1.5 rounded-2xl flex gap-1 border border-white/5">
                                    <button
                                        onClick={() => setActiveGrade('grade6')}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeGrade === 'grade6' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                                            }`}
                                    >
                                        Grade 6
                                    </button>
                                    <button
                                        onClick={() => setActiveGrade('grade12')}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeGrade === 'grade12' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                                            }`}
                                    >
                                        Grade 12
                                    </button>
                                </div>
                            </div>

                            {/* Chat Canvas */}
                            <div className="p-8 h-[400px] flex flex-col gap-8 overflow-y-auto no-scrollbar">
                                {/* User Message */}
                                <div className="flex justify-end pr-4">
                                    <div className="max-w-[80%] bg-white/5 border border-white/10 p-5 rounded-3xl rounded-tr-lg">
                                        <p className="text-slate-200 font-medium leading-relaxed">
                                            {activeSample.question}
                                        </p>
                                        <div className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 justify-end">
                                            <User className="w-3 h-3" /> You • Just now
                                        </div>
                                    </div>
                                </div>

                                {/* AI Response */}
                                <div className="flex justify-start">
                                    <div className="max-w-[90%] space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary-500 border border-white/10">
                                                <Brain className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">Thinking for {activeGrade.replace('grade', 'Grade ')}...</span>
                                        </div>

                                        <div className="bg-primary-600/[0.07] border border-primary-600/20 p-6 rounded-3xl rounded-tl-lg relative overflow-hidden group">
                                            {/* Decorative corner glow */}
                                            <div className="absolute top-0 left-0 w-20 h-20 bg-primary-600 opacity-5 blur-2xl" />

                                            <p className="text-white text-lg font-medium leading-[1.6] relative z-10 min-h-[100px]">
                                                {displayText}
                                                {isTyping && <span className="inline-block w-1.5 h-5 bg-primary-500 ml-1 animate-pulse align-middle" />}
                                            </p>

                                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between opacity-50">
                                                <div className="flex gap-4">
                                                    < Zap className="w-4 h-4 text-slate-500" />
                                                    < MessageSquare className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Personalized logic verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Indicator of Interface */}
                            <div className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
                                <div className="flex-1 h-12 bg-black/40 rounded-2xl border border-white/5 flex items-center px-6">
                                    <span className="text-slate-600 text-xs font-medium">Type any question...</span>
                                </div>
                                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <Send className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 top-1/4 bg-white p-5 rounded-3xl shadow-2xl z-20 hidden md:block border border-slate-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Smart Adapt</p>
                                    <p className="text-sm font-black text-slate-900 tracking-tight">Level Matching: 100%</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
