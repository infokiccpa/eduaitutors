"use client"

import { useEffect, useState } from 'react'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import PackagesSection from '@/components/PackagesSection'
import PackageComparison from '@/components/PackageComparison'
import PackageFAQ from '@/components/PackageFAQ'
import { motion } from 'framer-motion'
import { Sparkles, Trophy, Star } from 'lucide-react'

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <main className="pt-20">
        {/* Animated Hero Background */}
        <section className="relative pt-24 pb-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-slate-50/50 -z-10" />
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-60" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Admissions Open 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8"
            >
              Master Your Future with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-orange-400">Elite Packages.</span>
            </motion.h1>

            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {[
                { icon: <Star className="w-5 h-5 text-yellow-400" />, text: 'Certified AI Tutoring' },
                { icon: <Trophy className="w-5 h-5 text-primary-500" />, text: 'Top 1% Educators' },
                { icon: <Sparkles className="w-5 h-5 text-indigo-500" />, text: 'Personalized Growth' }
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                  {badge.icon}
                  <span className="text-xs font-black uppercase tracking-widest text-slate-600">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PackagesSection variant="full" hideHeader={true} />

        <PackageComparison />

        <PackageFAQ />
      </main>

      <PublicFooter />
    </div>
  )
}
