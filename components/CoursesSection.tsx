'use client'

import { useState } from 'react'

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
      <div key={key} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
        <div className={`h-48 bg-gradient-to-br ${gradient} relative`}>
          <img 
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
              className={`w-6 h-6 ${accent} rounded border-gray-300 focus:ring-2 focus:ring-primary-500`}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Available Courses</h2>
          <p className="text-xl text-gray-600">Choose your board and explore our courses</p>
        </div>

        {/* Board Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full shadow-lg p-2">
            <button
              onClick={() => {
                setSelectedBoard('cbse')
                setSelectedSubjects(new Set())
                onSubjectChange([])
              }}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                selectedBoard === 'cbse'
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
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                selectedBoard === 'icse'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              ICSE
            </button>
          </div>
        </div>

        {/* Course Grids */}
        {(['9', '10'] as const).map((classNum) => (
          <div key={classNum} className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Class {classNum}th - {selectedBoard.toUpperCase()}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses[selectedBoard][classNum].map((course, index) => renderCourseCard(course, index))}
            </div>
            <div className="text-center mt-16">
              <button
                onClick={onEnrollClick}
                className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-12 py-4 rounded-full font-bold text-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                Enroll Now <span className="ml-2">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

