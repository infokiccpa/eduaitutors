'use client'
import { Trophy, Target, Clock, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function QuizProgress() {
  const router = useRouter()

  const stats = [
    { label: 'Completed', value: '12', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Avg. Score', value: '85%', icon: Target, color: 'text-primary-600', bg: 'bg-primary-50' },
  ]

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Quiz Progress</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Performance Analytics</p>
        </div>
        <div className="flex gap-2">
          {stats.map((stat, idx) => (
            <div key={idx} className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
              <stat.icon className="w-4 h-4" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-around mb-8">
        <div className="relative group">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-100" />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 56}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - 0.75) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-primary-600"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 leading-none">75%</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Mastery</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Quiz</p>
            <p className="text-sm font-bold text-slate-700">Newton's Laws</p>
            <p className="text-[10px] font-bold text-emerald-600 uppercase">Passed (92%)</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Spent</p>
            <p className="text-sm font-bold text-slate-700">12h 45m</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push('/quiz')}
        className="w-full py-4 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center justify-center gap-2 group"
      >
        Take New Quiz
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}

