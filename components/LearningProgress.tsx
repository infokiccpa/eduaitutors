'use client'
import { useEffect, useState } from 'react'
import { BookOpen, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function LearningProgress() {
  const [subjects, setSubjects] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (user.subjects) {
      setSubjects(user.subjects)
    }
  }, [])

  const getSubjectColor = (index: number) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-rose-600',
      'from-purple-500 to-pink-600',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Learning Progress</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Syllabus Completion</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
          <BookOpen className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-6">
        {subjects.length > 0 ? (
          subjects.map((subject, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3 group cursor-pointer"
              onClick={() => router.push(`/dashboard/courses?subject=${subject}`)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-700">{subject}</span>
                <span className="text-xs font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg">45%</span>
              </div>
              <div className="relative">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${getSubjectColor(index)} rounded-full shadow-lg shadow-primary-500/10`}
                  />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-sm">No subjects enrolled yet.</p>
            <button
              onClick={() => router.push('/dashboard/packages')}
              className="mt-4 text-primary-600 font-black text-xs uppercase tracking-widest hover:text-primary-700"
            >
              Browse Packages →
            </button>
          </div>
        )}
      </div>

      {subjects.length > 0 && (
        <button
          onClick={() => router.push('/dashboard/courses')}
          className="w-full mt-8 py-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group"
        >
          View Full Curriculum
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  )
}

