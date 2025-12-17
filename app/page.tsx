'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import CoursesSection from '@/components/CoursesSection'
import EnrollmentForm from '@/components/EnrollmentForm'

export default function Home() {
  const [selectedBoard, setSelectedBoard] = useState('cbse')
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([])
  const [showEnrollForm, setShowEnrollForm] = useState(false)

  const updateSelectedSubjects = (subjects: any[]) => {
    setSelectedSubjects(subjects)
  }

  const openEnrollForm = () => {
    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject before enrolling!')
      return
    }
    setShowEnrollForm(true)
  }

  const closeEnrollForm = () => {
    setShowEnrollForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      
      {/* Hero Section */}
      <section id="home" className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-800/90 to-secondary-900/95"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                LIVE Online Classes Registration Open
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow">
                Join India&apos;s Best Live Interactive Classes
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={openEnrollForm}
                  className="bg-white text-primary-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition transform hover:-translate-y-1"
                >
                  Enroll Now <span className="ml-2">→</span>
                </button>
                <a 
                  href="#courses" 
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary-600 transition text-center"
                >
                  View Courses
                </a>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold drop-shadow">10K+</div>
                  <div className="text-sm text-gray-200">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold drop-shadow">50+</div>
                  <div className="text-sm text-gray-200">Expert Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold drop-shadow">98%</div>
                  <div className="text-sm text-gray-200">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="rounded-2xl shadow-2xl transform hover:scale-105 transition duration-500 bg-gradient-to-br from-primary-400 to-primary-600 h-64 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Edu Altutors?</h2>
            <p className="text-xl text-gray-600">Experience the best online learning platform</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { icon: '📹', title: 'Live Interactive Classes', desc: 'Real-time interaction with expert teachers', gradient: 'from-primary-500 to-primary-600' },
              { icon: '👨‍🏫', title: 'Expert Faculty', desc: 'Learn from India\'s top educators', gradient: 'from-secondary-700 to-secondary-800' },
              { icon: '📖', title: 'Study Material', desc: 'Comprehensive notes and resources', gradient: 'from-green-500 to-green-600' },
              { icon: '❓', title: 'Instant Doubt Clearing', desc: 'Get your doubts solved immediately', gradient: 'from-yellow-500 to-orange-500' },
              { icon: '🏆', title: 'Proven Results', desc: '98% success rate in exams', gradient: 'from-red-500 to-pink-500' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg transition">
                <div className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Edu Altutors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Edu Altutors is dedicated to delivering high-quality LIVE interactive classes,
              helping students build strong concepts, improve scores, and learn with confidence.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Our Mission', desc: 'To make quality education accessible to every student through structured, engaging and exam-focused online learning.', gradient: 'from-primary-500 to-primary-600' },
              { icon: '👨‍🏫', title: 'Expert Faculty', desc: 'Learn from experienced, passionate teachers who simplify complex topics and keep sessions interactive.', gradient: 'from-secondary-700 to-secondary-800' },
              { icon: '😊', title: 'Student Success', desc: 'With regular tests, doubt clearing, and personalized feedback, we ensure students stay on track and achieve results.', gradient: 'from-green-500 to-green-600' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-8 bg-white rounded-2xl hover:shadow-lg transition">
                <div className={`bg-gradient-to-br ${item.gradient} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <CoursesSection 
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        onSubjectChange={updateSelectedSubjects}
        onEnrollClick={openEnrollForm}
      />

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Our students achieve extraordinary results</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { rank: '12', exam: 'AIR 12', year: 'NEET 2024', title: 'TN State First Rank in NEET', desc: 'Achieved with consistent guidance from Prof. Ravishankar', color: 'from-yellow-400 to-yellow-500' },
              { rank: '99.07%', exam: 'JEE Mains', year: '2024', title: '99.07% Percentile', desc: 'Excellence achieved under Prof. Balaji Sampath\'s mentorship', color: 'from-secondary-600 to-secondary-700' },
              { rank: '4', exam: 'AIR 4', year: 'JEE Advanced', title: 'JEE Advanced AIR 4', desc: 'Outstanding performance with dedicated preparation', color: 'from-primary-500 to-primary-600' },
            ].map((story, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl hover:shadow-lg transition">
                <div className="flex items-center mb-4">
                  <div className={`bg-gradient-to-br ${story.color} w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white`}>
                    {story.rank}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{story.exam}</h4>
                    <p className="text-sm text-gray-600">{story.year}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 font-semibold">{story.title}</p>
                <p className="text-sm text-gray-600">{story.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-xl text-gray-600">Hear from our successful students</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { initials: 'RS', name: 'Rahul Sharma', content: 'The live classes are incredibly interactive. The faculty is amazing and always ready to help. I scored AIR 250 in JEE Mains thanks to Edu Altutors!', gradient: 'from-primary-500 to-primary-600' },
              { initials: 'PK', name: 'Priya Krishnan', content: 'Best decision I made for my NEET preparation. The study materials are comprehensive and the doubt clearing sessions are super helpful.', gradient: 'from-secondary-700 to-secondary-800' },
              { initials: 'AM', name: 'Aditya Mehta', content: 'I scored 98% in my CBSE board exams. The teachers explain concepts so well that even the toughest topics become easy to understand.', gradient: 'from-green-500 to-green-600' },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="flex items-center mb-4">
                  <div className={`bg-gradient-to-br ${testimonial.gradient} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}>
                    {testimonial.initials}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <div className="text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">&quot;{testimonial.content}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10000', label: 'Happy Students' },
              { number: '50', label: 'Expert Teachers' },
              { number: '500', label: 'Live Classes' },
              { number: '98', label: 'Success Rate %' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}{idx === 0 ? '+' : idx === 2 ? '+' : idx === 3 ? '%' : '+'}</div>
                <p className="text-xl">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Form */}
      {showEnrollForm && (
        <EnrollmentForm 
          selectedSubjects={selectedSubjects}
          onClose={closeEnrollForm}
        />
      )}

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📞', title: 'Call Us', info: ['+1 (555) 123-4567', '+1 (555) 123-4568'], gradient: 'from-primary-500 to-primary-600' },
              { icon: '✉️', title: 'Email Us', info: ['support@edualtutors.com', 'info@edualtutors.com'], gradient: 'from-secondary-700 to-secondary-800' },
              { icon: '📍', title: 'Visit Us', info: ['123, Education Street', 'Bangalore, India'], gradient: 'from-green-500 to-green-600' },
            ].map((contact, idx) => (
              <div key={idx} className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className={`bg-gradient-to-br ${contact.gradient} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                  {contact.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h3>
                {contact.info.map((item, i) => (
                  <p key={i} className="text-gray-600">{item}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
