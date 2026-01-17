'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useSession } from 'next-auth/react'
import { BookOpen, Download, FileText, Save, X, ChevronLeft, Play, Pause, Volume2, Maximize, CheckCircle2 } from 'lucide-react'

const videoContent: Record<string, any> = {
    'Physics': {
        title: 'Introduction to Mechanics',
        description: 'Learn the fundamental concepts of motion, force, and energy in this comprehensive introduction.',
        duration: '45 mins',
        instructor: 'Dr. Sarah Johnson',
        chapters: [
            { time: '0:00', title: 'Introduction to Motion' },
            { time: '8:30', title: 'Newton\'s First Law' },
            { time: '18:45', title: 'Force and Acceleration' },
            { time: '32:10', title: 'Energy Conservation' }
        ],
        resources: [
            { name: 'Lecture Notes - Mechanics.pdf', size: '2.4 MB', type: 'PDF' },
            { name: 'Practice Problems.pdf', size: '1.8 MB', type: 'PDF' },
            { name: 'Formula Sheet.pdf', size: '856 KB', type: 'PDF' }
        ],
        learningObjectives: [
            'Understand the fundamental concepts of motion and displacement',
            'Apply Newton\'s laws to solve real-world problems',
            'Calculate work, energy, and power in various scenarios',
            'Analyze conservation of energy in mechanical systems'
        ],
        questions: [
            {
                type: 'mcq',
                question: 'Which of Newton\'s laws states that "For every action, there is an equal and opposite reaction"?',
                options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravitation'],
                answer: 'Third Law'
            },
            {
                type: 'fill',
                question: 'Energy cannot be created or destroyed, it can only be __________.',
                answer: 'transformed'
            },
            {
                type: 'mcq',
                question: 'What is the SI unit of Force?',
                options: ['Joule', 'Newton', 'Watt', 'Pascal'],
                answer: 'Newton'
            }
        ]
    }
}

function VideoPlayerContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { data: session, status } = useSession()
    const user = session?.user as any
    const [activeTab, setActiveTab] = useState('overview')
    const [notes, setNotes] = useState('')
    const [savedNotes, setSavedNotes] = useState<string[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [assessmentProgress, setAssessmentProgress] = useState<Record<string, any>>({})
    const [assessmentSubmitted, setAssessmentSubmitted] = useState(false)
    const [isVideoFinished, setIsVideoFinished] = useState(false)
    const [course, setCourse] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [totalSeconds, setTotalSeconds] = useState(2700) // Default 45 mins
    const [lastSyncProgress, setLastSyncProgress] = useState(0)

    const subject = searchParams.get('subject') || ''
    const videoId = searchParams.get('id') || ''

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    useEffect(() => {
        const fetchCourse = async () => {
            if (videoId && videoId.length > 20) {
                try {
                    const res = await fetch(`/api/courses/${videoId}`)
                    if (res.ok) {
                        const data = await res.json()
                        setCourse(data)
                        // If duration is like "45 mins", parse to seconds
                        if (data.duration) {
                            const mins = parseInt(data.duration)
                            if (!isNaN(mins)) setTotalSeconds(mins * 60)
                        }
                    }

                    // Fetch existing progress
                    const progRes = await fetch(`/api/lessons/progress?courseId=${videoId}`)
                    if (progRes.ok) {
                        const progs = await progRes.json()
                        const myProg = progs.find((p: any) => p.chapterIndex === 0) // Simplified for first chapter
                        if (myProg) {
                            setElapsedSeconds(myProg.watchTime || 0)
                            if (myProg.isCompleted) setIsVideoFinished(true)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching course:', error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setIsLoading(false)
            }
        }

        if (status === 'authenticated') {
            fetchCourse()
        }
    }, [status, videoId])

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && !isVideoFinished) {
            interval = setInterval(() => {
                setElapsedSeconds(prev => {
                    const next = prev + 1;
                    if (next >= totalSeconds) {
                        setIsPlaying(false)
                        setIsVideoFinished(true)
                        syncProgress(next, true)
                        return totalSeconds
                    }
                    return next
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isVideoFinished, totalSeconds]);

    // Sync progress every 10 seconds
    useEffect(() => {
        if (elapsedSeconds > 0 && Math.abs(elapsedSeconds - lastSyncProgress) >= 10) {
            syncProgress(elapsedSeconds, false)
            setLastSyncProgress(elapsedSeconds)
        }
    }, [elapsedSeconds]);

    const syncProgress = async (seconds: number, completed: boolean) => {
        if (!videoId || videoId.length < 20) return;
        try {
            await fetch('/api/lessons/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: videoId,
                    chapterIndex: 0, // Placeholder
                    watchTime: seconds,
                    progress: Math.round((seconds / totalSeconds) * 100),
                    isCompleted: completed,
                    title: currentVideo.title,
                    subject: subject
                })
            })
        } catch (e) { console.error("Sync error:", e) }
    }

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60)
        const s = secs % 60
        return `${mins}:${s < 10 ? '0' : ''}${s}`
    }

    const currentVideo = course || videoContent[subject] || videoContent['Physics']

    if (isLoading || (status === 'loading')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const handleSaveNote = () => {
        if (notes.trim()) {
            const timestamp = new Date().toLocaleString()
            const newNote = `[${timestamp}] ${notes}`
            const updatedNotes = [...savedNotes, newNote]
            setSavedNotes(updatedNotes)
            localStorage.setItem(`notes_${subject}_${videoId}`, JSON.stringify(updatedNotes))
            setNotes('')
        }
    }

    const handleDeleteNote = (index: number) => {
        const updatedNotes = savedNotes.filter((_, i) => i !== index)
        setSavedNotes(updatedNotes)
        localStorage.setItem(`notes_${subject}_${videoId}`, JSON.stringify(updatedNotes))
    }

    const handleAssessmentChange = (qIdx: number, val: string) => {
        setAssessmentProgress(prev => ({
            ...prev,
            [qIdx]: val
        }))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-64 mt-16 bg-black">
                    {/* Back Button */}
                    <div className="bg-gray-50 px-8 py-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back to Course
                        </button>
                    </div>

                    {/* Video Player / Assessment Area */}
                    <div className="relative bg-black aspect-video overflow-y-auto">
                        {!isVideoFinished ? (
                            <>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary-700 transition shadow-2xl">
                                            {isPlaying ? (
                                                <Pause className="w-12 h-12 text-white" onClick={() => setIsPlaying(false)} />
                                            ) : (
                                                <Play className="w-12 h-12 text-white ml-1" onClick={() => setIsPlaying(true)} />
                                            )}
                                        </div>
                                        <p className="text-white text-lg font-semibold">{currentVideo.title}</p>
                                        <p className="text-gray-400 text-sm mt-1">Click play to start learning</p>
                                    </div>
                                </div>

                                {/* Video Controls */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <div className="w-full bg-gray-600 h-1 rounded-full mb-4">
                                        <div
                                            className="bg-primary-600 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${(elapsedSeconds / totalSeconds) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex items-center justify-between text-white">
                                        <div className="flex items-center gap-4">
                                            <button className="hover:text-primary-400 transition" onClick={() => setIsPlaying(!isPlaying)}>
                                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                            </button>
                                            <span className="text-sm">{formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => {
                                                    setIsPlaying(false)
                                                    setIsVideoFinished(true)
                                                    syncProgress(totalSeconds, true)
                                                }}
                                                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition flex items-center gap-2 border border-white/20"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Complete Lesson
                                            </button>
                                            <button className="hover:text-primary-400 transition">
                                                <Volume2 className="w-5 h-5" />
                                            </button>
                                            <button className="hover:text-primary-400 transition">
                                                <Maximize className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center p-8 overflow-y-auto">
                                <div className="max-w-3xl w-full bg-white rounded-3xl p-10 shadow-2xl overflow-y-auto max-h-full">
                                    {!assessmentSubmitted ? (
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900">Final Assessment</h3>
                                                    <p className="text-slate-600 mt-1">Great job finishing the video! Now, test your knowledge.</p>
                                                </div>
                                                <button
                                                    onClick={() => setIsVideoFinished(false)}
                                                    className="p-2 hover:bg-slate-100 rounded-full transition"
                                                >
                                                    <X className="w-6 h-6 text-slate-400" />
                                                </button>
                                            </div>

                                            <div className="space-y-8">
                                                {currentVideo.questions.map((q: any, qIdx: number) => (
                                                    <div key={qIdx} className="space-y-4">
                                                        <div className="flex gap-4">
                                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 text-sm">
                                                                {qIdx + 1}
                                                            </span>
                                                            <p className="text-lg font-bold text-slate-900">{q.question}</p>
                                                        </div>

                                                        {q.type === 'mcq' ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                                                                {q.options.map((opt: string) => (
                                                                    <button
                                                                        key={opt}
                                                                        onClick={() => handleAssessmentChange(qIdx, opt)}
                                                                        className={`p-4 text-left rounded-xl border transition-all font-bold ${assessmentProgress[qIdx] === opt
                                                                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-slate-50'
                                                                            }`}
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="pl-12">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Type your answer here..."
                                                                    value={assessmentProgress[qIdx] || ''}
                                                                    onChange={(e) => handleAssessmentChange(qIdx, e.target.value)}
                                                                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setAssessmentSubmitted(true)}
                                                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
                                            >
                                                Submit Answers
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                                <CheckCircle2 className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 mb-2">Lesson Mastery Achieved!</h3>
                                            <p className="text-slate-600 mb-8 font-medium">You've successfully completed the assessment for {currentVideo.title}.</p>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                    <p className="text-3xl font-black text-primary-600">3/3</p>
                                                    <p className="text-xs font-bold text-slate-500 uppercase">Correct</p>
                                                </div>
                                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                    <p className="text-3xl font-black text-green-600">+100</p>
                                                    <p className="text-xs font-bold text-slate-500 uppercase">XP Points</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => {
                                                        setAssessmentSubmitted(false)
                                                        setAssessmentProgress({})
                                                        setIsVideoFinished(false)
                                                    }}
                                                    className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
                                                >
                                                    Watch Again
                                                </button>
                                                <button
                                                    onClick={() => router.back()}
                                                    className="flex-1 py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition"
                                                >
                                                    Next Lesson
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="bg-gray-50 px-8 py-8">
                        <div className="max-w-6xl mx-auto">
                            {/* Video Title and Info */}
                            <div className="mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full mb-3">
                                            {subject}
                                        </div>
                                        <h1 className="text-3xl font-black text-slate-900 mb-2">{currentVideo.title}</h1>
                                        <p className="text-slate-600 mb-4">{currentVideo.description}</p>
                                        <div className="flex items-center gap-6 text-sm text-slate-500">
                                            <span className="font-semibold">Instructor: {currentVideo.instructor}</span>
                                            <span>Duration: {currentVideo.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-slate-200 mb-6">
                                <div className="flex gap-8">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={`pb-4 px-2 font-bold transition-colors relative ${activeTab === 'overview'
                                            ? 'text-primary-600 border-b-2 border-primary-600'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('notes')}
                                        className={`pb-4 px-2 font-bold transition-colors relative ${activeTab === 'notes'
                                            ? 'text-primary-600 border-b-2 border-primary-600'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        My Notes {savedNotes.length > 0 && `(${savedNotes.length})`}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('resources')}
                                        className={`pb-4 px-2 font-bold transition-colors relative ${activeTab === 'resources'
                                            ? 'text-primary-600 border-b-2 border-primary-600'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Resources
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('assessment')}
                                        disabled={!isVideoFinished}
                                        className={`pb-4 px-2 font-bold transition-colors relative flex items-center gap-2 ${activeTab === 'assessment'
                                            ? 'text-primary-600 border-b-2 border-primary-600'
                                            : 'text-slate-500 hover:text-slate-700'
                                            } ${!isVideoFinished ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    >
                                        Assessment
                                        {!isVideoFinished && <X className="w-3 h-3" />}
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-8">
                                {activeTab === 'overview' && (
                                    <div className="space-y-8">
                                        {/* Learning Objectives */}
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                                <BookOpen className="w-5 h-5 text-primary-600" />
                                                What You'll Learn
                                            </h3>
                                            <ul className="space-y-3">
                                                {currentVideo.learningObjectives.map((objective: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                                                        </div>
                                                        <span className="text-slate-700">{objective}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Video Chapters */}
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 mb-4">Video Chapters</h3>
                                            <div className="space-y-2">
                                                {currentVideo.chapters.map((chapter: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer group"
                                                    >
                                                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-primary-300 transition">
                                                            <Play className="w-5 h-5 text-slate-600 group-hover:text-primary-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-slate-900">{chapter.title}</p>
                                                            <p className="text-sm text-slate-500">{chapter.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'notes' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 mb-4">Take Notes</h3>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Write your notes here... They will be saved automatically with timestamp."
                                                className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                                            />
                                            <button
                                                onClick={handleSaveNote}
                                                disabled={!notes.trim()}
                                                className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save Note
                                            </button>
                                        </div>

                                        {savedNotes.length > 0 && (
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 mb-4">Saved Notes ({savedNotes.length})</h3>
                                                <div className="space-y-3">
                                                    {savedNotes.map((note, idx) => (
                                                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 group hover:border-primary-200 transition">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <p className="text-slate-700 flex-1">{note}</p>
                                                                <button
                                                                    onClick={() => handleDeleteNote(idx)}
                                                                    className="text-slate-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {savedNotes.length === 0 && (
                                            <div className="text-center py-12">
                                                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                                <p className="text-slate-500">No notes yet. Start taking notes to remember key concepts!</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'resources' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 mb-4">Download Resources</h3>
                                            <p className="text-slate-600 mb-6">Access supplementary materials to enhance your learning experience.</p>
                                        </div>

                                        <div className="space-y-3">
                                            {currentVideo.resources.map((resource: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary-200 hover:shadow-md transition group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg bg-red-100 border border-red-200 flex items-center justify-center">
                                                            <FileText className="w-6 h-6 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{resource.name}</p>
                                                            <p className="text-sm text-slate-500">{resource.type} • {resource.size}</p>
                                                        </div>
                                                    </div>
                                                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition flex items-center gap-2 opacity-0 group-hover:opacity-100">
                                                        <Download className="w-4 h-4" />
                                                        Download
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'assessment' && (
                                    <div className="space-y-8">
                                        {!isVideoFinished ? (
                                            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                                    <Play className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">Assessment Locked</h3>
                                                <p className="text-slate-500 max-w-sm mx-auto">Please finish watching the video to unlock the final assessment and earn your XP points.</p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                                <h3 className="text-2xl font-black text-slate-900 mb-4">Assessment Available</h3>
                                                <p className="text-slate-600 mb-8">The assessment is currently active above in the video area. You can also view your results there.</p>
                                                <button
                                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                                    className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition"
                                                >
                                                    Go to Assessment Area
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default function VideoPlayerPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <VideoPlayerContent />
        </Suspense>
    )
}
