'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  Trophy,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProgressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const user = session?.user as any

  if (status === 'loading') return null

  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/activities')
        if (res.ok) {
          const data = await res.json()
          setActivities(data)
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchActivities()
    }
  }, [status])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const stats = [
    { label: 'Overall Progress', value: '42%', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Average Score', value: activities.length > 0 ? '88%' : '0%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Study Hours', value: '124h', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Achievements', value: activities.filter(a => a.type === 'achievement').length.toString(), icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const subjectProgress = [
    { name: 'Physics', progress: 65, color: 'bg-blue-500', icon: '🔭' },
    { name: 'Chemistry', progress: 48, color: 'bg-emerald-500', icon: '🧪' },
    { name: 'Mathematics', progress: 82, color: 'bg-orange-500', icon: '📐' },
    { name: 'Biology', progress: 30, color: 'bg-purple-500', icon: '🧬' },
  ]

  const recentActivity = activities.length > 0 ? activities : [
    { title: 'Completed Quiz: Newton\'s Laws', subject: 'Physics', time: '2 hours ago', score: '95%', type: 'quiz' },
    { title: 'Watched Video: Atomic Structure', subject: 'Chemistry', time: '5 hours ago', type: 'lesson' },
    { title: 'Earned Badge: Weekend Warrior', subject: 'General', time: 'Yesterday', type: 'achievement' },
    { title: 'Started New Chapter: Algebra', subject: 'Mathematics', time: '2 days ago', type: 'lesson' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Learning Progress</h1>
                <p className="text-slate-500 font-medium text-lg">Detailed breakdown of your academic journey and performance.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> This Month
                </button>
                <button className="px-6 py-3 bg-secondary-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-lg shadow-slate-900/20">
                  Download Report
                </button>
              </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h3>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Performance by Subject */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900">Subject Performance</h2>
                    <Zap className="w-6 h-6 text-amber-500" />
                  </div>

                  <div className="space-y-8">
                    {subjectProgress.map((subject, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{subject.icon}</span>
                            <span className="font-bold text-slate-700">{subject.name}</span>
                          </div>
                          <span className="font-black text-slate-900">{subject.progress}%</span>
                        </div>
                        <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex items-center px-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                            className={`h-2 rounded-full ${subject.color} shadow-lg shadow-${subject.color.split('-')[1]}-500/20`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Chart Simulation */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 leading-tight">Weekly Learning Trend</h2>
                      <p className="text-slate-500 font-bold text-sm">Study intensity over the past 7 days</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                  </div>

                  <div className="h-64 flex items-end justify-between gap-4 px-4">
                    {[65, 45, 85, 30, 95, 70, 50].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`w-full rounded-t-2xl transition-all duration-300 group-hover:bg-primary-500 ${height > 80 ? 'bg-primary-600' : 'bg-slate-200'}`}
                        />
                        <span className="text-[10px] font-black text-slate-400 uppercase">Day {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Progress Info */}
              <div className="space-y-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                  <h2 className="text-xl font-black text-slate-900 mb-6">Recent Milestones</h2>
                  <div className="space-y-6">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex gap-4 relative">
                        {idx !== recentActivity.length - 1 && (
                          <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-100" />
                        )}
                        <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${activity.type === 'quiz' ? 'bg-emerald-50 text-emerald-600' :
                          activity.type === 'achievement' ? 'bg-amber-50 text-amber-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                          {activity.type === 'quiz' ? <CheckCircle2 className="w-6 h-6" /> :
                            activity.type === 'achievement' ? <Trophy className="w-6 h-6" /> :
                              <Calendar className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{activity.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{activity.subject}</span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-xs font-medium text-slate-400">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Goal Card */}
                <div className="bg-secondary-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <Target className="w-10 h-10 text-primary-500 mb-4" />
                    <h3 className="text-xl font-black mb-1">Weekly Goal</h3>
                    <p className="text-slate-400 font-bold text-sm mb-6">Complete 2 more Physics modules to hit your target!</p>

                    <div className="space-y-2 mb-8">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                        <span>Progress</span>
                        <span>80%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 w-[80%] rounded-full shadow-lg shadow-primary-500/20" />
                      </div>
                    </div>

                    <button className="w-full py-4 bg-white text-secondary-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition shadow-xl">
                      Continue Learning
                    </button>
                  </div>
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
