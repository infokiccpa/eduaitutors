'use client'

import { Bell, Calendar as CalendarIcon, Clock, ChevronRight, Award, Flame, Star, MessageSquare } from 'lucide-react'
import { useState } from 'react'

export default function RightPanel({ onChatOpen }: { onChatOpen?: () => void }) {
    const [activeTab, setActiveTab] = useState('events')
    const currentDate = new Date()
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const today = currentDate.getDate()

    const upcomingEvents = [
        { id: 1, title: 'Math Mid-term Quiz', time: '10:00 AM', date: 'Jan 15', type: 'exam' },
        { id: 2, title: 'Physics Live Class', time: '02:30 PM', date: 'Jan 16', type: 'class' },
        { id: 3, title: 'Project Submission', time: '11:59 PM', date: 'Jan 18', type: 'assignment' },
    ]

    const notifications = [
        { id: 1, text: 'New lecture added in Web Development', time: '2h ago' },
        { id: 2, text: 'You ranked up to Level 5!', time: '5h ago' },
        { id: 3, text: 'Quiz results are out for Physics', time: 'Yesterday' },
    ]

    return (
        <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group overflow-hidden relative">
                    <div className="absolute -right-2 -top-2 w-12 h-12 bg-orange-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50" />
                    <Flame className="w-5 h-5 text-orange-500 mb-2 relative z-10" />
                    <p className="text-2xl font-black text-gray-900 relative z-10">12</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider relative z-10">Day Streak</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group overflow-hidden relative">
                    <div className="absolute -right-2 -top-2 w-12 h-12 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50" />
                    <Award className="w-5 h-5 text-blue-500 mb-2 relative z-10" />
                    <p className="text-2xl font-black text-gray-900 relative z-10">450</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider relative z-10">XP Points</p>
                </div>
            </div>

            {/* Main Panel Content */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                {/* Tab Header */}
                <div className="flex border-b border-gray-50">
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'events' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/30' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Schedule
                    </button>
                    <button
                        onClick={() => setActiveTab('notifs')}
                        className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'notifs' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/30' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Notifications
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'events' ? (
                        <div className="space-y-6">
                            {/* Mini Calendar View */}
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-black text-gray-900">{currentDate.toLocaleString('default', { month: 'long' })}</h4>
                                    <div className="flex gap-1">
                                        <button className="p-1 hover:bg-white rounded-lg transition"><ChevronRight className="w-4 h-4 text-gray-400 rotate-180" /></button>
                                        <button className="p-1 hover:bg-white rounded-lg transition"><ChevronRight className="w-4 h-4 text-gray-400" /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                    {days.map((d, i) => (
                                        <span key={i} className="text-[10px] font-bold text-gray-400 uppercase">{d}</span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                        <div key={`empty-${i}`} className="h-6"></div>
                                    ))}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1
                                        const isToday = day === today
                                        const hasEvent = [15, 16, 18, 22].includes(day)
                                        return (
                                            <div key={day} className="relative group">
                                                <div className={`h-7 w-7 flex items-center justify-center text-[11px] font-bold rounded-lg transition-all cursor-pointer ${isToday ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}>
                                                    {day}
                                                </div>
                                                {hasEvent && !isToday && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-400 rounded-full" />}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Upcoming List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-black text-gray-900">Upcoming Today</h4>
                                    <span className="text-[10px] font-bold text-primary-600 px-2 py-0.5 bg-primary-50 rounded-full">3 Events</span>
                                </div>
                                <div className="space-y-3">
                                    {upcomingEvents.map((event) => (
                                        <div key={event.id} className="flex items-center gap-4 group cursor-pointer">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${event.type === 'exam' ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' :
                                                event.type === 'class' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                                                    'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
                                                }`}>
                                                {event.type === 'exam' ? <Star className="w-4 h-4" /> : <CalendarIcon className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{event.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{event.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-primary-600 transition-all flex items-center justify-center gap-2 group">
                                View Full Calendar
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition cursor-pointer border border-transparent hover:border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 leading-tight">{notif.text}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{notif.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-3 border-2 border-gray-100 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-50 transition">
                                Clear All Notifications
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-primary-600 rounded-3xl p-6 text-white relative overflow-hidden group shadow-lg shadow-indigo-600/20">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Need Help?</p>
                <h4 className="text-xl font-black mb-4">Chat with your AI Tutor</h4>
                <button
                    onClick={onChatOpen}
                    className="w-full py-3 bg-white text-indigo-600 rounded-2xl text-xs font-black hover:bg-gray-100 transition shadow-xl flex items-center justify-center gap-2"
                >
                    <MessageSquare className="w-4 h-4" />
                    Start Conversation
                </button>
            </div>
        </div>
    )
}
