'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface CoursesSectionProps {
  selectedBoard: string
  setSelectedBoard: (board: string) => void
  onSubjectChange: (subjects: any[]) => void
  onEnrollClick: () => void
}

export default function CoursesSection({ selectedBoard, setSelectedBoard, onSubjectChange, onEnrollClick }: CoursesSectionProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set())

  const courses: Record<string, Record<string, Course[]>> = {
    cbse: {
      '9': [
        { subject: 'Physics', class: '9', board: 'CBSE', price: 4999, duration: '180 Days', days: 'Mon, Wed, Fri', time: '4:00 PM - 5:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400' },
        { subject: 'Chemistry', class: '9', board: 'CBSE', price: 4999, duration: '180 Days', days: 'Tue, Thu, Sat', time: '5:30 PM - 7:00 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400' },
        { subject: 'Biology', class: '9', board: 'CBSE', price: 4999, duration: '180 Days', days: 'Mon, Wed, Fri', time: '7:00 PM - 8:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400' },
        { subject: 'Mathematics', class: '9', board: 'CBSE', price: 4999, duration: '180 Days', days: 'Tue, Thu, Sat', time: '4:00 PM - 5:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400' },
      ],
      '10': [
        { subject: 'Physics', class: '10', board: 'CBSE', price: 5999, duration: '200 Days', days: 'Mon, Wed, Fri', time: '6:00 PM - 7:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400' },
        { subject: 'Chemistry', class: '10', board: 'CBSE', price: 5999, duration: '200 Days', days: 'Tue, Thu, Sat', time: '6:00 PM - 7:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400' },
        { subject: 'Biology', class: '10', board: 'CBSE', price: 5999, duration: '200 Days', days: 'Mon, Wed, Fri', time: '7:30 PM - 9:00 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400' },
        { subject: 'Mathematics', class: '10', board: 'CBSE', price: 5999, duration: '200 Days', days: 'Tue, Thu, Sat', time: '5:00 PM - 6:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400' },
      ],
    },
    icse: {
      '9': [
        { subject: 'Physics', class: '9', board: 'ICSE', price: 5499, duration: '180 Days', days: 'Mon, Wed, Fri', time: '3:00 PM - 4:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400' },
        { subject: 'Chemistry', class: '9', board: 'ICSE', price: 5499, duration: '180 Days', days: 'Tue, Thu, Sat', time: '4:30 PM - 6:00 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400' },
        { subject: 'Biology', class: '9', board: 'ICSE', price: 5499, duration: '180 Days', days: 'Mon, Wed, Fri', time: '6:00 PM - 7:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400' },
        { subject: 'Mathematics', class: '9', board: 'ICSE', price: 5499, duration: '180 Days', days: 'Tue, Thu, Sat', time: '3:00 PM - 4:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400' },
      ],
      '10': [
        { subject: 'Physics', class: '10', board: 'ICSE', price: 6499, duration: '200 Days', days: 'Mon, Wed, Fri', time: '5:00 PM - 6:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400' },
        { subject: 'Chemistry', class: '10', board: 'ICSE', price: 6499, duration: '200 Days', days: 'Tue, Thu, Sat', time: '5:00 PM - 6:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400' },
        { subject: 'Biology', class: '10', board: 'ICSE', price: 6499, duration: '200 Days', days: 'Mon, Wed, Fri', time: '6:30 PM - 8:00 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400' },
        { subject: 'Mathematics', class: '10', board: 'ICSE', price: 6499, duration: '200 Days', days: 'Tue, Thu, Sat', time: '4:00 PM - 5:30 PM', starting: '1st January 2026', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400' },
      ],
    },
  }

  const getSubjectKey = (course: Course) => `${course.board}-${course.class}-${course.subject}`

  const handleSubjectToggle = (course: Course) => {
    const key = getSubjectKey(course)
    const newSelected = new Set(selectedSubjects)

    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }

    setSelectedSubjects(newSelected)

    // Convert to array format for parent
    const subjectsArray = Array.from(newSelected).map(key => {
      const [board, classNum, subject] = key.split('-')
      const courseData = courses[board.toLowerCase()][classNum].find(c => c.subject === subject)
      return courseData
    }).filter(Boolean)

    onSubjectChange(subjectsArray)
  }

  const getGradientColor = (index: number) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-primary-400 to-primary-600',
      'from-green-400 to-green-600',
      'from-orange-400 to-orange-600',
    ]
    return colors[index % 4]
  }

  const getAccentColor = (index: number) => {
    const colors = [
      'text-blue-600',
      'text-primary-600',
      'text-green-600',
      'text-orange-600',
    ]
    return colors[index % 4]
  }

  const renderCourseCard = (course: Course, index: number) => {
    const key = getSubjectKey(course)
    const isSelected = selectedSubjects.has(key)
    const gradient = getGradientColor(index)
    const accent = getAccentColor(index)

    return (
      <motion.div
        key={key}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
      >
        <div className={`h-48 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={course.image}
            alt={course.subject}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400'
            }}
          />
        </div>
        <div className="p-6">
          <h4 className="text-2xl font-bold text-gray-900 mb-4">{course.subject}</h4>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              <span className={`font-semibold ${accent}`}>Duration:</span> {course.duration}
            </p>
            <p className="text-sm text-gray-600">
              <span className={`font-semibold ${accent}`}>Days:</span> {course.days}
            </p>
            <p className="text-sm text-gray-600">
              <span className={`font-semibold ${accent}`}>Time:</span> {course.time}
            </p>
            <p className="text-sm text-gray-600">
              <span className={`font-semibold ${accent}`}>Starting:</span> {course.starting}
            </p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className={`text-2xl font-bold ${accent}`}>₹{course.price.toLocaleString()}</span>
              <span className="text-gray-500 line-through ml-2 text-sm">₹{(course.price * 1.6).toFixed(0)}</span>
            </div>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSubjectToggle(course)}
              className={`w-6 h-6 ${accent} rounded border-gray-300 focus:ring-2 focus:ring-primary-500 cursor-pointer`}
            />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <section id="courses" className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Available Courses</h2>
          <p className="text-xl text-gray-600">Grade 9 - Grade 12</p>
        </motion.div>

        {/* Board Tabs */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex bg-white rounded-full shadow-lg p-2"
          >
            <button
              onClick={() => {
                setSelectedBoard('cbse')
                setSelectedSubjects(new Set())
                onSubjectChange([])
              }}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${selectedBoard === 'cbse'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                  : 'text-gray-600 hover:text-primary-600'
                }`}
            >
              CBSE
            </button>
            <button
              onClick={() => {
                setSelectedBoard('icse')
                setSelectedSubjects(new Set())
                onSubjectChange([])
              }}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${selectedBoard === 'icse'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                  : 'text-gray-600 hover:text-primary-600'
                }`}
            >
              ICSE
            </button>
          </motion.div>
        </div>

        {/* Course Grids */}
        <AnimatePresence mode="wait">
          {(['9', '10'] as const).map((classNum) => (
            <motion.div
              key={`${selectedBoard}-${classNum}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-16"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center uppercase tracking-widest border-b-2 border-primary-100 pb-4 w-fit mx-auto">
                Class {classNum}th - {selectedBoard.toUpperCase()}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses[selectedBoard][classNum].map((course, index) => renderCourseCard(course, index))}
              </div>
              <div className="text-center mt-16">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEnrollClick}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-12 py-4 rounded-full font-bold text-lg hover:shadow-xl transition transform shadow-lg"
                >
                  Enroll Now <span className="ml-2">→</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

