'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">EA</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary-600 font-medium transition">Home</a>
            <a href="#courses" className="text-gray-700 hover:text-primary-600 font-medium transition">Courses</a>
            <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition">Features</a>
            <a href="#about" className="text-gray-700 hover:text-primary-600 font-medium transition">About</a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary-600 font-medium transition">Testimonials</a>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition">
                Register Now
              </button>
              <Link href="/login" className="px-6 py-3 rounded-full border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition">
                Login
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <a href="#home" className="block text-gray-700 hover:text-primary-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#courses" className="block text-gray-700 hover:text-primary-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Courses</a>
            <a href="#features" className="block text-gray-700 hover:text-primary-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#about" className="block text-gray-700 hover:text-primary-600 font-medium" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#testimonials" className="block text-gray-700 hover:text-primary-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
            <button className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-full font-semibold text-center">
              Register Now
            </button>
            <Link href="/login" className="block w-full px-6 py-3 rounded-full border border-primary-600 text-primary-600 font-semibold text-center hover:bg-primary-50 transition" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

