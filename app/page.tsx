'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import HeroSlider from '@/components/HeroSlider'
import CoursesSection from '@/components/CoursesSection'
import EnrollmentForm from '@/components/EnrollmentForm'
import PackagesSection from '@/components/PackagesSection'
import WhyChooseSection from '@/components/WhyChooseSection'
import AIPreviewSection from '@/components/AIPreviewSection'
import AboutSection from '@/components/AboutSection'
import FeaturesSection from '@/components/FeaturesSection'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import LiveClassStrip from '@/components/LiveClassStrip'
import { ArrowRight, Sparkles, User, ShieldCheck } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      {/* Live Class Strip Banner */}
      <Suspense fallback={null}>
        <LiveClassStrip />
      </Suspense>

      {/* Hero Section */}
      <HeroSlider>
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-5 py-2 bg-primary-600/20 backdrop-blur-md text-primary-400 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 border border-primary-500/30">
              Next-Gen AI Learning
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tighter text-white drop-shadow-2xl">
              Smart Learning. <br />
              <span className="text-primary-500">Powered by AI.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-3xl mx-auto font-medium leading-relaxed">
              Find the right learning pathway for your goals with expert-led courses,
              interactive classes, and personalized support designed for your excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/packages"
                className="group bg-primary-600 hover:bg-primary-500 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary-600/40 flex items-center gap-3 hover:-translate-y-1 active:scale-95"
              >
                Explore All packages
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/courses"
                className="px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest text-white border border-white/20 hover:bg-white hover:text-black transition-all backdrop-blur-sm"
              >
                View Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </HeroSlider>

      <PackagesSection variant="full" />

      <WhyChooseSection />

      {/* Courses Section - Banner to move to /courses */}
      <CoursesSection />

      <AIPreviewSection />



      <AboutSection />

      {/* Lead Capture Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...fadeIn} className="text-center mb-12">
            <span className="inline-block px-5 py-2 bg-primary-600/10 backdrop-blur-sm text-primary-700 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
              🎯 Take The First Step
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Get personalized guidance from our experts. Limited seats for this month!
            </p>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <LeadCaptureForm variant="inline" />
          </motion.div>
        </div>
      </section>

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
