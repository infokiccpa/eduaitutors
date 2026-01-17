'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import QuizProgress from '@/components/QuizProgress'
import LearningProgress from '@/components/LearningProgress'
import RightPanel from '@/components/RightPanel'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Sparkles, ArrowRight, Calendar, Video, ChevronRight, Plus, Zap, Users, Activity, Server, DollarSign, LayoutGrid, Search, Filter, X, Bell, Megaphone, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import SupportChatBot from '@/components/SupportChatBot'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [schedules, setSchedules] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [notices, setNotices] = useState<any[]>([])
  const [loadingSchedule, setLoadingSchedule] = useState(true)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('/api/schedule')
        if (res.ok) {
          const data = await res.json()
          setSchedules(data)
        }
      } catch (error) {
        console.error('Error fetching schedules:', error)
      } finally {
        setLoadingSchedule(false)
      }
    }
    fetchSchedules()
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      // fetchStats() // Assuming fetchStats is defined elsewhere or not needed for this change
      fetchNotices()
    }
  }, [status])

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/admin/notices')
      if (res.ok) setNotices(await res.json())
    } catch (e) { console.error(e) }
  }

  const user = session?.user as any

  if (status === 'loading' || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      <div className="flex">
        <Sidebar aria-label="Main Navigation" />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left/Middle Column - Content */}
              <div className="flex-1 space-y-8">

                {/* Modern Welcome Section */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[3rem] blur-2xl opacity-5 group-hover:opacity-10 transition-opacity" />
                  <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 relative overflow-hidden transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-50" />

                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 mb-4"
                          >
                            <span className="w-8 h-px bg-primary-600 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-600">Student Overview</span>
                          </motion.div>
                          {/* Urgent Announcements */}
                          {notices.filter(n => n.priority === 'high').map((n, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                                  <Megaphone className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-red-600 uppercase tracking-widest">Urgent Announcement</p>
                                  <p className="text-sm font-bold text-slate-900">{n.title}: {n.content}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-black text-red-400 uppercase">Just Now</span>
                            </motion.div>
                          ))}

                          {/* Welcome Card */}
                          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tighter leading-tight">
                            Welcome Back, <br />
                            <span className="text-primary-600">{user.name?.split(' ')[0]}!</span> 🚀
                          </h1>
                          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                            Your academic journey is looking bright. You've completed 4 modules this week.
                          </p>
                        </div>

                        {!user.package ? (
                          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 max-w-sm">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                                <AlertCircle className="w-6 h-6" />
                              </div>
                              <h4 className="font-black text-amber-900 text-sm uppercase tracking-tight">Account Incomplete</h4>
                            </div>
                            <p className="text-amber-700/80 text-xs font-semibold leading-relaxed mb-6">
                              Unlock premium features, AI-tutors, and your full curriculum by choosing a learning package.
                            </p>
                            <Link
                              href="/dashboard/packages"
                              className="w-full py-3 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all"
                            >
                              Explore Packages <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        ) : (
                          <div className="bg-primary-600 rounded-3xl p-8 text-white shadow-2xl shadow-primary-600/20 relative overflow-hidden min-w-[300px]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <Crown className="w-8 h-8 opacity-40 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Active Plan</p>
                            <h4 className="text-2xl font-black mb-6 leading-tight">{user.package}</h4>
                            <Link
                              href="/dashboard/courses"
                              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-100 hover:text-white transition-colors"
                            >
                              Open Curriculum <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <QuizProgress />
                  <LearningProgress />
                </div>

                {/* Live Classes / Schedule Mini-Bento */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-primary-100 opacity-20">
                      <Video className="w-24 h-24" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      Live Classes
                    </h3>
                    <div className="space-y-4 relative z-10">
                      {loadingSchedule ? (
                        <div className="flex flex-col gap-4">
                          {[1, 2].map(i => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-2xl" />)}
                        </div>
                      ) : schedules.length > 0 ? (
                        schedules.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary-600">
                                <Video className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900">{item.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{item.instructor}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-primary-600 px-3 py-1 bg-primary-50 rounded-lg">
                              {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Live Classes Scheduled</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#050810] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-indigo-600/10 opacity-30 blur-2xl" />
                    <div className="relative z-10">
                      <Sparkles className="w-10 h-10 text-primary-400 mb-4" />
                      <h3 className="text-2xl font-black mb-2">AI Goal Planner</h3>
                      <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">
                        Your next academic milestone is just a few steps away. Tell our AI your goal and get a custom path.
                      </p>
                      <Link
                        href="/upskill"
                        className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-50 transition-all shadow-xl active:scale-95"
                      >
                        Design My Path <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Side Section - Analytics & Schedule */}
              <div className="w-full lg:w-96">
                <RightPanel onChatOpen={() => setIsChatOpen(true)} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <SupportChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

