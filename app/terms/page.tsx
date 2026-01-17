'use client'

import React from 'react'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import { motion } from 'framer-motion'
import { FileText, RefreshCw, UserCheck, Gavel, ArrowLeft, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function TermsAndServices() {
    const policies = [
        {
            id: "terms",
            title: "1. Terms & Conditions",
            icon: <FileText className="w-6 h-6" />,
            content: "Welcome to EduAiTutors.com. By accessing or using our website, mobile application, or services, you agree to comply with and be bound by these Terms & Conditions.",
            subsections: [
                {
                    head: "1.1 Services",
                    content: "EduAiTutors provides:\n• Online tutoring for Grade 1 to Grade 12 students\n• Competitive examination preparation (JEE, NEET, CET, and others)\n• Live classes, recorded lectures, assessments, and learning management services"
                },
                {
                    head: "1.2 User Accounts",
                    content: "• Accounts must be created using accurate and complete information\n• For students under 18 years, accounts must be created by parents or legal guardians\n• Users are responsible for maintaining account confidentiality"
                },
                {
                    head: "1.3 Acceptable Use",
                    content: "Users agree not to:\n• Share login credentials\n• Misuse content or platform features\n• Upload harmful, offensive, or illegal content\n• Attempt to disrupt platform security or operations"
                },
                {
                    head: "1.4 Intellectual Property",
                    content: "All content including videos, course material, assessments, logos, and software is the intellectual property of EduAiTutors or its licensors. Users may not copy, distribute, or resell content without written permission."
                }
            ]
        },
        {
            id: "refund",
            title: "2. Refund & Cancellation Policy",
            icon: <RefreshCw className="w-6 h-6" />,
            subsections: [
                {
                    head: "2.1 Subscription Cancellation",
                    content: "• Users may cancel subscriptions by contacting support before the course start date"
                },
                {
                    head: "2.2 Refund Eligibility",
                    content: "Refunds may be considered only if:\n• Technical issues prevent access to services\n• Course cancellation by EduAiTutors"
                },
                {
                    head: "2.4 Refund Processing",
                    content: "• Approved refunds will be processed within 7–14 working days\n• Refunds will be issued to the original payment method"
                }
            ]
        },
        {
            id: "consent",
            title: "3. Parental Consent Policy",
            icon: <UserCheck className="w-6 h-6" />,
            content: "EduAiTutors provides services to minors under 18 years of age. By registering a student account, the parent or legal guardian confirms:\n• They provide consent for data collection and processing\n• They authorize EduAiTutors to deliver online education services\n• They understand the nature of online learning and data usage"
        },
        {
            id: "compliance",
            title: "4. Data Protection & Compliance",
            icon: <Gavel className="w-6 h-6" />,
            content: "EduAiTutors is committed to complying with Indian IT Act 2000, DPDP Act 2023, and GDPR principles.\n• Lawful and transparent data processing\n• Purpose limitation and data minimization\n• Secure data storage using Amazon Web Services (AWS)\n• User rights for access, correction, and deletion"
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-primary-100 font-sans">
            <PublicHeader />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-white overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] -ml-40 -mb-40 opacity-40" />

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <Link href="/" className="inline-flex items-center text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors group mb-12">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-600/30 mx-auto mb-8">
                            <Gavel className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
                            Legal & <span className="text-primary-600">Policies.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            Everything you need to know about our terms, refunds, and commitments to your education.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Policies Grid */}
            <section className="py-24 bg-white relative">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-20">
                        {policies.map((policy, idx) => (
                            <motion.div
                                key={policy.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative bg-slate-50/50 rounded-[3rem] p-10 md:p-16 border border-slate-100 hover:border-primary-100 hover:bg-white hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-500 group"
                            >
                                <div className="absolute -top-8 -left-2 w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-300 group-hover:text-primary-600 shadow-xl border border-slate-50 group-hover:scale-110 transition-all duration-500">
                                    {policy.icon}
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                                    <div className="flex-1">
                                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight group-hover:text-primary-600 transition-colors">
                                            {policy.title}
                                        </h2>

                                        {policy.content && (
                                            <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
                                                {policy.content.split('\n').map((line, i) => (
                                                    <span key={i} className="block mb-4">
                                                        {line.startsWith('•') ? (
                                                            <span className="pl-6 relative block before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-primary-500 before:rounded-full">
                                                                {line.substring(1).trim()}
                                                            </span>
                                                        ) : line}
                                                    </span>
                                                ))}
                                            </p>
                                        )}

                                        <div className="space-y-12">
                                            {policy.subsections?.map((sub, i) => (
                                                <div key={i} className="relative pl-10">
                                                    <div className="absolute left-0 top-0 w-px h-full bg-slate-200 group-hover:bg-primary-200 transition-colors" />
                                                    <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-slate-300 group-hover:bg-primary-600 transition-colors" />

                                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-4 group-hover:text-primary-600 transition-colors">
                                                        {sub.head}
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {sub.content.split('\n').map((line, j) => (
                                                            <p key={j} className={`text-slate-600 leading-relaxed ${line.startsWith('•') ? 'pl-6 relative before:content-[""] before:absolute before:left-0 before:top-3 before:w-1.5 before:h-1.5 before:bg-primary-400 before:rounded-full' : 'text-base font-medium'}`}>
                                                                {line.startsWith('•') ? line.substring(1).trim() : line}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trust Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-32 p-12 bg-slate-900 rounded-[3.5rem] text-white overflow-hidden relative group"
                    >
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600 opacity-20 blur-[120px] -mr-32 -mt-32" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-primary-500 shrink-0">
                                <ShieldCheck className="w-12 h-12" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-3xl font-black mb-4">Compliance Matters.</h3>
                                <p className="text-slate-400 font-medium text-lg leading-relaxed">
                                    Our policies are designed to comply with India DPDP Act 2023 and global GDPR principles, ensuring your data is always safe using AWS global infrastructure.
                                </p>
                            </div>
                            <Link href="mailto:info@kiccpa.com" className="px-10 py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-primary-600/30 active:scale-95">
                                Reach Support
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
