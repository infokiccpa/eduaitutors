'use client'

import React, { useState } from 'react'
import { Plus, Minus, HelpCircle, MessageCircle, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import SupportChatBot from './SupportChatBot'

const faqs = [
    {
        question: "Can I upgrade my package later?",
        answer: "Yes, you can upgrade your learning package at any time from your dashboard. Our AI will automatically adjust your learning path based on your new tier's features."
    },
    {
        question: "How do the live sessions work?",
        answer: "Live sessions are conducted through our integrated virtual classroom. Students can ask questions via voice or chat, participate in polls, and collaborate on digital whiteboards."
    },
    {
        question: "Is there a refund policy?",
        answer: "We offer a 7-day 'No Questions Asked' refund policy. If you're not satisfied with the platform, we'll refund your full subscription fee."
    },
    {
        question: "Do you provide physical study material?",
        answer: "Most of our material is digital for high-tech interactivity. However, 'Excellence Pro' subscribers receive curated monthly workbooks delivered to their home."
    },
    {
        question: "How is the performance tracked?",
        answer: "Our AI engine analyzes every quiz, response time, and engagement level to provide deep insights on your strengths and areas needing improvement."
    }
]

export default function PackageFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)
    const [isChatOpen, setIsChatOpen] = useState(false)

    const handleChatSupport = () => {
        setIsChatOpen(true)
    }

    const handleScheduleCall = () => {
        toast.success("Opening dialer... You can also reach us at +91 98765 43210", {
            position: "bottom-right",
            autoClose: 5000,
            icon: <Phone className="text-emerald-600" />
        })
        window.location.href = "tel:+919876543210"
    }

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col items-center text-center mb-20">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100 shadow-sm">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Curious about <span className="text-primary-600">Details?</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg">
                        Everything you need to know about our learning packages and subscriptions.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`border rounded-3xl transition-all duration-300 ${openIndex === idx ? 'border-primary-200 bg-primary-50/20 shadow-lg shadow-primary-600/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-8 text-left"
                            >
                                <span className={`text-lg font-black tracking-tight transition-colors ${openIndex === idx ? 'text-primary-600' : 'text-slate-900'}`}>
                                    {faq.question}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === idx ? 'bg-primary-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                    {openIndex === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-8 pb-8 pt-0">
                                            <p className="text-slate-600 leading-relaxed font-medium">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 p-12 md:p-16 bg-[#0f172a] rounded-[4rem] text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]"
                >
                    {/* Animated Background Highlights */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 opacity-10 blur-[80px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 opacity-10 blur-[80px] -ml-32 -mb-32" />

                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">
                            Still have questions?
                        </h3>
                        <p className="text-slate-400 font-medium text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                            Our education consultants are available 24/7 to help you choose the right path for your success.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleChatSupport}
                                className="w-full sm:w-auto px-10 py-5 bg-[#f97316] text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Live Chat Support
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleScheduleCall}
                                className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                            >
                                <Phone className="w-4 h-4" />
                                Schedule a Call
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
            <SupportChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </section>
    )
}
