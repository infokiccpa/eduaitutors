'use client'

import { useState } from 'react'
import { ShoppingCart, X } from 'lucide-react'

type Package = {
  id: number
  title: string
  description: string
  image: string
  price: number
  features: string[]
}

export default function FeaturedPackages() {
  const packages: Package[] = [
    {
      id: 1,
      title: 'Genius Package',
      description: 'Complete mastery plan with live classes, doubt support and test series for toppers.',
      image: '🧠',
      price: 9999,
      features: ['Live interactive classes', 'Dedicated doubt support', 'Advanced test series', 'Progress analytics'],
    },
    {
      id: 2,
      title: 'Advanced Student Plan',
      description: 'For serious learners who want strong concepts, regular tests and progress tracking.',
      image: '🚀',
      price: 7499,
      features: ['Concept mastery sessions', 'Weekly assessments', 'Mentor check-ins', 'Practice worksheets'],
    },
    {
      id: 3,
      title: 'Student Development Plan',
      description: 'Balanced plan focusing on fundamentals, practice and confidence building.',
      image: '📘',
      price: 4999,
      features: ['Fundamentals focus', 'Practice assignments', 'Monthly assessments', 'Confidence-building workshops'],
    },
  ]

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)

  return (
    <>
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-800 flex items-center justify-center text-6xl">
              {pkg.image}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.title}</h3>
              <p className="text-gray-600 mb-4">{pkg.description}</p>

              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setSelectedPackage(pkg)}
                  className="text-sm text-primary-600 font-medium hover:text-primary-700"
                >
                  Read more →
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Starting from</p>
                  <p className="text-lg font-semibold text-primary-600">₹{pkg.price.toLocaleString()}</p>
                </div>
                <button
                  aria-label="Add to cart"
                  className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {selectedPackage && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
          <button
            aria-label="Close"
            onClick={() => setSelectedPackage(null)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-700 rounded-xl flex items-center justify-center text-2xl">
              {selectedPackage?.image}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedPackage?.title}</h3>
              <p className="text-sm text-gray-500">₹{selectedPackage?.price.toLocaleString()} starting</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{selectedPackage?.description}</p>

          <div className="space-y-2 mb-6">
            {selectedPackage?.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="text-primary-600 mt-0.5">•</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Starting from</p>
              <p className="text-xl font-semibold text-primary-600">₹{selectedPackage?.price.toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPackage(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

