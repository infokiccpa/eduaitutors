'use client'

import { useState } from 'react'
import Link from 'next/link'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import HeroSlider from '@/components/HeroSlider'
import CoursesSection from '@/components/CoursesSection'
import EnrollmentForm from '@/components/EnrollmentForm'
import PackagesSection from '@/components/PackagesSection'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero Section */}
      <HeroSlider>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-2xl md:text-4xl font-bold mb-6 leading-tight drop-shadow-lg"
          >
            Smart Learning. Powered by AI. Designed for Your Success.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow"
          >
            Find the right learning pathway for your goals with expert-led courses, interactive classes, and personalized support.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/packages"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg hover:shadow-xl inline-flex items-center justify-center transform hover:scale-105 active:scale-95"
            >
              Explore packages
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </HeroSlider>

      <PackagesSection variant="full" />

      {/* Courses Section - RESTORED FUNCTIONALITY */}
      <CoursesSection
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        onSubjectChange={updateSelectedSubjects}
        onEnrollClick={openEnrollForm}
      />

      {/* Why Study With Us */}
      <motion.section
        {...fadeIn}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 {...fadeIn} className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Study With Us</motion.h2>
            <motion.p {...fadeIn} className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re a new-age learning platform built around AI models and AI-trained tutors to make concepts clear, fast and engaging.
            </motion.p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            {[
              { title: 'AI-Powered Learning', desc: 'Every course is designed around smart AI models that personalise practice, explain doubts and adapt to how you learn.', img: '/whystudy1.png' },
              { title: 'AI-Trained Tutors', desc: 'Human tutors are trained to work with AI tools, so you get both expert guidance and instant AI support in every session.', img: '/whystudy2.png' },
              { title: 'Always-On Help', desc: 'Ask questions any time, get AI-powered explanations in seconds, and use our practice tools whenever you want to study.', img: '/whystudy3.png' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="text-center p-6 rounded-2xl hover:bg-primary-50 transition-colors duration-300 group"
              >
                <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                  <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">{item.title}</div>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Student Testimonials removed as per request */}

      {/* Enrollment Form - RESTORED */}
      {showEnrollForm && (
        <EnrollmentForm
          selectedSubjects={selectedSubjects}
          onClose={closeEnrollForm}
        />
      )}
      <PublicFooter />
    </div>
  )
}
