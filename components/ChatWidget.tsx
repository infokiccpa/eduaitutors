'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Send, Bot, Minimize2, Loader2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'

interface Message {
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { data: session } = useSession()
    const user = session?.user as any

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = session
                ? {
                    text: `Hi ${user?.name}! 👋 I'm EduBot, your AI assistant. How can I help you today?`,
                    sender: 'bot' as const,
                    timestamp: new Date()
                }
                : {
                    text: `Welcome to EduAI Tutors! 👋\n\nI'm EduBot, your AI assistant. I can help you:\n\n📚 Explore our courses\n💰 Check pricing\n🎓 Find the right package\n🎁 Start a FREE trial\n\nWhat would you like to know?`,
                    sender: 'bot' as const,
                    timestamp: new Date()
                }
            setMessages([greeting])
        }
    }, [isOpen, session])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            text: input,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    conversationHistory: messages.map(m => ({ text: m.text, sender: m.sender }))
                })
            })

            if (res.ok) {
                const data = await res.json()
                const botMessage: Message = {
                    text: data.text,
                    sender: 'bot',
                    timestamp: new Date(data.timestamp)
                }
                setMessages(prev => [...prev, botMessage])
            } else {
                throw new Error('Failed to get response')
            }
        } catch (error) {
            const errorMessage: Message = {
                text: "I'm having trouble connecting right now. Please try again!",
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // Quick action buttons for guests
    const QuickActions = () => {
        if (session) return null

        const actions = [
            { label: '📚 View Courses', query: 'What courses do you offer?' },
            { label: '💰 Pricing', query: 'How much does it cost?' },
            { label: '🎁 Free Trial', query: 'Tell me about the free trial' }
        ]

        return (
            <div className="flex flex-wrap gap-2 p-3 border-t border-slate-100">
                {actions.map((action, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setInput(action.query)
                            setTimeout(() => handleSend(), 100)
                        }}
                        className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-100 transition"
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        )
    }

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full shadow-2xl shadow-primary-600/40 flex items-center justify-center text-white hover:scale-110 transition-transform group"
                    >
                        <div className="relative">
                            <Bot className="w-8 h-8" />
                            <motion.div
                                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Chat with EduBot 💬
                            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-primary-600" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm">EduBot</h3>
                                    <p className="text-primary-100 text-[10px] font-bold">AI Learning Assistant</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition"
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        setMessages([])
                                        setIsOpen(false)
                                    }}
                                    className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'bot' && (
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2 flex-shrink-0">
                                            <Bot className="w-4 h-4 text-primary-600" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.sender === 'user'
                                                ? 'bg-primary-600 text-white rounded-br-none'
                                                : 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100'
                                            }`}
                                    >
                                        <p className="text-sm font-medium whitespace-pre-wrap">{msg.text}</p>
                                        <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-primary-100' : 'text-slate-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                                        <Bot className="w-4 h-4 text-primary-600" />
                                    </div>
                                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
                                            <span className="text-sm text-slate-600 font-medium">Thinking...</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions (for guests) */}
                        {!session && messages.length <= 2 && <QuickActions />}

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-600/20 font-medium text-sm transition disabled:opacity-50"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 text-center font-medium">
                                Powered by AI • {session ? 'Personalized for you' : 'Ask me anything!'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
