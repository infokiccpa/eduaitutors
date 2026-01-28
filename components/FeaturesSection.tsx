'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    Repeat,
    GraduationCap,
    WifiOff,
    Bot,
    Trophy,
    Map,
    Home,
    HelpCircle
} from 'lucide-react'

// Feature Data
const features = [
    {
        id: 1,
        title: "Switch Packs",
        icon: <Repeat className="w-6 h-6" />,
        description: "Flexible learning options allow you to switch your package as your needs change."
    },
    {
        id: 2,
        title: "Exam Prep",
        icon: <GraduationCap className="w-6 h-6" />,
        description: "Comprehensive preparation materials for competitive exams and board finals."
    },
    {
        id: 3,
        title: "Offline Learning",
        icon: <WifiOff className="w-6 h-6" />,
        description: "Download lessons and study without an active internet connection."
    },
    {
        id: 4,
        title: "AI Assessments",
        icon: <Bot className="w-6 h-6" />,
        description: "Smart assessments that adapt to your learning pace and identify weak areas."
    },
    {
        id: 5,
        title: "Rewards",
        icon: <Trophy className="w-6 h-6" />,
        description: "Earn points and badges for your progress and consistent study habits."
    },
    {
        id: 6,
        title: "Learning Paths",
        icon: <Map className="w-6 h-6" />,
        description: "Personalized curated paths to guide you from basics to advanced topics."
    },
    {
        id: 7,
        title: "From Home",
        icon: <Home className="w-6 h-6" />,
        description: "Access world-class education from the comfort and safety of your home."
    },
    {
        id: 8,
        title: "Doubt Clearing",
        icon: <HelpCircle className="w-6 h-6" />,
        description: "Instant doubt resolution with expert tutors and AI support."
    }
]

export default function FeaturesSection() {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-1 w-12 bg-blue-600 rounded-full" />
                            <span className="text-slate-500 italic font-medium text-lg">
                                Unlock Your Potential with
                            </span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
                            <span className="text-[#1e3a8a]">EduAiTutors</span> <span className="text-orange-500">Features</span>
                        </h2>

                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            EduAiTutors Features are carefully designed by expert educators and technology specialists to deliver an effective and
                            engaging learning experience. Built on modern educational standards, the platform uses advanced AI and proven teaching methods to support student success.
                        </p>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300"
                        >
                            {/* Hover Gradient Border */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl origin-left" />

                            <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                                <div className="text-slate-600 group-hover:text-white transition-colors duration-300">
                                    {feature.icon}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                                {feature.title}
                            </h3>

                            <p className="text-slate-500 text-sm leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Decorative element */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-12 h-12 bg-blue-50 rounded-full blur-xl pointer-events-none" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
