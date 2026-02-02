'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

const LiveClassStrip = () => {
    return (
        <Link
            href="/live-classes/cbse-10"
            className="group relative w-full h-auto min-h-[500px] md:min-h-[650px] overflow-hidden flex items-start pt-40 md:pt-56 pb-20 cursor-pointer"
        >
            {/* Background Image with Dark Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('/live-class-hero.png')" }}
            >
                <div className="absolute inset-0 bg-black/50 z-10 transition-colors group-hover:bg-black/40" />
            </div>

            <div className="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20 relative z-20 w-full h-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
                {/* Left Side: Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl flex-1"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold shadow-lg shadow-orange-500/30 animate-pulse mb-8 border border-white/20 backdrop-blur-md">
                        <Sparkles className="w-5 h-5" />
                        <span className="tracking-wide">🔥 <span className="font-black text-white">FREE LIVE CLASSES</span></span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tight drop-shadow-2xl">
                        CBSE & State Board <br />
                        Classes — <span className="text-orange-500">LIVE Learning</span>
                    </h2>

                    {/* Highlight Line */}
                    <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-8">
                        <p className="text-xl md:text-3xl font-black text-orange-400">
                            FREE LIVE Classes
                        </p>
                    </div>

                    {/* Subtext */}
                    <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl leading-relaxed">
                        Expert-led <span className="font-bold text-orange-400 bg-white/10 px-2 py-0.5 rounded">FREE live classes</span> covering multiple grades, designed to boost understanding, confidence, and exam performance.
                    </p>
                </motion.div>

                {/* Right Side: Prominent Button Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end"
                >
                    <div
                        className="relative flex flex-col items-center justify-center gap-2 px-10 py-6 bg-white text-orange-600 rounded-3xl font-black text-xl uppercase tracking-widest transition-all shadow-2xl shadow-black/20 group-hover:shadow-orange-500/30 group-hover:-translate-y-2 group-hover:scale-105"
                    >
                        <span className="flex items-center gap-3">
                            JOIN FREE CLASS
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </span>
                        <span className="text-xs font-bold text-slate-500 tracking-normal normal-case">
                            ✨ Limited Seats Available
                        </span>
                    </div>
                </motion.div>
            </div>
        </Link>
    )
}

export default LiveClassStrip
