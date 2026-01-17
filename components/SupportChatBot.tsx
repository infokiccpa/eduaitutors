'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, User, Bot, Mail, ArrowRight, Sparkles } from 'lucide-react'

type Message = {
    id: string
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
}

type Props = {
    isOpen: boolean
    onClose: () => void
}

const INITIAL_QUESTIONS = [
    "What are the pricing plans?",
    "Do you offer a free trial?",
    "How do I join a live class?",
    "Connect with Support"
]

const BOT_RESPONSES: Record<string, string> = {
    "What are the pricing plans?": "We have three main tiers: Foundation (₹4,999), Mastery (₹7,499), and Excellence (₹9,999). You can view full details in our Packages section!",
    "Do you offer a free trial?": "Yes! We offer a 7-day free trial for all our standard packages so you can experience our AI-powered learning first-hand.",
    "How do I join a live class?": "Once you subscribe, your dashboard will show upcoming sessions. Just click 'Join' at the scheduled time to enter the virtual classroom.",
    "Connect with Support": "I'll be happy to help! If I can't answer your specific question, you can email our support team directly at support@eduaitutors.com or click 'Contact Team' below."
}

export default function SupportChatBot({ isOpen, onClose }: Props) {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setIsTyping(true)
            setTimeout(() => {
                setMessages([
                    {
                        id: '1',
                        text: "Hi there! 👋 I'm your EduAi Assistant. How can I help you today?",
                        sender: 'bot',
                        timestamp: new Date()
                    }
                ])
                setIsTyping(false)
            }, 1000)
        }
    }, [isOpen])

    useEffect(scrollToBottom, [messages, isTyping])

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInputText('')
        setIsTyping(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            })

            const data = await res.json()

            if (res.ok) {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: data.text,
                    sender: 'bot',
                    timestamp: new Date(data.timestamp)
                }
                setMessages(prev => [...prev, botMsg])
            } else {
                throw new Error(data.message || 'Failed to get response')
            }
        } catch (error) {
            console.error('Chat Error:', error)
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm having a bit of trouble connecting to my brain! Please try again in a moment.",
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMsg])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-end p-4 md:p-8 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="w-full max-w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden pointer-events-auto border border-slate-100"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 p-6 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-2xl -mr-16 -mt-16" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm uppercase tracking-widest">EduAi Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online Now</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                            {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-primary-600 text-white rounded-tr-none shadow-md shadow-primary-600/10'
                                            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                                            }`}>
                                            {msg.text}
                                            {msg.text.includes("support@eduaitutors.com") && (
                                                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                                                    <a href="mailto:support@eduaitutors.com" className="flex items-center gap-2 text-primary-600 font-bold hover:underline">
                                                        <Mail className="w-4 h-4" />
                                                        Contact Support Team
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75" />
                                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions & Input */}
                        <div className="p-6 bg-white border-t border-slate-100">
                            {messages.length < 4 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {INITIAL_QUESTIONS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => handleSendMessage(q)}
                                            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-primary-50 hover:border-primary-100 hover:text-primary-600 transition-all"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                                    placeholder="Type your message..."
                                    className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all"
                                />
                                <button
                                    onClick={() => handleSendMessage(inputText)}
                                    disabled={!inputText.trim()}
                                    className="absolute right-2 top-2 w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
