'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, X, Globe, MapPin } from 'lucide-react'

const LiveClassStrip = () => {
    const [showCountrySelector, setShowCountrySelector] = useState(false)
    const searchParams = useSearchParams()

    React.useEffect(() => {
        if (searchParams.get('action') === 'register') {
            setShowCountrySelector(true)
            // Scroll to the strip if needed
            const element = document.getElementById('live-class-hero')
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }, [searchParams])

    return (
        <section id="live-class-hero" className="relative w-full pt-48 pb-24 overflow-hidden"
            style={{
                background: `
                    radial-gradient(circle at 100% 0%, rgba(255, 107, 53, 0.05) 0%, transparent 40%),
                    radial-gradient(circle at 0% 100%, rgba(15, 23, 42, 0.03) 0%, transparent 40%),
                    #f8fafe
                `
            }}
        >
            <div className="max-w-[1280px] mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
                    {/* Left Side: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="order-2 lg:order-1"
                    >
                        {/* Heading Section */}
                        <div className="space-y-6 mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100 mb-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                2026 Board Exam Batch
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[1000] text-slate-900 leading-[0.95] tracking-tighter">
                                CBSE Board <br />
                                Exam <span className="text-[#ff6b35]">Mastery</span>
                            </h1>

                            <div className="flex flex-wrap items-center gap-4">
                                <span className="px-5 py-2 bg-slate-900 text-white rounded-2xl text-sm md:text-lg font-black tracking-wider uppercase flex items-center gap-2 shadow-2xl shadow-slate-200">
                                    <span className="text-[#ff6b35]">FREE</span> Live Revision
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <p
                            className="text-lg md:text-xl leading-relaxed mb-12 max-w-[550px] font-medium text-slate-500"
                        >
                            Revise smarter with FREE live CBSE board exam classes designed to boost confidence and improve scores.
                        </p>

                        {/* CTA Button with Dropdown */}
                        <div className="relative inline-block">
                            <button
                                onClick={() => setShowCountrySelector(!showCountrySelector)}
                                className="inline-flex items-center gap-3 px-11 py-5 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform group"
                                style={{
                                    background: '#ff6b35',
                                    boxShadow: '0 10px 20px rgba(255, 107, 53, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#e85a2b'
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                    e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(255, 107, 53, 0.5)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#ff6b35'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 107, 53, 0.2)'
                                }}
                            >
                                Get Started Free
                                <motion.div
                                    animate={{ rotate: showCountrySelector ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowRight size={20} className={showCountrySelector ? "" : "group-hover:translate-x-1 transition-transform"} />
                                </motion.div>
                            </button>

                            {/* Minimal Dropdown Menu */}
                            <AnimatePresence>
                                {showCountrySelector && (
                                    <>
                                        {/* Invisible Click-away Backdrop */}
                                        <div
                                            className="fixed inset-0 z-[80]"
                                            onClick={() => setShowCountrySelector(false)}
                                        />

                                        <motion.div
                                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                            className="absolute left-full bottom-full w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 p-2 z-[90] overflow-hidden origin-bottom-left"
                                        >
                                            <div className="px-3 py-2 border-b border-slate-50 mb-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Your Region</p>
                                                    <Globe size={12} className="text-slate-300" />
                                                </div>
                                            </div>

                                            <div className="space-y-0.5">
                                                <Link
                                                    href="/live-classes/india"
                                                    className="flex items-center justify-between p-3.5 hover:bg-orange-50 rounded-xl transition-all group/item"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-orange-100/50 rounded-lg flex items-center justify-center">
                                                            <MapPin className="text-orange-600" size={16} />
                                                        </div>
                                                        <span className="font-bold text-slate-700">India</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-slate-300 group-hover/item:text-orange-500 group-hover/item:translate-x-0.5 transition-all" />
                                                </Link>

                                                <Link
                                                    href="/live-classes/gcc"
                                                    className="flex items-center justify-between p-3.5 hover:bg-orange-50 rounded-xl transition-all group/item"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-blue-100/50 rounded-lg flex items-center justify-center">
                                                            <Globe className="text-blue-600" size={16} />
                                                        </div>
                                                        <span className="font-bold text-slate-700">GCC</span>
                                                    </div>
                                                    <ArrowRight size={14} className="text-slate-300 group-hover/item:text-orange-500 group-hover/item:translate-x-0.5 transition-all" />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Right Side: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="order-1 lg:order-2 relative z-10"
                    >
                        <div className="relative group">
                            {/* Decorative Blur Background */}
                            <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-[3rem] -z-10 transition-all duration-500 group-hover:bg-primary-500/20" />

                            <div className="relative p-1.5 bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden border-4 border-white">
                                <Image
                                    src="/students-study.jpg"
                                    alt="EduAiTutors Students"
                                    width={600}
                                    height={600}
                                    className="w-full h-auto object-cover rounded-[2.5rem] transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

        </section>
    )
}

export default LiveClassStrip
