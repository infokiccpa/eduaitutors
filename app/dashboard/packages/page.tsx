'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import PackagesSection from '@/components/PackagesSection'
import { motion } from 'framer-motion'
import { Crown, Sparkles, ShieldCheck } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function DashboardPackages() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            {/* Dashboard Header Info */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-600/20">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Packages</h1>
                  <p className="text-slate-500 text-sm font-medium">Manage and upgrade your learning plans.</p>
                </div>
              </div>

              {user.package && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-600 px-6 py-4 rounded-[2rem] text-white shadow-2xl shadow-emerald-600/20 flex items-center gap-4 border border-emerald-500/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Active Plan</p>
                    <p className="text-sm font-black tracking-tight">{user.package}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Packages Content */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-40" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -ml-32 -mb-32 opacity-40" />

              <div className="relative z-10">
                <PackagesSection variant="full" onlySubscribed={false} hideHeader={true} />
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                { icon: <Sparkles className="w-5 h-5" />, title: 'Premium Features', desc: 'Unlock 1-on-1 AI tutoring and daily interactive modules.' },
                { icon: <ShieldCheck className="w-5 h-5" />, title: 'Trusted Support', desc: 'Get priority doubt resolution from our top educators.' },
                { icon: <Crown className="w-5 h-5" />, title: 'Certified Success', desc: 'Receive official certificates for every course completion.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-primary-600 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-black text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
