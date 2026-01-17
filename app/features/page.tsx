'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import PackagesSection from '@/components/PackagesSection'
import {
    GraduationCap,
    Video,
    Bot,
    Medal,
    Target,
    Home,
    FileQuestion,
    RefreshCw,
    Sparkles,
    ChevronLeft
} from 'lucide-react'
import Link from 'next/link'

// Feature Data
const features = [
    {
        id: 'exam-prep',
        fullTitle: 'Exam Prep',
        description: 'Dedicated preparation for government, banking, SSC, and entrance examinations.',
        icon: <GraduationCap className="w-8 h-8" />,
        iconColor: 'text-slate-600'
    },
    {
        id: 'offline',
        fullTitle: 'Offline Learning',
        description: 'Download lectures and study materials to learn anywhere, anytime without internet.',
        icon: <Video className="w-8 h-8" />,
        iconColor: 'text-slate-700'
    },
    {
        id: 'ai-assess',
        fullTitle: 'AI Assessments',
        description: 'Instant, customized question sets based on your learning level and performance.',
        icon: <Bot className="w-8 h-8" />,
        iconColor: 'text-rose-500'
    },
    {
        id: 'rewards',
        fullTitle: 'Rewards',
        description: 'Earn badges for progress—stay motivated throughout your journey.',
        icon: <Medal className="w-8 h-8" />,
        iconColor: 'text-amber-500'
    },
    {
        id: 'learning-paths',
        fullTitle: 'Learning Paths',
        description: 'Content tailored to your package for measurable improvement and goal tracking.',
        icon: <Target className="w-8 h-8" />,
        iconColor: 'text-red-500'
    },
    {
        id: 'from-home',
        fullTitle: 'From Home',
        description: 'Experience classroom-quality education from the comfort and safety of your home.',
        icon: <Home className="w-8 h-8" />,
        iconColor: 'text-orange-500'
    },
    {
        id: 'doubt-clearing',
        fullTitle: 'Doubt Clearing',
        description: 'Connect with expert tutors instantly to resolve your queries and doubts.',
        icon: <FileQuestion className="w-8 h-8" />,
        iconColor: 'text-blue-400'
    },
    {
        id: 'switch-package',
        fullTitle: 'Switch Package',
        description: 'Easily switch or upgrade your learning package as your academic needs evolve.',
        icon: <RefreshCw className="w-8 h-8" />,
        iconColor: 'text-blue-600'
    }
]

export default function FeaturesPage() {
    const [activeFeature, setActiveFeature] = useState<typeof features[0] | null>(null)

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 overflow-x-hidden">
            <PublicHeader />

            <section className="min-h-screen flex items-center justify-center pt-40 pb-24 relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-slate-200/30 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">

                    {/* Left Column: Text Content */}
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-1 bg-primary-600 rounded-full" />
                            <span className="text-slate-500 font-medium italic tracking-wide text-sm">Unlock Your Potential with Smart, AI-Driven Learning</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
                            EduAiTutors <span className="text-[#ea580c]">Features</span>
                        </h1>

                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                            <span className="font-bold text-slate-900">EduAiTutors Features</span> are carefully designed by expert educators
                            and technology specialists to deliver an effective and engaging
                            learning experience. Built on modern educational standards, the
                            platform uses advanced AI and proven teaching methods to support
                            student success.
                        </p>

                        <p className="text-slate-600 text-lg leading-relaxed">
                            More than just a learning platform, <span className="font-bold text-slate-900">EduAiTutors</span> empowers students
                            with personalized guidance, smart assessments, and the confidence
                            to achieve a brighter academic future.
                        </p>
                    </div>

                    {/* Right Column: Interactive Diagram */}
                    <div className="relative h-[600px] w-full max-w-[600px] flex items-center justify-center mt-8">

                        {/* Soft glow behind center circle */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#0B7AB8]/15 rounded-full blur-[100px] z-0" />

                        {/* Center Circle Content */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[260px] h-[260px] rounded-full bg-gradient-to-br from-[#0B7AB8] to-[#0A6BA0] shadow-[0_30px_80px_rgba(11,122,184,0.4)] flex flex-col items-center justify-center text-center p-8 transition-all duration-300">
                            <AnimatePresence mode="wait">
                                {activeFeature ? (
                                    <motion.div
                                        key={activeFeature.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-white flex flex-col items-center"
                                    >
                                        <div className="mb-3 p-3 bg-white/15 rounded-2xl backdrop-blur-sm">
                                            {React.cloneElement(activeFeature.icon as React.ReactElement, { className: "w-8 h-8 text-white" })}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 leading-tight">{activeFeature.fullTitle}</h3>
                                        <p className="text-white/90 text-xs leading-relaxed font-medium">
                                            {activeFeature.description}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="default"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-white"
                                    >
                                        <h3 className="text-4xl font-bold mb-2 leading-tight">Explore<br />Features</h3>
                                        <p className="text-white/80 text-sm font-medium">Hover to learn more</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Orbital Circles */}
                        <div className="absolute inset-0 z-10" onMouseLeave={() => setActiveFeature(null)}>
                            {features.map((feature, index) => {
                                const angle = (index * (360 / features.length)) - 90; // Start from top (-90deg)
                                const radius = 245; // Distance from center - increased to prevent overlap
                                const x = radius * Math.cos((angle * Math.PI) / 180);
                                const y = radius * Math.sin((angle * Math.PI) / 180);
                                const isActive = activeFeature?.id === feature.id;

                                return (
                                    <motion.div
                                        key={feature.id}
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                        style={{ x, y }}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
                                        whileHover={{ scale: 1.05 }}
                                        onMouseEnter={() => setActiveFeature(feature)}
                                    >
                                        <div
                                            className={`
                                                w-[120px] h-[120px] rounded-full bg-white flex flex-col items-center justify-center gap-2 p-4 text-center transition-all duration-300
                                                ${isActive
                                                    ? 'shadow-[0_25px_60px_rgba(11,122,184,0.4)] scale-105 z-30'
                                                    : 'shadow-[0_15px_40px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.16)]'
                                                }
                                            `}
                                        >
                                            <div className={`${isActive ? 'text-[#0B7AB8] scale-110' : feature.iconColor} transition-all duration-300`}>
                                                {feature.icon}
                                            </div>
                                            <span className={`text-[11px] font-bold leading-tight ${isActive ? 'text-[#0B7AB8]' : 'text-slate-700'} transition-colors duration-300`}>
                                                {feature.fullTitle}
                                            </span>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>



            <PublicFooter />
        </main >
    )
}
