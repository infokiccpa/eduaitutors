'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-white overflow-hidden relative">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative group"
                >
                    <Link href="/features">
                        <div className="bg-slate-50 rounded-[3.5rem] p-12 md:p-20 overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-700 border border-slate-100 group-hover:bg-white group-hover:border-primary-100">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-16">
                                <div className="max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                                        <Sparkles className="w-3 h-3" /> The EduAi Advantage
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-[#1e293b] mb-8 tracking-tighter leading-tight">
                                        Why Study With <br />
                                        <span className="text-primary-600 italic">EduAiTutors?</span>
                                    </h2>
                                    <p className="text-xl text-slate-500 font-medium mb-10 leading-relaxed">
                                        From high-tech AI assessments to world-class mentors, discover the precision-engineered features that power our student success stories.
                                    </p>
                                    <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-600 transition-all shadow-2xl hover:shadow-primary-600/40 flex items-center gap-4">
                                        Explore All Features <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="relative w-full max-w-sm hidden lg:block">
                                    <div className="grid grid-cols-2 gap-6 rotate-3 group-hover:rotate-6 transition-transform duration-700">
                                        {[
                                            { color: 'bg-fuchsia-500' },
                                            { color: 'bg-sky-500' },
                                            { color: 'bg-emerald-500' },
                                            { color: 'bg-amber-500' }
                                        ].map((item, idx) => (
                                            <div key={idx} className={`${item.color} h-32 rounded-3xl opacity-20 shadow-2xl shadow-black/10`} />
                                        ))}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center">
                                            <Sparkles className="w-12 h-12 text-primary-600 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
