'use client'

import { Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-8 group">
              <Image
                src="/logo-eduaitutors.png"
                alt="EduAiTutors"
                width={280}
                height={90}
                className="h-20 w-auto brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              Empowering students with high-quality live interactive classes and AI-driven structured learning paths for guaranteed success.
            </p>
          </div>

          {/* Academic Pathways */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">
              Academic Pathways
            </h4>
            <ul className="space-y-3">
              {[
                'Foundation Builder',
                'Mastery Accelerator',
                'Excellence Pro',
                'Revision Before Boards',
                'Revision Before Finals',
                'Live Classes'
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/packages"
                    className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitive Entrance */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">
              Competitive Entrance
            </h4>
            <ul className="space-y-3">
              {[
                'JEE Mastery',
                'NEET Prep'
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/packages"
                    className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5">
              Contact Support
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    Call Us
                  </p>
                  <p className="text-slate-200 font-medium text-sm">
                    +91 98765 43210
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    Email Support
                  </p>
                  <a
                    href="mailto:info@kiccpa.com"
                    className="text-slate-200 font-medium text-sm hover:text-orange-400 transition-colors"
                  >
                    info@kiccpa.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    Our Location
                  </p>
                  <p className="text-slate-200 font-medium text-sm">
                    Bangalore, India
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} EduAiTutors. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-slate-500 hover:text-orange-400 transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-500 hover:text-orange-400 transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
