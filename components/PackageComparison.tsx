'use client'

import React from 'react'
import { Check, Minus, Sparkles, ShieldCheck, Zap, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PackageComparison() {
    const tiers = [
        { name: 'Foundation', icon: <Zap className="w-5 h-5" />, color: 'bg-blue-500' },
        { name: 'Mastery', icon: <Sparkles className="w-5 h-5" />, color: 'bg-primary-600' },
        { name: 'Excellence', icon: <ShieldCheck className="w-5 h-5" />, color: 'bg-indigo-600' },
    ]

    const features = [
        { name: 'AI-Powered Adaptive Lessons', f: true, m: true, e: true },
        { name: 'Daily Interactive Quizzes', f: true, m: true, e: true },
        { name: 'Comprehensive PDF Notes', f: true, m: true, e: true },
        { name: 'Weekly Live Group Sessions', f: false, m: true, e: true },
        { name: 'Personalized Performance Reports', f: false, m: true, e: true },
        { name: 'All India Rank Prediction', f: false, m: false, e: true },
        { name: '1-on-1 Expert Mentorship', f: false, m: false, e: true },
        { name: 'Priority Doubt Resolution', f: false, m: false, e: true },
    ]

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Compare our <span className="text-primary-600">Learning Paths</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg">
                        Choose the level of support that fits your academic goals perfectly.
                    </p>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="p-8 md:p-12 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Course Features</th>
                                    {tiers.map((tier) => (
                                        <th key={tier.name} className="p-8 md:p-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className={`w-12 h-12 rounded-2xl ${tier.color} text-white flex items-center justify-center shadow-lg transform rotate-3`}>
                                                    {tier.icon}
                                                </div>
                                                <span className="text-xl font-black text-slate-900">{tier.name}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((feature, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="p-8 md:p-10 border-b border-slate-50">
                                            <span className="text-slate-700 font-bold group-hover:text-slate-900 transition-colors">{feature.name}</span>
                                        </td>
                                        {[feature.f, feature.m, feature.e].map((included, i) => (
                                            <td key={i} className="p-8 md:p-10 text-center border-b border-slate-50">
                                                <div className="flex justify-center">
                                                    {included ? (
                                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                            <Check className="w-5 h-5" strokeWidth={3} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                            <Minus className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-12 bg-[#0a0f1c] flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-orange-600/20 flex items-center justify-center border border-orange-500/30">
                                <ShieldCheck className="w-7 h-7 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-white font-black uppercase tracking-[0.2em] text-[11px]">Secure Enrollment</p>
                                <p className="text-slate-500 text-sm font-medium">Join over 10,000+ students today</p>
                            </div>
                        </div>
                        <Link
                            href="/login?mode=signup&trial=true"
                            className="px-12 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.1em] text-xs hover:bg-slate-100 transition-all shadow-xl active:scale-95 text-center min-w-[240px]"
                        >
                            Start Free Trial Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
