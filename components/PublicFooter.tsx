'use client'

import { MessageCircle, Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PublicFooter() {
  return (
    <footer className="relative text-white overflow-hidden mt-20">
      {/* Background Image with sophisticated overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop"
          alt="Atmospheric Background"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-black/60" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-eduaitutors.png"
                alt="EduAiTutors"
                width={450}
                height={130}
                className="h-32 w-auto"
              />
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed max-w-xs text-sm">
              Empowering students with high-quality live interactive classes and AI-driven structured learning paths for guaranteed success.
            </p>
          </div>

          {/* Academic Pathways */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary-500 mb-6">Academic Pathways</h4>
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
                  <Link href="/packages" className="text-slate-300 hover:text-white transition-all font-medium text-sm tracking-tight flex items-center group">
                    <span className="w-0 h-0.5 bg-primary-600 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitive Entrance */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary-500 mb-6">Competitive Entrance</h4>
            <ul className="space-y-3">
              {[
                'JEE Mastery',
                'NEET Prep'
              ].map((item) => (
                <li key={item}>
                  <Link href="/packages" className="text-slate-300 hover:text-white transition-all font-medium text-sm tracking-tight flex items-center group">
                    <span className="w-0 h-0.5 bg-primary-600 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary-500 mb-6">Contact Support</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Call Us</p>
                  <p className="text-slate-200 font-bold tracking-tight text-sm">+91 98765 43210</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Email Support</p>
                  <a href="mailto:info@kiccpa.com" className="text-slate-200 font-bold tracking-tight text-sm hover:text-primary-500 transition-colors">
                    info@kiccpa.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Our Location</p>
                  <p className="text-slate-200 font-bold tracking-tight text-sm">Bangalore, India</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 font-medium text-[10px] tracking-wide">
            &copy; {new Date().getFullYear()} EduAiTutors. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
