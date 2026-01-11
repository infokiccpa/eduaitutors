'use client'

import { MessageCircle, Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Social */}
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/logo-eduaitutors.png"
                alt="EduAiTutors - Path to Success"
                width={320}
                height={100}
                className="h-24 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-400">
              Empowering students with high-quality live interactive classes and structured learning paths.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#courses" className="text-gray-400 hover:text-white transition">
                  Courses
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition">
                  About
                </a>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-bold mb-4">Courses</h4>
            <ul className="space-y-2">
              <li>
                <a href="#courses" className="text-gray-400 hover:text-white transition">
                  Physics
                </a>
              </li>
              <li>
                <a href="#courses" className="text-gray-400 hover:text-white transition">
                  Chemistry
                </a>
              </li>
              <li>
                <a href="#courses" className="text-gray-400 hover:text-white transition">
                  Biology
                </a>
              </li>
              <li>
                <a href="#courses" className="text-gray-400 hover:text-white transition">
                  Mathematics
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" /> +91 98765 43210
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:info@edualtutors.com" className="hover:text-white transition">
                  info@edualtutors.com
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Bangalore, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025-2026 Edu Altutors. All rights reserved. | Designed with ❤️ for Education</p>
        </div>
      </div>
    </footer>
  )
}
