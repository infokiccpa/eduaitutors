'use client'

import React, { useState } from 'react'
import { X, Mail, Phone, User, BookOpen, GraduationCap, Send, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'

interface LeadCaptureFormProps {
    variant?: 'inline' | 'modal'
}

export default function LeadCaptureForm({ variant = 'inline' }: LeadCaptureFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        grade: '',
        courseInterest: '',
        source: 'Website'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success('🎉 Thank you! Our team will contact you shortly.')
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    grade: '',
                    courseInterest: '',
                    source: 'Website'
                })
                if (variant === 'modal') setIsOpen(false)
            } else {
                toast.error('Something went wrong. Please try again.')
            }
        } catch (error) {
            toast.error('Failed to submit. Check your connection.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const FormContent = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                    Full Name *
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-600/20 outline-none font-medium transition"
                    />
                </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                        Email *
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-600/20 outline-none font-medium transition"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                        Phone *
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-600/20 outline-none font-medium transition"
                        />
                    </div>
                </div>
            </div>

            {/* Grade & Interest */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                        Current Grade
                    </label>
                    <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                            <option value="">Select Grade</option>
                            <option value="5th">5th Grade</option>
                            <option value="6th">6th Grade</option>
                            <option value="7th">7th Grade</option>
                            <option value="8th">8th Grade</option>
                            <option value="9th">9th Grade</option>
                            <option value="10th">10th Grade</option>
                            <option value="11th">11th Grade</option>
                            <option value="12th">12th Grade</option>
                            <option value="Dropper">Dropper/Gap Year</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                        I'm Interested In
                    </label>
                    <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                            value={formData.courseInterest}
                            onChange={(e) => setFormData({ ...formData, courseInterest: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                            <option value="">Select Interest</option>
                            <option value="JEE Preparation">JEE Preparation</option>
                            <option value="NEET Preparation">NEET Preparation</option>
                            <option value="CBSE Board">CBSE Board</option>
                            <option value="ICSE Board">ICSE Board</option>
                            <option value="Foundation Course">Foundation Course</option>
                            <option value="Olympiad Prep">Olympiad Prep</option>
                            <option value="General Inquiry">General Inquiry</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-xl shadow-primary-600/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        Start Your Learning Journey
                    </>
                )}
            </button>

            <p className="text-xs text-center text-slate-500 font-medium">
                By submitting, you agree to receive updates about our programs.
            </p>
        </form>
    )

    if (variant === 'modal') {
        return (
            <>
                {/* Trigger Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-xl shadow-primary-600/30 flex items-center gap-2"
                >
                    <Sparkles className="w-5 h-5" />
                    Get Free Consultation
                </button>

                {/* Modal */}
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative w-full max-w-2xl bg-white rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden"
                            >
                                <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                            Start Your Success Story
                                        </h2>
                                        <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
                                            Fill the form below and our experts will reach out
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="p-6 md:p-8">
                                    <FormContent />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        )
    }

    // Inline variant
    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl md:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 bg-gradient-to-br from-primary-50 to-white border-b border-primary-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary-600">
                        Limited Seats Available
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                    Get Started Today!
                </h2>
                <p className="text-base md:text-lg font-medium text-slate-600">
                    Join thousands of students achieving their academic dreams with AI-powered learning.
                </p>
            </div>

            <div className="p-6 md:p-8">
                <FormContent />
            </div>
        </div>
    )
}
