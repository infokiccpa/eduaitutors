'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
    const phoneNumber = '919876543210' // Replace with actual business number
    const message = 'Hi EduAi Tutors! I would like to know more about your courses.'
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-16 h-16 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer group"
        >
            <MessageCircle className="w-8 h-8 fill-current" />

            {/* Tooltip */}
            <div className="absolute right-full mr-4 px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100 pointer-events-none">
                Chat on WhatsApp 💬
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white" />
            </div>

            {/* Pulsing effect */}
            <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10" />
        </motion.a>
    )
}
