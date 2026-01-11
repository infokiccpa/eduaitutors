"use client"

import Link from 'next/link'
import React from 'react'

type Props = {
  variant?: 'full' | 'compact'
  onLinkClick?: () => void
}

const packagesData = [
  { title: 'Foundation Builder', subtitle: 'Strengthens core concepts through structured lessons and step-by-step learning to build confidence and consistency.', file: 'foundation1.jpeg' },
  { title: 'Mastery Accelerator', subtitle: 'Balances concept clarity, practice, and skill refinement to deepen understanding and improve academic performance.', file: 'mastery.png' },
  { title: 'Excellence Pro', subtitle: 'Accelerated learning, advanced topics, and critical-thinking challenges to maximize potential and competitive readiness.', file: 'excellence.png' },
  { title: 'Revision Before Board Exam', subtitle: 'Intensive, results-driven revision program focused on high-yield topics and exam patterns.', file: 'revision board.png' },
  { title: 'Revision Before Final Exam', subtitle: 'Structured revision to reinforce concepts and improve retention.', file: 'revision final exam.png' },
  { title: 'Live Classes', subtitle: 'Real-time learning with expert educators with instant doubt clearing and flexible scheduling.', file: 'live class.png' },
]

const olympiad = [
  { title: 'Olympiad Achiever', subtitle: 'For competitive spirits targeting Math, Science, and Cyber Olympiads. Focuses on high-order thinking skills and advanced problem-solving.', file: 'olympaid achiever.png' },
  { title: 'Coding & AI Junior', subtitle: 'Future-ready skills for young minds. Introduction to programming logic, Python basics, and AI concepts.', file: 'excellence.png' },
]

export default function PackagesSection({ variant = 'full', onLinkClick }: Props) {
  if (variant === 'compact') {
    return (
      <div className="py-6">
        <div className="grid grid-cols-3 gap-4">
          {packagesData.slice(0, 3).map((pkg, idx) => (
            <Link
              key={idx}
              href="/packages"
              onClick={onLinkClick}
              className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition text-center"
            >
              <div className="h-24 bg-amber-50 overflow-hidden">
                <img src={`/Packages/${encodeURIComponent(pkg.file)}`} alt={pkg.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold text-gray-900">{pkg.title}</h4>
              </div>
            </Link>
          ))}
        </div>
        {/* <div className="text-center mt-4">
          <Link href="/packages" onClick={onLinkClick} className="text-sm text-primary-600 font-medium">View all packages →</Link>
        </div> */}
      </div>
    )
  }

  return (
    <section id="packages" className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="w-full bg-gradient-to-r from-primary-600 to-secondary-900 py-10 rounded-3xl">
          <div className="text-center text-white">
            <h2 className="text-2xl font-extrabold">Packages for <span className="text-amber-400">Grade 1 to 12</span></h2>
            <p className="mt-2 text-white/90">Choose the perfect learning plan tailored to your goals</p>
          </div>
        </div>
      </div>

      <div className="-mt-6 pb-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-20 relative z-20">
            {packagesData.map((pkg, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition relative flex flex-col items-center text-center">
                <div className="w-full h-40 bg-amber-50 rounded-t-2xl mb-4 overflow-hidden flex items-center justify-center">
                  <img src={`/Packages/${encodeURIComponent(pkg.file)}`} alt={pkg.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-6 text-sm">{pkg.subtitle}</p>
                <Link href="/packages" onClick={onLinkClick} className="inline-block bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-medium">Choose Plan</Link>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Olympiad & Specialty</h3>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {olympiad.map((pkg, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition relative flex flex-col items-center text-center">
                <div className="w-full h-40 bg-amber-50 rounded-t-2xl mb-4 overflow-hidden flex items-center justify-center">
                  <img src={`/Packages/${encodeURIComponent(pkg.file)}`} alt={pkg.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{pkg.title}</h4>
                <p className="text-gray-600 mb-6 text-sm">{pkg.subtitle}</p>
                <Link href="/packages" onClick={onLinkClick} className="inline-block bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-medium">Choose Plan</Link>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="w-full bg-gradient-to-r from-primary-600 to-secondary-900 py-10 rounded-3xl">
          <div className="text-center text-white">
            <h2 className="text-2xl font-extrabold">Competitive Exams <span className="text-amber-400">Packages</span></h2>
            <p className="mt-2 text-white/90">Expert-led preparation for JEE, NEET, and State Entrance Exams</p>
          </div>
        </div>
      </div>

      <div className="-mt-6 pb-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mt-20 relative z-20">
            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition relative flex flex-col items-center text-center">
              <div className="w-full h-40 bg-amber-50 rounded-t-2xl mb-4 overflow-hidden flex items-center justify-center">
                <img src={`/Packages/${encodeURIComponent('jee.png')}`} alt="JEE" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">JEE Main & Advanced Mastery</h3>
              <p className="text-gray-600 text-sm mb-4">For engineering aspirants aiming for top IITs and NITs. Comprehensive coverage of Physics, Chemistry, and Math with high-level problem-solving and mock assessments.</p>
              <Link href="/packages" onClick={onLinkClick} className="inline-block bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-medium">Choose Plan</Link>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition relative flex flex-col items-center text-center">
              <div className="w-full h-40 bg-amber-50 rounded-t-2xl mb-4 overflow-hidden flex items-center justify-center">
                <img src={`/Packages/${encodeURIComponent('neet.png')}`} alt="NEET" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">NEET Medical Prep</h3>
              <p className="text-gray-600 text-sm mb-4">For aspiring doctors targeting top medical colleges. Deep dive into Biology, Physics, and Chemistry with NCERT-focused learning and extensive practice tests.</p>
              <Link href="/packages" onClick={onLinkClick} className="inline-block bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-medium">Choose Plan</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
