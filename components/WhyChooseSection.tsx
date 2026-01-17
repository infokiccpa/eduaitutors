"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const features = [
    {
        title: 'AI-Powered Learning',
        description: 'Our advanced AI algorithms analyze your learning style, pace, and performance to create personalized study plans that adapt in real-time to your progress.',
        image: '/feature-ai-learning.jpg',
    },
    {
        title: 'One size never fits all',
        description: 'Our differentiated packages deliver the right level of support or challenge—helping students progress faster and smarter.',
        image: '/feature-diversity.jpg',
    },
    {
        title: 'Expert Tutors',
        description: 'Connect with highly qualified tutors across subjects. Live one-on-one sessions, instant doubt clearing, and personalized guidance to help you excel.',
        image: '/feature-expert-tutors.jpg',
    },
    {
        title: 'Smart Analytics',
        description: 'Track your progress with detailed insights. AI-driven performance analytics identify strengths, weaknesses, and provide actionable recommendations.',
        image: '/feature-analytics.jpg',
    },
    {
        title: 'Personalized Live Coach',
        description: 'Get dedicated guidance from top-tier tutors. Live, one-on-one sessions focused on your specific goals, doubts, and strategies for competitive success.',
        image: '/feature-expert-tutors.jpg',
    },
    {
        title: 'Customized Prep & Assessments',
        description: 'Master concepts with curated video lessons and study material tailored to your needs. Reinforce learning with targeted assessments and performance tracking.',
        image: '/feature-assessments.jpg',
    }
]

export default function WhyChooseSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden">
            {/* Enhanced Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-primary-50 rounded-full blur-[120px] opacity-60"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-secondary-50 rounded-full blur-[120px] opacity-60"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-orange-100 rounded-full blur-[100px] opacity-40"
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-5 h-5 text-[#ea580c]" />
                        </motion.div>
                        <span className="text-[#ea580c] font-black uppercase tracking-widest text-sm">Why Choose Us</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
                    >
                        Why Choose <span className="text-[#ea580c]">EduAiTutors?</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 font-medium leading-relaxed"
                    >
                        Powered by cutting-edge AI technology to deliver personalized, effective learning experiences
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="h-1 w-24 bg-gradient-to-r from-[#ea580c] to-orange-400 mx-auto mt-8 rounded-full"
                    />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: idx * 0.1,
                                duration: 0.8,
                                type: "spring",
                                stiffness: 100
                            }}
                            className="relative group"
                        >
                            {/* Floating animation */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: idx * 0.2
                                }}
                            >
                                {/* Colorful Glow Effect */}
                                <div className={`absolute -inset-4 bg-gradient-to-r ${idx === 0 ? 'from-blue-500 via-cyan-400 to-blue-600' :
                                    idx === 1 ? 'from-orange-500 via-amber-400 to-orange-600' :
                                        idx === 2 ? 'from-purple-500 via-fuchsia-400 to-purple-600' :
                                            idx === 3 ? 'from-indigo-500 via-blue-400 to-indigo-600' :
                                                idx === 4 ? 'from-pink-500 via-rose-400 to-pink-600' :
                                                    'from-emerald-500 via-teal-400 to-emerald-600'
                                    } rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-50 transition-all duration-700 -z-10 animate-pulse`} />

                                {/* Card Container */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] transition-all duration-500 border-2 border-slate-100/50 bg-primary-50"
                                >
                                    {/* Inner glow border */}
                                    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${idx === 0 ? 'from-blue-400/20 to-cyan-400/20' :
                                        idx === 1 ? 'from-orange-400/20 to-amber-400/20' :
                                            idx === 2 ? 'from-purple-400/20 to-fuchsia-400/20' :
                                                idx === 3 ? 'from-indigo-400/20 to-blue-400/20' :
                                                    idx === 4 ? 'from-pink-400/20 to-rose-400/20' :
                                                        'from-emerald-400/20 to-teal-400/20'
                                        }`} />

                                    <div className="relative overflow-hidden aspect-square">
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />

                                        {/* Multi-layered shine effects */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                        {/* Animated light beam */}
                                        <motion.div
                                            className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                            animate={{
                                                left: ['-100%', '200%']
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                repeatDelay: 2,
                                                ease: "easeInOut"
                                            }}
                                        />

                                        {/* Corner accents */}
                                        <div className="absolute top-0 left-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className={`absolute top-3 left-3 w-12 h-0.5 ${idx === 0 ? 'bg-blue-400' :
                                                idx === 1 ? 'bg-orange-400' :
                                                    idx === 2 ? 'bg-purple-400' :
                                                        idx === 3 ? 'bg-indigo-400' :
                                                            idx === 4 ? 'bg-pink-400' :
                                                                'bg-emerald-400'
                                                }`} />
                                            <div className={`absolute top-3 left-3 w-0.5 h-12 ${idx === 0 ? 'bg-blue-400' :
                                                idx === 1 ? 'bg-orange-400' :
                                                    idx === 2 ? 'bg-purple-400' :
                                                        idx === 3 ? 'bg-indigo-400' :
                                                            idx === 4 ? 'bg-pink-400' :
                                                                'bg-emerald-400'
                                                }`} />
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className={`absolute bottom-3 right-3 w-12 h-0.5 ${idx === 0 ? 'bg-cyan-400' :
                                                idx === 1 ? 'bg-amber-400' :
                                                    idx === 2 ? 'bg-fuchsia-400' :
                                                        idx === 3 ? 'bg-blue-400' :
                                                            idx === 4 ? 'bg-rose-400' :
                                                                'bg-teal-400'
                                                }`} />
                                            <div className={`absolute bottom-3 right-3 w-0.5 h-12 ${idx === 0 ? 'bg-cyan-400' :
                                                idx === 1 ? 'bg-amber-400' :
                                                    idx === 2 ? 'bg-fuchsia-400' :
                                                        idx === 3 ? 'bg-blue-400' :
                                                            idx === 4 ? 'bg-rose-400' :
                                                                'bg-teal-400'
                                                }`} />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
