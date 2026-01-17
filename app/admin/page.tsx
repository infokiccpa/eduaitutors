'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import {
    Users,
    Trophy,
    TrendingUp,
    Plus,
    Calendar,
    ChevronRight,
    UserCheck,
    Zap,
    Clock,
    X,
    Video,
    LinkIcon,
    Search,
    Filter,
    Edit3,
    Trash2,
    BookOpen,
    LayoutGrid,
    BarChart3,
    ExternalLink,
    FileText,
    HelpCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
    const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'students' | 'courses' | 'quizzes' | 'leads'>('students')
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Students State
    const [students, setStudents] = useState<any[]>([])
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [loadingStudents, setLoadingStudents] = useState(false)
    const [studentDetail, setStudentDetail] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterPackage, setFilterPackage] = useState('')

    // Leads State
    const [leads, setLeads] = useState<any[]>([])
    const [loadingLeads, setLoadingLeads] = useState(false)
    const [allCourses, setAllCourses] = useState<any[]>([])
    const [loadingCourses, setLoadingCourses] = useState(false)
    const [editingCourse, setEditingCourse] = useState<any>(null)

    // Schedule Form State
    const [scheduleFormData, setScheduleFormData] = useState({
        title: '',
        instructor: '',
        subject: 'Physics',
        startTime: '',
        duration: '1 Hour',
        meetingLink: '',
        description: ''
    })

    // Quiz Form State
    const [quizzes, setQuizzes] = useState<any[]>([])
    const [loadingQuizzes, setLoadingQuizzes] = useState(false)
    const [quizFormData, setQuizFormData] = useState({
        title: '',
        subject: 'Physics',
        description: '',
        duration: '20 mins',
        difficulty: 'Medium',
        questions: [{ question: '', options: ['', '', '', ''], answer: '' }]
    })
    const [courseFormData, setCourseFormData] = useState({
        title: '',
        subject: 'Mathematics',
        packageName: 'Foundation Builder',
        duration: '',
        lessons: 0,
        image: '/course_placeholder.png',
        instructor: '',
        description: '',
        learningObjectives: [''],
        chapters: [{ title: '', time: '' }]
    })

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && (session.user as any).role !== 'admin')) {
            router.push('/dashboard')
        }

        const fetchAdminData = async () => {
            try {
                const res = await fetch('/api/admin/stats')
                if (res.ok) {
                    const data = await res.json()
                    setStats(data)
                    setStudents(data.recentUsers)
                }
            } catch (error) {
                console.error('Admin Error:', error)
            } finally {
                setLoading(false)
            }
        }

        if (status === 'authenticated' && (session.user as any).role === 'admin') {
            fetchAdminData()
            fetchStudents()
            fetchCourses()
            fetchQuizzes()
            fetchLeads()
        }
    }, [status, session, router])

    const fetchStudents = async () => {
        setLoadingStudents(true)
        try {
            const res = await fetch(`/api/admin/users?search=${searchTerm}&package=${filterPackage}`)
            if (res.ok) setStudents(await res.json())
        } catch (error) { console.error('Fetch Students Error:', error) }
        finally { setLoadingStudents(false) }
    }

    const fetchCourses = async () => {
        setLoadingCourses(true)
        try {
            const res = await fetch('/api/admin/courses')
            if (res.ok) setAllCourses(await res.json())
        } catch (error) { console.error('Fetch Courses Error:', error) }
        finally { setLoadingCourses(false) }
    }

    const fetchQuizzes = async () => {
        setLoadingQuizzes(true)
        try {
            const res = await fetch('/api/admin/quizzes')
            if (res.ok) setQuizzes(await res.json())
        } catch (error) { console.error('Fetch Quizzes Error:', error) }
        finally { setLoadingQuizzes(false) }
    }

    const fetchLeads = async () => {
        setLoadingLeads(true)
        try {
            const res = await fetch('/api/admin/leads')
            if (res.ok) setLeads(await res.json())
        } catch (error) { console.error('Fetch Leads Error:', error) }
        finally { setLoadingLeads(false) }
    }

    const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            })
            if (res.ok) {
                toast.success('Lead updated')
                setLeads(leads.map(l => l._id === id ? { ...l, status: newStatus } : l))
            } else {
                toast.error('Failed to update lead status')
            }
        } catch (e) { toast.error('Something went wrong while updating lead') }
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (status === 'authenticated' && (session.user as any).role === 'admin') {
                fetchStudents()
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, filterPackage, status, session])

    const fetchStudentDetail = async (userId: string) => {
        setIsStudentDetailOpen(true)
        setStudentDetail(null)
        try {
            const res = await fetch(`/api/admin/users/details?userId=${userId}`)
            if (res.ok) {
                const data = await res.json()
                setStudentDetail(data)
            }
        } catch (error) {
            console.error('Fetch Student Detail Error:', error)
        }
    }

    const handleCreateSchedule = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scheduleFormData)
            })

            if (res.ok) {
                toast.success('Live class scheduled successfully!')
                setIsScheduleModalOpen(false)
                setScheduleFormData({
                    title: '',
                    instructor: '',
                    subject: 'Physics',
                    startTime: '',
                    duration: '1 Hour',
                    meetingLink: '',
                    description: ''
                })
            } else {
                toast.error('Failed to create schedule')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleQuizSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/admin/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...quizFormData,
                    questionsCount: quizFormData.questions.length
                })
            })
            if (res.ok) {
                toast.success('Quiz Created!')
                setIsQuizModalOpen(false)
                fetchQuizzes()
            }
        } catch (error) { toast.error('Creation failed') }
        finally { setIsSubmitting(false) }
    }

    const deleteQuiz = async (id: string) => {
        if (!confirm('Delete this quiz?')) return
        try {
            const res = await fetch(`/api/admin/quizzes?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Quiz deleted')
                fetchQuizzes()
            }
        } catch (error) { toast.error('Delete failed') }
    }

    const addQuestion = () => {
        setQuizFormData({
            ...quizFormData,
            questions: [...quizFormData.questions, { question: '', options: ['', '', '', ''], answer: '' }]
        })
    }

    const handleCourseSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        const method = editingCourse ? 'PATCH' : 'POST'
        const url = editingCourse ? `/api/admin/courses?id=${editingCourse._id}` : '/api/admin/courses'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseFormData)
            })

            if (res.ok) {
                toast.success(editingCourse ? 'Course updated!' : 'Course created!')
                setIsCourseModalOpen(false)
                setEditingCourse(null)
                fetchCourses()
            } else {
                toast.error('Operation failed')
            }
        } catch (error) {
            toast.error('Error saving course')
        } finally {
            setIsSubmitting(false)
        }
    }

    const deleteCourse = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return
        try {
            const res = await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Course deleted')
                fetchCourses()
            }
        } catch (error) {
            toast.error('Delete failed')
        }
    }

    const openEditCourse = (course: any) => {
        setEditingCourse(course)
        setCourseFormData({
            title: course.title,
            subject: course.subject,
            packageName: course.packageName,
            duration: course.duration,
            lessons: course.lessons,
            image: course.image,
            instructor: course.instructor,
            description: course.description,
            learningObjectives: course.learningObjectives || [''],
            chapters: course.chapters || [{ title: '', time: '' }]
        })
        setIsCourseModalOpen(true)
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!stats) return null

    const metrics = [
        { label: 'Total Students', value: stats.metrics.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Quizzes Taken', value: stats.metrics.totalQuizzesTaken, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Platform Activity', value: stats.metrics.totalActivities, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Sessions', value: '12', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Contacted': return 'bg-purple-100 text-purple-800';
            case 'Qualified': return 'bg-emerald-100 text-emerald-800';
            case 'Unqualified': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Admin Welcome */}
                        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Admin Control Center</span>
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Management Console</h1>
                                <p className="text-slate-500 font-medium text-lg">Oversee performance, curriculum, and schedules.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setIsScheduleModalOpen(true)
                                    }}
                                    className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
                                >
                                    <Calendar className="w-4 h-4" /> Schedule Class
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingCourse(null)
                                        setCourseFormData({
                                            title: '',
                                            subject: 'Mathematics',
                                            packageName: 'Foundation Builder',
                                            duration: '',
                                            lessons: 0,
                                            image: '/course_placeholder.png',
                                            instructor: '',
                                            description: '',
                                            learningObjectives: [''],
                                            chapters: [{ title: '', time: '' }]
                                        })
                                        setIsCourseModalOpen(true)
                                    }}
                                    className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Create Course
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-white/50 backdrop-blur p-1 rounded-2xl w-fit mb-8 border border-slate-200 shadow-sm">
                            <button
                                onClick={() => setActiveTab('students')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'students' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Students
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('courses')
                                    fetchCourses()
                                }}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'courses' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Courses
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('quizzes')
                                    fetchQuizzes()
                                }}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'quizzes' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Quizzes
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('leads')
                                    fetchLeads()
                                }}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Leads
                            </button>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            {metrics.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm"
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center mb-4`}>
                                        <m.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</h3>
                                    <p className="text-3xl font-black text-slate-900">{m.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {activeTab === 'students' ? (
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                            <UserCheck className="w-5 h-5 text-primary-600" />
                                            Student Directory
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search students..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-600/20 outline-none w-48"
                                                />
                                            </div>
                                            <select
                                                value={filterPackage}
                                                onChange={(e) => setFilterPackage(e.target.value)}
                                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none"
                                            >
                                                <option value="">All Plans</option>
                                                <option value="Foundation Builder">Foundation</option>
                                                <option value="JEE Mastery">JEE Mastery</option>
                                                <option value="Mastery Accelerator">Mastery</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {loadingStudents ? (
                                            [1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />)
                                        ) : students.length > 0 ? (
                                            students.map((user: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary-100 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900">{user.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{user.package || 'No Plan'} • {user.grade}th • {user.board}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-primary-600 px-2 py-1 bg-primary-50 rounded-md uppercase">
                                                            {user.subjects?.length || 0} Sub
                                                        </span>
                                                        <button
                                                            onClick={() => fetchStudentDetail(user._id)}
                                                            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center">
                                                <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                                <p className="text-sm font-bold text-slate-400 tracking-tight uppercase">No Students Found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : activeTab === 'courses' ? (
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-8">
                                        <BookOpen className="w-5 h-5 text-indigo-600" />
                                        Course Management
                                    </h2>
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {loadingCourses ? (
                                            [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />)
                                        ) : allCourses.length > 0 ? (
                                            allCourses.map((course: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-indigo-100 overflow-hidden shadow-sm">
                                                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 leading-tight">{course.title}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{course.subject} • {course.packageName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => openEditCourse(course)}
                                                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCourse(course._id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center">
                                                <LayoutGrid className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                                <p className="text-sm font-bold text-slate-400 tracking-tight uppercase">Inventory Empty</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                            <HelpCircle className="w-5 h-5 text-amber-600" />
                                            Quiz assessments
                                        </h2>
                                        <button
                                            onClick={() => setIsQuizModalOpen(true)}
                                            className="p-3 bg-amber-50 rounded-xl text-amber-600 hover:bg-amber-100 transition shadow-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {loadingQuizzes ? (
                                            [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />)
                                        ) : quizzes.length > 0 ? (
                                            quizzes.map((q: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group">
                                                    <div>
                                                        <p className="font-black text-slate-900 leading-tight">{q.title}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{q.subject} • {q.questionsCount} Ques • {q.difficulty}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => deleteQuiz(q._id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center">
                                                <HelpCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">No assessments found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'leads' && (
                                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900">Marketing Leads</h2>
                                            <p className="text-slate-500 font-medium">Capture and manage potential student inquiries</p>
                                        </div>
                                        <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-amber-100">
                                            {leads.filter(l => l.status === 'New').length} New Inquiries
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100">
                                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name & Contact</th>
                                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Interest</th>
                                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Source</th>
                                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {loadingLeads ? (
                                                    [1, 2, 3].map(i => <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-16 bg-slate-50 animate-pulse rounded-xl" /></td></tr>)
                                                ) : leads.length > 0 ? (
                                                    leads.map((lead, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition duration-200">
                                                            <td className="px-6 py-4">
                                                                <p className="font-black text-slate-900">{lead.name}</p>
                                                                <p className="text-xs font-bold text-slate-400">{lead.email} • {lead.phone}</p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">
                                                                    {lead.courseInterest || lead.grade || 'General'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <select
                                                                    value={lead.status}
                                                                    onChange={(e) => handleUpdateLeadStatus(lead._id, e.target.value)}
                                                                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg outline-none cursor-pointer border-none
                                                                        ${lead.status === 'New' ? 'bg-amber-100 text-amber-700' :
                                                                            lead.status === 'Contacted' ? 'bg-indigo-100 text-indigo-700' :
                                                                                lead.status === 'Enrolled' ? 'bg-emerald-100 text-emerald-700' :
                                                                                    lead.status === 'Qualified' ? 'bg-purple-100 text-purple-700' :
                                                                                        'bg-slate-100 text-slate-600'}`}
                                                                >
                                                                    <option>New</option>
                                                                    <option>Contacted</option>
                                                                    <option>Qualified</option>
                                                                    <option>Enrolled</option>
                                                                    <option>Lost</option>
                                                                </select>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">{lead.source}</p>
                                                                <p className="text-[10px] font-medium text-slate-300">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button className="p-2 hover:bg-white rounded-lg transition text-slate-400 hover:text-indigo-600">
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-20 text-center">
                                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <Users className="w-8 h-8 text-slate-200" />
                                                            </div>
                                                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No leads yet</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Recent Quiz Performance */}
                            <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-primary-400" />
                                            Live Performance Feed
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        {stats.recentResults.map((res: any, idx: number) => (
                                            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-black text-white">{res.userId?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{res.quizId?.title || 'General Quiz'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-lg font-black ${res.score / res.totalQuestions >= 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                        {Math.round((res.score / res.totalQuestions) * 100)}%
                                                    </p>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase">Score</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Create Schedule Modal */}
            <AnimatePresence>
                {isScheduleModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsScheduleModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Schedule Live Class</h2>
                                    <p className="text-sm text-slate-500 font-medium">Create a new session for students</p>
                                </div>
                                <button
                                    onClick={() => setIsScheduleModalOpen(false)}
                                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSchedule} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Class Title</label>
                                        <input
                                            required
                                            type="text"
                                            value={scheduleFormData.title}
                                            onChange={(e) => setScheduleFormData({ ...scheduleFormData, title: e.target.value })}
                                            placeholder="e.g. Quantum Physics"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-600/20 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Instructor</label>
                                        <input
                                            required
                                            type="text"
                                            value={scheduleFormData.instructor}
                                            onChange={(e) => setScheduleFormData({ ...scheduleFormData, instructor: e.target.value })}
                                            placeholder="Dr. Smith"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-600/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Subject</label>
                                        <select
                                            value={scheduleFormData.subject}
                                            onChange={(e) => setScheduleFormData({ ...scheduleFormData, subject: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                        >
                                            <option>Physics</option>
                                            <option>Chemistry</option>
                                            <option>Mathematics</option>
                                            <option>Biology</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Duration</label>
                                        <input
                                            required
                                            type="text"
                                            value={scheduleFormData.duration}
                                            onChange={(e) => setScheduleFormData({ ...scheduleFormData, duration: e.target.value })}
                                            placeholder="1 Hour"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-600/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Start Time</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        value={scheduleFormData.startTime}
                                        onChange={(e) => setScheduleFormData({ ...scheduleFormData, startTime: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-600/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Meeting Link</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            required
                                            type="url"
                                            value={scheduleFormData.meetingLink}
                                            onChange={(e) => setScheduleFormData({ ...scheduleFormData, meetingLink: e.target.value })}
                                            placeholder="https://zoom.us/..."
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-600/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-700 transition shadow-xl shadow-primary-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Finalizing...' : 'Finalize Schedule'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Course Builder Modal */}
            <AnimatePresence>
                {isCourseModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsCourseModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
                                    <p className="text-sm font-medium text-slate-500">Design high-impact learning experiences</p>
                                </div>
                                <button onClick={() => setIsCourseModalOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCourseSubmit} className="p-10 space-y-8 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Course Title</label>
                                        <input required type="text" value={courseFormData.title} onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })} placeholder="e.g. Master Class in Calculus" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                                        <select value={courseFormData.subject} onChange={(e) => setCourseFormData({ ...courseFormData, subject: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option>Mathematics</option>
                                            <option>Physics</option>
                                            <option>Chemistry</option>
                                            <option>Biology</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Package</label>
                                        <select value={courseFormData.packageName} onChange={(e) => setCourseFormData({ ...courseFormData, packageName: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option>Foundation Builder</option>
                                            <option>Mastery Accelerator</option>
                                            <option>Excellence Pro</option>
                                            <option>JEE Mastery</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Instructor</label>
                                        <input required type="text" value={courseFormData.instructor} onChange={(e) => setCourseFormData({ ...courseFormData, instructor: e.target.value })} placeholder="Prof. Name" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                    <textarea required value={courseFormData.description} onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })} rows={3} placeholder="Provide a compelling overview of the course content..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-primary-600/20" />
                                </div>

                                <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition shadow-2xl shadow-indigo-600/30 disabled:opacity-50">
                                    {isSubmitting ? 'Processing...' : (editingCourse ? 'Update Live Course' : 'Launch New Course')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Quiz Builder Modal */}
            <AnimatePresence>
                {isQuizModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsQuizModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quiz Architect</h2>
                                    <p className="text-sm font-medium text-slate-500">Design engaging assessments</p>
                                </div>
                                <button onClick={() => setIsQuizModalOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleQuizSubmit} className="p-10 space-y-8 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Quiz Title</label>
                                        <input required type="text" value={quizFormData.title} onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })} placeholder="e.g. Thermodynamics Quiz 1" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                                        <select value={quizFormData.subject} onChange={(e) => setQuizFormData({ ...quizFormData, subject: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                                            <option>Physics</option><option>Chemistry</option><option>Mathematics</option><option>Biology</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Questions ({quizFormData.questions.length})</h3>
                                        <button type="button" onClick={addQuestion} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition">
                                            + Add Question
                                        </button>
                                    </div>

                                    {quizFormData.questions.map((q, idx) => (
                                        <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs">{idx + 1}</span>
                                                <input required type="text" value={q.question} onChange={(e) => {
                                                    const newQ = [...quizFormData.questions];
                                                    newQ[idx].question = e.target.value;
                                                    setQuizFormData({ ...quizFormData, questions: newQ });
                                                }} placeholder="Enter your question here..." className="flex-1 bg-transparent font-bold text-slate-800 outline-none" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {q.options.map((opt, oIdx) => (
                                                    <input key={oIdx} required type="text" value={opt} onChange={(e) => {
                                                        const newQ = [...quizFormData.questions];
                                                        newQ[idx].options[oIdx] = e.target.value;
                                                        setQuizFormData({ ...quizFormData, questions: newQ });
                                                    }} placeholder={`Option ${oIdx + 1}`} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-1 focus:ring-indigo-600/20" />
                                                ))}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-slate-400">Correct Answer</label>
                                                <select required value={q.answer} onChange={(e) => {
                                                    const newQ = [...quizFormData.questions];
                                                    newQ[idx].answer = e.target.value;
                                                    setQuizFormData({ ...quizFormData, questions: newQ });
                                                }} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none">
                                                    <option value="">Select the correct option</option>
                                                    {q.options.map((opt, oIdx) => <option key={oIdx} value={opt}>{opt || `Option ${oIdx + 1}`}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition shadow-2xl shadow-indigo-600/30 disabled:opacity-50">
                                    {isSubmitting ? 'Architecting...' : 'Lauch Quiz assessment'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Student Detail Drawer */}
            <AnimatePresence>
                {isStudentDetailOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsStudentDetailOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col"
                        >
                            {!studentDetail ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white text-3xl font-black">
                                                {studentDetail.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 leading-none mb-1">{studentDetail.user.name}</h2>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{studentDetail.user.package || 'Enrolled Student'}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsStudentDetailOpen(false)} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                                            <X className="w-5 h-5 text-slate-400" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                                        {/* Analytics Grid */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                                <BarChart3 className="w-5 h-5 text-indigo-600 mb-2" />
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Average Score</p>
                                                <p className="text-xl font-black text-slate-900">{studentDetail.analytics.avgScore}%</p>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                                <FileText className="w-5 h-5 text-emerald-600 mb-2" />
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Quizzes Done</p>
                                                <p className="text-xl font-black text-slate-900">{studentDetail.analytics.quizzesCompleted}</p>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                                <Zap className="w-5 h-5 text-amber-600 mb-2" />
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Activity Rank</p>
                                                <p className="text-xl font-black text-slate-900">{studentDetail.analytics.totalActivityPoints}</p>
                                            </div>
                                        </div>

                                        {/* Quiz History */}
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-primary-600" /> Quiz Performance History
                                            </h3>
                                            <div className="space-y-4">
                                                {studentDetail.quizHistory.length === 0 ? (
                                                    <p className="text-xs font-bold text-slate-400 italic">No quiz attempts recorded yet.</p>
                                                ) : studentDetail.quizHistory.map((q: any, i: number) => (
                                                    <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-black text-slate-800">{q.quizId?.title || 'General Quiz'}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(q.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`text-lg font-black ${q.score / q.totalQuestions >= 0.8 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                                {Math.round((q.score / q.totalQuestions) * 100)}%
                                                            </p>
                                                            <p className="text-[9px] font-bold text-slate-300 uppercase">Score</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Activity Timeline */}
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <LayoutGrid className="w-4 h-4 text-emerald-600" /> Recent Learning Activity
                                            </h3>
                                            <div className="space-y-6 relative ml-4">
                                                <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100 -ml-4" />
                                                {studentDetail.activities.length === 0 ? (
                                                    <p className="text-xs font-bold text-slate-400 italic">No recent activity detected.</p>
                                                ) : studentDetail.activities.map((act: any, i: number) => (
                                                    <div key={i} className="relative pl-6">
                                                        <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 -ml-[21.5px] border-2 border-white shadow-sm" />
                                                        <p className="text-sm font-bold text-slate-800 leading-none mb-1">{act.title}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">{act.type}</span>
                                                            <p className="text-[10px] text-slate-400 font-medium">{new Date(act.time).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
