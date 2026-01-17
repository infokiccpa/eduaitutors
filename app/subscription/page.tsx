'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { motion } from 'framer-motion'
import { Sparkles, Calendar, BookOpen, GraduationCap, CheckCircle2, ShieldCheck, Clock, ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function SubscriptionPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user as any

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') return null

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <div className="flex">
        <Sidebar aria-label="Sidebar Navigation" />
        <main className="flex-1 ml-64 mt-16 p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Subscriptions</h1>
              <p className="text-slate-500 font-medium text-lg">Manage your active learning paths and package details.</p>
            </div>

            {user && user.package ? (
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Subscription Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-2 space-y-8"
                >
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full -mr-32 -mt-32 blur-3xl" />

                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 rounded-full text-primary-400 text-xs font-black uppercase tracking-widest mb-4">
                          <Sparkles className="w-3 h-3" /> Active Plan
                        </div>
                        <h2 className="text-3xl font-black mb-1">{user.package}</h2>
                        <p className="text-slate-400 font-medium">Next billing on Dec 24, 2026</p>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="grid sm:grid-cols-2 gap-8 mb-8">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Grade</p>
                            <p className="text-lg font-black text-slate-900">Grade {user.grade || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Education Board</p>
                            <p className="text-lg font-black text-slate-900">{user.board || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" /> Selected Subjects
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.subjects && user.subjects.map((s: string) => (
                            <span key={s} className="px-5 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm border border-slate-100 hover:border-primary-200 hover:bg-white hover:shadow-sm transition-all cursor-default">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment History Teaser */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Recent Transactions</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Annual Enrollment Fee</p>
                            <p className="text-xs text-slate-500">Jan 12, 2026</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900">₹{Number(user.price || 0).toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Successful</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Content - Videos for Selected Subjects */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Course Content</h3>
                    <div className="space-y-6">
                      {user.subjects && user.subjects.map((subject: string) => {
                        const subjectVideos = {
                          'Physics': {
                            title: 'Introduction to Mechanics',
                            description: 'Learn the fundamental concepts of motion, force, and energy in this comprehensive introduction.',
                            duration: '45 mins',
                            thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop'
                          },
                          'Chemistry': {
                            title: 'Atomic Structure Basics',
                            description: 'Understand the building blocks of matter and explore atomic models in this essential chemistry lesson.',
                            duration: '38 mins',
                            thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=225&fit=crop'
                          },
                          'Biology': {
                            title: 'Cell Biology Fundamentals',
                            description: 'Dive into the world of cells and discover how living organisms function at the microscopic level.',
                            duration: '52 mins',
                            thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=225&fit=crop'
                          },
                          'Mathematics': {
                            title: 'Algebra Essentials',
                            description: 'Master the core algebraic concepts that form the foundation of advanced mathematics.',
                            duration: '42 mins',
                            thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop'
                          }
                        }
                        const videoData = subjectVideos[subject as keyof typeof subjectVideos]
                        if (!videoData) return null

                        return (
                          <div
                            key={subject}
                            onClick={() => router.push(`/video?subject=${encodeURIComponent(subject)}&id=${subject.toLowerCase()}`)}
                            className="group bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all cursor-pointer"
                          >
                            <div className="flex gap-4">
                              <div className="relative flex-shrink-0 w-40 h-24 bg-slate-200 rounded-xl overflow-hidden">
                                <img src={videoData.thumbnail} alt={videoData.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary-600 border-b-8 border-b-transparent ml-1"></div>
                                  </div>
                                </div>
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                                  {videoData.duration}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full mb-2">
                                  {subject}
                                </div>
                                <h4 className="font-black text-slate-900 mb-1">{videoData.title}</h4>
                                <p className="text-sm text-slate-600 line-clamp-2">{videoData.description}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Sidebar stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-primary-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary-600/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <Clock className="w-8 h-8 mb-6" />
                    <h3 className="text-xl font-black mb-2">Learning Progress</h3>
                    <p className="text-primary-100 text-sm mb-6 font-medium">You have completed 12% of your curriculum goals this month. Keep it up!</p>
                    <div className="w-full bg-primary-700 rounded-full h-2 mb-2">
                      <div className="bg-white h-full rounded-full w-[12%]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-200">Level 4 Achievement</span>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Need Help?</h3>
                    <p className="text-slate-500 text-sm mb-6 font-medium">Upgrade your subjects or change your board preferences at any time.</p>
                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all group">
                      Contact Support <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">No Active Subscriptions</h2>
                <p className="text-slate-500 mb-8 font-medium">Browse our learning packages and start your journey today.</p>
                <button className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/20">
                  Explore Packages
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
