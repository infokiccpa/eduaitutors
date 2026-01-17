'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import EnrollmentForm from '@/components/EnrollmentForm'
import { Search, Filter, BookOpen, Clock, Calendar, CheckCircle2, Sparkles } from 'lucide-react'

interface Course {
  subject: string
  class: string
  board: string
  price: number
  duration: string
  days: string
  time: string
  starting: string
  image: string
}

export default function CoursesPage() {
  const [selectedBoard, setSelectedBoard] = useState('cbse')
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set())
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false)

  const courses: Record<string, Record<string, Course[]>> = {
    cbse: {
      '9': [
        { subject: 'Physics', class: '9', board: 'CBSE', price: 4999, duration: '180 Days', days: 'Mon, Wed, Fri', time: '4:00 PM - 5:30 PM', starting: '1st Jan 2026', image: '/course_physics_thumbnail.png' },
        { subject: 'Chemistry', class: '9', board: 'CBSE', price: 4999, duration: '180 Days', days: 'Tue, Thu, Sat', time: '5:30 PM - 7:00 PM', starting: '1st Jan 2026', image: '/course_chemistry_thumbnail.png' },
        { subject: 'Biology', class: '9', board: 'CBSE', price: 4999, duration: '180 Days', days: 'Mon, Wed, Fri', time: '7:00 PM - 8:30 PM', starting: '1st Jan 2026', image: '/course_science_thumbnail.png' },
        { subject: 'Mathematics', class: '9', board: 'CBSE', price: 4999, duration: '180 Days', days: 'Tue, Thu, Sat', time: '4:00 PM - 5:30 PM', starting: '1st Jan 2026', image: '/course_math_thumbnail.png' },
      ],
      '10': [
        { subject: 'Physics', class: '10', board: 'CBSE', price: 5999, duration: '200 Days', days: 'Mon, Wed, Fri', time: '6:00 PM - 7:30 PM', starting: '1st Jan 2026', image: '/course_physics_thumbnail.png' },
        { subject: 'Chemistry', class: '10', board: 'CBSE', price: 5999, duration: '200 Days', days: 'Tue, Thu, Sat', time: '6:00 PM - 7:30 PM', starting: '1st Jan 2026', image: '/course_chemistry_thumbnail.png' },
        { subject: 'Biology', class: '10', board: 'CBSE', price: 5999, duration: '200 Days', days: 'Mon, Wed, Fri', time: '7:30 PM - 9:00 PM', starting: '1st Jan 2026', image: '/course_science_thumbnail.png' },
        { subject: 'Mathematics', class: '10', board: 'CBSE', price: 5999, duration: '200 Days', days: 'Tue, Thu, Sat', time: '5:00 PM - 6:30 PM', starting: '1st Jan 2026', image: '/course_math_thumbnail.png' },
      ],
      '11': [
        { subject: 'Physics', class: '11', board: 'CBSE', price: 7999, duration: '240 Days', days: 'Mon, Wed, Fri', time: '6:30 PM - 8:30 PM', starting: '1st Jan 2026', image: '/course_physics_thumbnail.png' },
        { subject: 'Chemistry', class: '11', board: 'CBSE', price: 7999, duration: '240 Days', days: 'Tue, Thu, Sat', time: '6:30 PM - 8:30 PM', starting: '1st Jan 2026', image: '/course_chemistry_thumbnail.png' },
        { subject: 'Biology', class: '11', board: 'CBSE', price: 7999, duration: '240 Days', days: 'Mon, Wed, Fri', time: '4:30 PM - 6:30 PM', starting: '1st Jan 2026', image: '/course_science_thumbnail.png' },
        { subject: 'Mathematics', class: '11', board: 'CBSE', price: 7999, duration: '240 Days', days: 'Tue, Thu, Sat', time: '4:30 PM - 6:30 PM', starting: '1st Jan 2026', image: '/course_math_thumbnail.png' },
      ],
      '12': [
        { subject: 'Physics', class: '12', board: 'CBSE', price: 8999, duration: '240 Days', days: 'Mon, Wed, Fri', time: '7:30 PM - 9:30 PM', starting: '1st Jan 2026', image: '/course_physics_thumbnail.png' },
        { subject: 'Chemistry', class: '12', board: 'CBSE', price: 8999, duration: '240 Days', days: 'Tue, Thu, Sat', time: '7:30 PM - 9:30 PM', starting: '1st Jan 2026', image: '/course_chemistry_thumbnail.png' },
        { subject: 'Biology', class: '12', board: 'CBSE', price: 8999, duration: '240 Days', days: 'Mon, Wed, Fri', time: '5:30 PM - 7:30 PM', starting: '1st Jan 2026', image: '/course_science_thumbnail.png' },
        { subject: 'Mathematics', class: '12', board: 'CBSE', price: 8999, duration: '240 Days', days: 'Tue, Thu, Sat', time: '5:30 PM - 7:30 PM', starting: '1st Jan 2026', image: '/course_math_thumbnail.png' },
      ],
    },
    icse: {
      '9': [
        { subject: 'Physics', class: '9', board: 'ICSE', price: 5499, duration: '180 Days', days: 'Mon, Wed, Fri', time: '3:00 PM - 4:30 PM', starting: '1st Jan 2026', image: '/course_physics_thumbnail.png' },
        { subject: 'Chemistry', class: '9', board: 'ICSE', price: 5499, duration: '180 Days', days: 'Tue, Thu, Sat', time: '4:30 PM - 6:00 PM', starting: '1st Jan 2026', image: '/course_chemistry_thumbnail.png' },
        { subject: 'Biology', class: '9', board: 'ICSE', price: 5499, duration: '180 Days', days: 'Mon, Wed, Fri', time: '6:00 PM - 7:30 PM', starting: '1st Jan 2026', image: '/course_science_thumbnail.png' },
        { subject: 'Mathematics', class: '9', board: 'ICSE', price: 5499, duration: '180 Days', days: 'Tue, Thu, Sat', time: '3:00 PM - 4:30 PM', starting: '1st Jan 2026', image: '/course_math_thumbnail.png' },
      ],
      '10': [
        { subject: 'Physics', class: '10', board: 'ICSE', price: 6499, duration: '200 Days', days: 'Mon, Wed, Fri', time: '5:00 PM - 6:30 PM', starting: '1st Jan 2026', image: '/course_physics_thumbnail.png' },
        { subject: 'Chemistry', class: '10', board: 'ICSE', price: 6499, duration: '200 Days', days: 'Tue, Thu, Sat', time: '5:00 PM - 6:30 PM', starting: '1st Jan 2026', image: '/course_chemistry_thumbnail.png' },
        { subject: 'Biology', class: '10', board: 'ICSE', price: 6499, duration: '200 Days', days: 'Mon, Wed, Fri', time: '6:30 PM - 8:00 PM', starting: '1st Jan 2026', image: '/course_science_thumbnail.png' },
        { subject: 'Mathematics', class: '10', board: 'ICSE', price: 6499, duration: '200 Days', days: 'Tue, Thu, Sat', time: '4:00 PM - 5:30 PM', starting: '1st Jan 2026', image: '/course_math_thumbnail.png' },
      ],
      '11': [
        { subject: 'Physics', class: '11', board: 'ICSE/ISC', price: 8499, duration: '240 Days', days: 'Mon, Wed, Fri', time: '5:30 PM - 7:30 PM', starting: '1st Jan 2026', image: '/course_physics_thumbnail.png' },
        { subject: 'Chemistry', class: '11', board: 'ICSE/ISC', price: 8499, duration: '240 Days', days: 'Tue, Thu, Sat', time: '5:30 PM - 7:30 PM', starting: '1st Jan 2026', image: '/course_chemistry_thumbnail.png' },
        { subject: 'Biology', class: '11', board: 'ICSE/ISC', price: 8499, duration: '240 Days', days: 'Mon, Wed, Fri', time: '3:30 PM - 5:30 PM', starting: '1st Jan 2026', image: '/course_science_thumbnail.png' },
        { subject: 'Mathematics', class: '11', board: 'ICSE/ISC', price: 8499, duration: '240 Days', days: 'Tue, Thu, Sat', time: '3:30 PM - 5:30 PM', starting: '1st Jan 2026', image: '/course_math_thumbnail.png' },
      ],
      '12': [
        { subject: 'Physics', class: '12', board: 'ICSE/ISC', price: 9499, duration: '240 Days', days: 'Mon, Wed, Fri', time: '6:30 PM - 8:30 PM', starting: '1st Jan 2026', image: '/course_physics_thumbnail.png' },
        { subject: 'Chemistry', class: '12', board: 'ICSE/ISC', price: 9499, duration: '240 Days', days: 'Tue, Thu, Sat', time: '6:30 PM - 8:30 PM', starting: '1st Jan 2026', image: '/course_chemistry_thumbnail.png' },
        { subject: 'Biology', class: '12', board: 'ICSE/ISC', price: 9499, duration: '240 Days', days: 'Mon, Wed, Fri', time: '4:30 PM - 6:30 PM', starting: '1st Jan 2026', image: '/course_science_thumbnail.png' },
        { subject: 'Mathematics', class: '12', board: 'ICSE/ISC', price: 9499, duration: '240 Days', days: 'Tue, Thu, Sat', time: '4:30 PM - 6:30 PM', starting: '1st Jan 2026', image: '/course_math_thumbnail.png' },
      ],
    },
  }

  const getSubjectKey = (course: Course) => `${course.board}-${course.class}-${course.subject}`

  const handleSubjectToggle = (course: Course) => {
    const key = getSubjectKey(course)
    const newSelected = new Set(selectedSubjects)
    if (newSelected.has(key)) newSelected.delete(key)
    else newSelected.add(key)
    setSelectedSubjects(newSelected)
  }

  const getSelectedCoursesArray = () => {
    const selectedArray: Course[] = []
    selectedSubjects.forEach(key => {
      const [board, classNum, subject] = key.split('-')
      const boardKey = board.toLowerCase()
      const course = courses[boardKey]?.[classNum]?.find(c => c.subject === subject)
      if (course) selectedArray.push(course)
    })
    return selectedArray
  }

  const renderCourseCard = (course: Course, index: number) => {
    const key = getSubjectKey(course)
    const isSelected = selectedSubjects.has(key)

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-primary-600/10 transition-all duration-500 group flex flex-col"
      >
        <div className="h-48 overflow-hidden relative">
          <img src={course.image} alt={course.subject} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="p-8 pb-4 flex flex-col flex-grow">
          <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">
            {course.subject}
          </h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Duration: {course.duration}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
              <Calendar className="w-4 h-4 text-green-500" />
              <span>Days: {course.days}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Time: {course.time}</span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="text-2xl font-black text-primary-600">
              ₹{course.price.toLocaleString()}
            </div>
            <div
              onClick={() => handleSubjectToggle(course)}
              className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-200 hover:border-primary-600'
                }`}
            >
              <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          </div>
        </div>
        <div className="h-2 bg-slate-50 w-full" />
      </motion.div>
    )
  }

  return (
    <main className="min-h-screen bg-[#fafbfc]">
      <PublicHeader />

      {/* Hero Header */}
      <section className="pt-40 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-primary-100"
              >
                Academic Catalog 2026
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter"
              >
                Available <br />
                <span className="text-primary-600">Courses.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 font-medium text-lg mt-6 max-w-lg"
              >
                Select your grade and board to explore our comprehensive curriculum designed for academic excellence.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner"
            >
              {['cbse', 'icse'].map((board) => (
                <button
                  key={board}
                  onClick={() => {
                    setSelectedBoard(board)
                    setSelectedSubjects(new Set())
                  }}
                  className={`px-12 py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all duration-500 ${selectedBoard === board
                    ? 'bg-white text-primary-600 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)]'
                    : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  {board.toUpperCase()}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Listing */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {(['9', '10', '11', '12'] as const).map((classNum) => (
              <motion.div
                key={`${selectedBoard}-${classNum}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                className="mb-24"
              >
                <div className="flex items-center gap-10 mb-12">
                  <span className="text-6xl md:text-8xl font-black text-primary-200 tracking-tighter shrink-0">{classNum}TH</span>
                  <div className="h-px flex-1 bg-primary-200" />
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-1">Class {classNum} Curriculum</span>
                    <span className="text-primary-600 font-black">{selectedBoard.toUpperCase()} BOARD</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {courses[selectedBoard][classNum].map((course, index) => renderCourseCard(course, index))}
                </div>

                <div className="mt-16 text-center">
                  <button
                    onClick={() => setIsEnrollFormOpen(true)}
                    className="group relative inline-flex items-center gap-4 px-12 py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm overflow-hidden transition-all hover:bg-primary-600 shadow-2xl hover:shadow-primary-600/40"
                  >
                    <span className="relative z-10">Enroll in Class {classNum}</span>
                    <BookOpen className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Coming Soon Section for Grades 1-8 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 relative rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 p-12 md:p-20 overflow-hidden text-center shadow-2xl border border-white/10"
          >
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[120px] -mt-40 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Side Background Image */}
            <div className="absolute inset-y-0 right-0 w-full md:w-1/2 opacity-20 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60"
                alt="Junior Learning"
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-8 shadow-lg rotate-3 transition-transform hover:rotate-6 duration-500">
                <Sparkles className="w-8 h-8 text-primary-400" />
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                Grades 1-8 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-200">Coming Soon</span>
              </h2>

              <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed mb-10">
                We are building an immersive, gamified learning experience for our junior scholars.
                Get ready for a revolution in early education.
              </p>

              <div className="inline-flex flex-wrap justify-center gap-3">
                {['Gamified Learning', 'Interactive Storytelling', 'Foundation Building'].map((tag) => (
                  <span key={tag} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-bold uppercase tracking-wider backdrop-blur-sm transition-colors hover:bg-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
      {isEnrollFormOpen && (
        <EnrollmentForm
          selectedSubjects={getSelectedCoursesArray()}
          onClose={() => setIsEnrollFormOpen(false)}
        />
      )}
    </main>
  )
}
