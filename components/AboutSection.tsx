'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Target, GraduationCap, Microscope, Award, Users } from 'lucide-react'

export default function AboutSection() {
    return (
        <section id="about" className="py-32 bg-white relative overflow-hidden">
            {/* Immersive Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-50 rounded-full blur-[150px] -mr-96 -mt-96 opacity-60" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[130px] -ml-64 -mb-64 opacity-60" />

            {/* Subtle Dot Pattern */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#e2e8f0 1.5px, transparent 1.5px)`, backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* Modern Header Section */}
                <div className="text-center mb-28">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/10 border border-primary-600/20 rounded-full text-primary-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            <GraduationCap className="w-3.5 h-3.5" />
                            Academic Excellence
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none text-slate-900">
                            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-orange-500">EduAiTutors</span>
                        </h2>
                        <div className="w-24 h-2 bg-gradient-to-r from-primary-600 to-orange-400 mx-auto rounded-full shadow-lg shadow-primary-600/20" />
                    </motion.div>
                </div>

                {/* Floating Decorative Elements */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-12 h-12 bg-primary-100 rounded-xl opacity-20 blur-sm -z-10"
                />
                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -30, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 right-10 w-16 h-16 bg-blue-100 rounded-full opacity-20 blur-sm -z-10"
                />

                {/* Two Pillars Grid */}
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">

                    {/* Pillar 1: School Students */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="group relative"
                    >
                        {/* Shadow Glow behind card */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 to-transparent blur-2xl rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <motion.div
                            whileHover={{ scale: 1.02, rotateY: 5, rotateX: -2 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="bg-primary-50/70 backdrop-blur-xl rounded-[4rem] p-10 md:p-14 border border-white/80 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex flex-col items-center text-center relative z-10 transition-all duration-700"
                        >
                            <div className="relative w-full aspect-[4/3] mb-14 rounded-[3.5rem] overflow-hidden bg-white shadow-inner group-hover:shadow-2xl transition-all duration-700">
                                <img
                                    src="/grade-1-12.jpeg"
                                    alt="School Students"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 15 }}
                                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(234,88,12,0.5)] rotate-3 transition-all duration-500 border-4 border-white/20 backdrop-blur-sm"
                                >
                                    <BookOpen className="w-11 h-11" />
                                </motion.div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-400 uppercase tracking-[0.2em]">
                                    EduAiTutors for
                                </h3>
                                <h4 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none group-hover:text-primary-600 transition-colors">
                                    Grade <span className="text-indigo-600">1-12</span>
                                </h4>
                                <p className="text-slate-500 font-bold text-xl max-w-sm mx-auto leading-relaxed pt-2">
                                    Personalized Learning for Academic Success
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-3 mt-12">
                                {['Adaptive Lessons', 'Interactive Quizzes', 'Exam Prep'].map((tag) => (
                                    <span key={tag} className="px-6 py-3 bg-white text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-primary-100 group-hover:text-primary-600 transition-all cursor-default">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* CTA Arrow */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileHover={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-primary-600 border border-slate-100 pointer-events-none group-hover:pointer-events-auto"
                            >
                                <Users className="w-5 h-5" />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Pillar 2: Competitive Exams */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring", delay: 0.1 }}
                        className="group relative"
                    >
                        {/* Shadow Glow behind card */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-transparent blur-2xl rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <motion.div
                            whileHover={{ scale: 1.02, rotateY: -5, rotateX: -2 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="bg-primary-50/70 backdrop-blur-xl rounded-[4rem] p-10 md:p-14 border border-white/80 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex flex-col items-center text-center relative z-10 transition-all duration-700"
                        >
                            <div className="relative w-full aspect-[4/3] mb-14 rounded-[3.5rem] overflow-hidden bg-white shadow-inner group-hover:shadow-2xl transition-all duration-700">
                                <img
                                    src="/compe-exams.jpeg"
                                    alt="Competitive Exams"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: -15 }}
                                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] -rotate-3 transition-all duration-500 border-4 border-white/20 backdrop-blur-sm"
                                >
                                    <Target className="w-11 h-11" />
                                </motion.div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-400 uppercase tracking-[0.2em]">
                                    EduAiTutors for
                                </h3>
                                <h4 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                                    JEE & <span className="text-primary-600">NEET</span>
                                </h4>
                                <p className="text-slate-500 font-bold text-xl max-w-sm mx-auto leading-relaxed pt-2">
                                    Focused Coaching for Entrance Success
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-3 mt-12">
                                {['Targeted Study Plans', 'Mock Tests', 'Expert Guidance'].map((tag) => (
                                    <span key={tag} className="px-6 py-3 bg-white text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all cursor-default">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* CTA Arrow */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileHover={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-indigo-600 border border-slate-100 pointer-events-none group-hover:pointer-events-auto"
                            >
                                <Microscope className="w-5 h-5" />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
