'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import QuizProgress from '@/components/QuizProgress'
import LearningProgress from '@/components/LearningProgress'
import Calendar from '@/components/Calendar'
import WhyChooseUs from '@/components/WhyChooseUs'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser')
    if (!loggedInUser) {
      router.push('/login')
    } else {
      setUser(JSON.parse(loggedInUser))
    }
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-16 p-8">
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back, {user.name}!</h1>
              <h3 className="text-xl text-gray-600">Continue your learning journey</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <QuizProgress />
            <LearningProgress />
            <Calendar />
          </div>
          <WhyChooseUs />
          <Testimonials />
        </main>
      </div>
      <Footer />
    </div>
  )
}

