'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
    BookOpen,
    Clock,
    Calendar,
    CheckCircle2,
    Sparkles,
    Search,
    Filter,
    Trophy,
    ArrowRight,
    PlayCircle,
    Lock
} from 'lucide-react'



export default function DashboardCourses() {
    const { data: session, status } = useSession()
    const user = session?.user as any
    const [courses, setCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    useEffect(() => {
        const fetchCourses = async () => {
            if (user?.package) {
                try {
                    const res = await fetch(`/api/courses?package=${encodeURIComponent(user.package)}`)
                    const data = await res.json()
                    setCourses(data)
                } catch (error) {
                    console.error('Error fetching courses:', error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setIsLoading(false)
            }
        }

        if (status === 'authenticated') {
            fetchCourses()
        }
    }, [status, user?.package])

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (status === 'loading' || !user) return null

    const availableCourses = courses || []

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 mb-3"
                                >
                                    <span className="w-8 h-px bg-primary-600" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600">Your Learning Hub</span>
                                </motion.div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Package <span className="text-primary-600 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Courses</span></h1>
                                <p className="text-slate-500 font-medium mt-2">
                                    {user.package ? `Curated courses for your ${user.package} subscription.` : 'Enroll in a package to unlock your personalized courses.'}
                                </p>
                            </div>

                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search your courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Courses Grid */}
                        {!user.package ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-40" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-8 border border-slate-100 rotate-6 transition-transform hover:rotate-12 duration-500">
                                        <Lock className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">No Active Package Found</h2>
                                    <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                                        It looks like you haven't enrolled in a learning package yet. Choose a plan to unlock premium courses and start your journey.
                                    </p>
                                    <button
                                        onClick={() => router.push('/dashboard/packages')}
                                        className="flex items-center gap-3 px-10 py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95 group"
                                    >
                                        Explore Packages
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {availableCourses.filter((c: any) => {
                                    const query = searchQuery.toLowerCase().trim();
                                    return c.title.toLowerCase().includes(query) ||
                                        c.subject.toLowerCase().includes(query);
                                }).map((course: any, idx: number) => (
                                    <motion.div
                                        key={course._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-primary-600/10 transition-all duration-500 group"
                                    >
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            {course.elite && (
                                                <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl">
                                                    <Trophy className="w-3 h-3" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Elite Module</span>
                                                </div>
                                            )}
                                            <div className="absolute bottom-4 left-4">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-primary-600 border border-primary-100">
                                                    {course.subject}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-primary-500" />
                                                    {course.duration}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                                                    {course.lessons} Lessons
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Progress</span>
                                                    <span className="text-[10px] font-black text-primary-600 tracking-tight">{course.progress}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${course.progress}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className="h-full bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => router.push(`/video?subject=${encodeURIComponent(course.subject)}&id=${course._id}`)}
                                                className="w-full py-4 bg-slate-900 group-hover:bg-primary-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                                            >
                                                {course.progress > 0 ? 'Continue Class' : 'Start Journey'}
                                                <PlayCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Support CTA */}
                        <div className="mt-16 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[3rem] p-10 md:p-12 relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 opacity-20 blur-[100px] -mr-32 -mt-32" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                        <Sparkles className="w-5 h-5 text-primary-400 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-400">Personal AI Mentor</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Stuck on a tricky concept?</h2>
                                    <p className="text-slate-400 font-medium text-sm">Our AI Tutors are available 24/7 to clear your doubts instantly.</p>
                                </div>
                                <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-50 transition-all active:scale-95 shadow-xl whitespace-nowrap">
                                    Ask AI Tutor Now
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
