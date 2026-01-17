'use client'

import React from 'react'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicy() {
    const sections = [
        {
            id: "scope",
            title: "1. Scope of This Privacy Policy",
            content: "This Privacy Policy applies to:\n• Students and parents/guardians using EduAiTutors\n• Teachers, tutors, and academic partners\n• Visitors to our website and mobile applications\nBy accessing or using EduAiTutors, you agree to the collection and use of information in accordance with this Privacy Policy."
        },
        {
            id: "collection",
            title: "2. Information We Collect",
            subsections: [
                {
                    head: "2.1 Personal Information",
                    content: "We may collect the following personal information:\n• Student name\n• Parent or guardian name (for minors)\n• Email address\n• Mobile number\n• Date of birth\n• Grade, board, and academic details\n• Country, city, and time zone\n• Login credentials (username and encrypted password)"
                },
                {
                    head: "2.2 Educational & Learning Data",
                    content: "• Course enrollments (school or competitive exams)\n• Board details (CBSE, ICSE, IB, IGCSE, State Boards, etc.)\n• Test scores, assessments, assignments, and progress reports\n• Attendance records and class participation\n• Learning behavior and performance analytics"
                },
                {
                    head: "2.3 Payment & Transaction Information",
                    content: "• Payment status and transaction reference IDs\n• Subscription plans\nNote: EduAiTutors does not store sensitive payment information such as card numbers, UPI IDs, or bank account details. Payments are processed securely through authorized third-party payment gateways like PayU."
                },
                {
                    head: "2.4 Technical & Usage Information",
                    content: "• IP address\n• Device type, browser type, and operating system\n• Log files and access timestamps\n• Cookies and similar tracking technologies"
                }
            ]
        },
        {
            id: "usage",
            title: "3. How We Use the Information",
            content: "We use collected information for the following purposes:\n• To provide access to online classes, LMS, and learning content\n• To personalize learning experiences using AI-based tools\n• To monitor academic progress and performance\n• To communicate with students and parents regarding classes, updates, and support\n• To process payments and manage subscriptions\n• To improve platform performance, security, and user experience\n• To comply with legal and regulatory requirements"
        },
        {
            id: "children",
            title: "4. Children’s Privacy",
            content: "EduAiTutors provides educational services to children under the age of 18.\n• Student accounts are created with the consent of parents or legal guardians\n• Parents/guardians have the right to review, modify, or request deletion of their child’s personal data\n• Parents may withdraw consent at any time by contacting us\nWe do not knowingly collect personal data from children without parental consent."
        },
        {
            id: "security",
            title: "5. Data Storage & Security",
            content: "EduAiTutors stores and processes data using Amazon Web Services (AWS) cloud infrastructure.\nSecurity measures include:\n• Industry-standard encryption\n• Secure access controls\n• Regular system monitoring and updates\n• Restricted access to personal data\nWhile we take reasonable steps to protect your information, no method of data transmission or storage is completely secure."
        },
        {
            id: "sharing",
            title: "6. Data Sharing & Disclosure",
            content: "We may share information with:\n• Teachers, tutors, and academic mentors for delivering educational services\n• Payment gateway and financial service providers\n• Cloud infrastructure and technology partners (including AWS)\n• Email, SMS, and communication service providers\n• Government authorities or legal bodies when required by law\nEduAiTutors does not sell, rent, or trade personal data to third parties for marketing purposes."
        },
        {
            id: "transfers",
            title: "7. International Data Transfers",
            content: "EduAiTutors serves users in India and globally. Your information may be processed or stored in India or other countries where our service providers operate. We take reasonable steps to ensure that international data transfers comply with applicable data protection laws and privacy standards."
        },
        {
            id: "cookies",
            title: "8. Cookies & Tracking Technologies",
            content: "We use cookies and similar technologies to:\n• Maintain user sessions and authentication\n• Improve website functionality and performance\n• Analyze usage patterns\nUsers can manage or disable cookies through their browser settings. Some features may not function properly if cookies are disabled."
        },
        {
            id: "rights",
            title: "9. User Rights",
            content: "Users and parents/guardians have the right to:\n• Access personal data\n• Update or correct inaccurate information\n• Request deletion of personal data\n• Withdraw consent for data processing\nRequests can be made by contacting us using the details provided below."
        },
        {
            id: "retention",
            title: "10. Data Retention",
            content: "We retain personal data only for as long as necessary to:\n• Provide educational services\n• Comply with legal and regulatory obligations\n• Resolve disputes and enforce agreements\nWhen data is no longer required, it is securely deleted or anonymised."
        },
        {
            id: "thirdparty",
            title: "11. Third-Party Links",
            content: "Our platform may contain links to third-party websites. EduAiTutors is not responsible for the privacy practices or content of such websites. Users are encouraged to review the privacy policies of third-party sites."
        },
        {
            id: "changes",
            title: "12. Changes to This Privacy Policy",
            content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of EduAiTutors after changes constitutes acceptance of the updated policy."
        },
        {
            id: "contact",
            title: "13. Contact Information",
            content: "For any questions, concerns, or requests related to this Privacy Policy, please contact us:\nEmail: info@kiccpa.com\nWebsite: www.eduaitutors.com\nRegistered Address: Bangalore, India"
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-primary-100">
            <PublicHeader />

            {/* Hero Header */}
            <section className="relative pt-32 pb-20 bg-white overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60" />
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
                        <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary-600/30 mx-auto mb-10">
                            <Shield className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
                            Privacy <span className="text-primary-600">Policy.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            We are committed to protecting the privacy and personal data of our students and guardians.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-6">
                            <div className="px-6 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                                Effective: Jan 14, 2026
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-600 leading-relaxed mb-16 font-medium">
                            EduAiTutors ("EduAiTutors", "we", "our", "us") operates the website www.eduaitutors.com and provides online education and tutoring services for school students (Grade 1 to Grade 12) and competitive examination preparation for students in India and globally. We are committed to protecting the privacy and personal data of students, parents, guardians, teachers, and all users of our platform.
                        </p>

                        <div className="space-y-20">
                            {sections.map((section, idx) => (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group"
                                >
                                    <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight group-hover:text-primary-600 transition-colors flex items-center gap-4">
                                        {section.title}
                                    </h2>
                                    {section.content && (
                                        <div className="space-y-4">
                                            {section.content.split('\n').map((line, i) => (
                                                <p key={i} className={`text-slate-600 leading-relaxed ${line.startsWith('•') ? 'pl-6 relative before:content-[""] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-primary-500 before:rounded-full' : 'text-lg font-medium'}`}>
                                                    {line.startsWith('•') ? line.substring(1).trim() : line}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                    {section.subsections && (
                                        <div className="space-y-12 mt-8">
                                            {section.subsections.map((sub, i) => (
                                                <div key={i}>
                                                    <h3 className="text-xl font-bold text-slate-800 mb-4">{sub.head}</h3>
                                                    <div className="space-y-4">
                                                        {sub.content.split('\n').map((line, j) => (
                                                            <p key={j} className={`text-slate-600 leading-relaxed ${line.startsWith('•') ? 'pl-6 relative before:content-[""] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-primary-500 before:rounded-full' : 'text-lg font-medium'}`}>
                                                                {line.startsWith('•') ? line.substring(1).trim() : line}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Support Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 p-12 bg-slate-950 rounded-[3rem] text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 opacity-20 blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div>
                                <h3 className="text-3xl font-black mb-4">Have questions?</h3>
                                <p className="text-slate-400 font-medium">Our privacy team is here to help you understand how we protect your information.</p>
                            </div>
                            <a href="mailto:info@kiccpa.com" className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/30 active:scale-95 whitespace-nowrap">
                                Contact Support
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
