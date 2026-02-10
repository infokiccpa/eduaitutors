'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { motion } from 'framer-motion';
import { Play, MessageCircle, FileText, CheckCircle2, AlertCircle, Users } from 'lucide-react';

const LiveClassroom = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Verify Token
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setAccessGranted(false);
                return;
            }

            try {
                const res = await fetch(`/api/verify-access?token=${token}`);
                const data = await res.json();

                if (data.valid) {
                    setAccessGranted(true);
                    setCurrentUser(data.user);
                } else {
                    setAccessGranted(false);
                }
            } catch (error) {
                console.error('Verification failed', error);
                setAccessGranted(false);
            }
        };

        verifyToken();
    }, [token]);

    const subject = currentUser?.subject || searchParams.get('subject') || 'General';
    const grade = currentUser?.grade || searchParams.get('grade') || 'Grade 10';
    const videoId = searchParams.get('videoId') || 'dQw4w9WgXcQ'; // Default mock ID

    if (accessGranted === null) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (accessGranted === false) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-slate-400 text-center max-w-md mb-6">
                    This live class is only accessible to registered users. Please register on our website to receive a valid access link.
                </p>
                <a href="/" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                    Go to Homepage
                </a>
            </div>
        );
    }

    const [chatOpen, setChatOpen] = useState(true);
    const [messages, setMessages] = useState([
        { user: 'System', text: 'Welcome to the live class! Please keep the chat respectful.', time: 'Now', isSystem: true },
        { user: 'Rahul', text: 'Good morning sir!', time: '10:00 AM' },
        { user: 'Priya', text: 'Is this the revision class?', time: '10:01 AM' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setMessages([...messages, { user: 'You', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setNewMessage('');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <PublicHeader />

            <div className="pt-24 pb-8 max-w-[1600px] mx-auto px-4 md:px-6 h-[calc(100vh-80px)] flex flex-col">
                {/* Header Info */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Live Now
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white">
                            {grade} {subject} - Final Revision
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                            <Users className="w-4 h-4" />
                            <span>1,245 Watching</span>
                        </div>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors">
                            Ask a Doubt
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                    {/* Video Player Section */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <div className="relative w-full h-[300px] md:h-full max-h-[70vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 group">
                            {/* Placeholder Video Player (Using Iframe for demo) */}
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0`}
                                title="Live Class Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full object-cover"
                            ></iframe>
                        </div>

                        {/* Class Resources / Notes Tab */}
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
                                <FileText className="w-5 h-5 text-orange-500" />
                                Class Resources
                            </h3>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex-shrink-0 flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-orange-500 transition-colors cursor-pointer w-64">
                                        <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-slate-400">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200">Chapter {i} Notes.pdf</p>
                                            <p className="text-xs text-slate-500">2.4 MB • PDF</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className={`lg:col-span-1 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 flex flex-col overflow-hidden ${chatOpen ? 'h-[500px] lg:h-auto' : 'h-12'}`}>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                            <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-orange-500" />
                                Live Chat
                            </h3>
                            <button onClick={() => setChatOpen(!chatOpen)} className="text-slate-400 hover:text-white lg:hidden">
                                {chatOpen ? 'Minimize' : 'Expand'}
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-baseline gap-2 mb-1 ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}>
                                        <span className={`text-xs font-bold ${msg.isSystem ? 'text-blue-400' : 'text-orange-400'}`}>{msg.user}</span>
                                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                                    </div>
                                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.isSystem
                                        ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20 w-full text-center'
                                        : msg.user === 'You'
                                            ? 'bg-orange-600 text-white rounded-tr-none'
                                            : 'bg-slate-700 text-slate-200 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700 bg-slate-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-slate-900 border border-slate-600 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!newMessage.trim()}
                                >
                                    <Play className="w-3 h-3 fill-current" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveClassroom;
