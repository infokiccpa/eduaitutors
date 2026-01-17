'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CoursesSection() {
  return (
    <section id="courses" className="py-16 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group cursor-pointer"
        >
          <Link href="/courses">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 overflow-hidden relative shadow-2xl hover:shadow-primary-600/20 transition-all duration-700">
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/20 rounded-full blur-[100px] -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] -ml-32 -mb-32" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-primary-400 text-[9px] font-black uppercase tracking-[0.3em] mb-6">
                    Academic Excellence
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tighter leading-tight">
                    Explore Our <br />
                    <span className="text-primary-500 italic">Available Courses.</span>
                  </h2>
                  <p className="text-base text-slate-400 font-medium max-w-md mb-8">
                    Standardized curriculum for Grade 1-12 across CBSE and ICSE boards, designed for holistic learning.
                  </p>
                  <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary-50 transition-colors shadow-lg group-hover:scale-105 duration-500">
                    View All Courses
                  </button>
                </div>

                <div className="relative w-full max-w-[400px] aspect-square hidden lg:block">
                  <div className="absolute inset-0 bg-primary-600 rounded-[3rem] rotate-3 group-hover:rotate-6 transition-transform duration-700 opacity-10 blur-xl" />

                  <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/10 shadow-3xl flex flex-col">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      {[
                        { img: '/course_math_thumbnail.png', color: 'from-orange-500/20' },
                        { img: '/course_science_thumbnail.png', color: 'from-blue-500/20' },
                        { img: '/course_coding_thumbnail.png', color: 'from-purple-500/20' },
                        { img: '/course_history_thumbnail.png', color: 'from-emerald-500/20' }
                      ].map((item, i) => (
                        <div key={i} className={`relative rounded-2xl overflow-hidden shadow-2xl group/thumb bg-gradient-to-br ${item.color} to-transparent border border-white/5`}>
                          <img
                            src={item.img}
                            alt={`Course ${i}`}
                            className="w-full h-full object-cover mix-blend-overlay group-hover/thumb:mix-blend-normal transition-all duration-500 group-hover/thumb:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                        </div>
                      ))}
                    </div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mt-8 p-4 bg-primary-600 rounded-2xl shadow-[0_10px_30px_-5px_rgba(234,88,12,0.5)] text-center border border-white/20"
                    >
                      <p className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Adaptive Learning Active</p>
                    </motion.div>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Premium Content</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
