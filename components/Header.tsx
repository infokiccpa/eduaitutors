'use client'

import { Search, Bell, LogOut, Settings, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session } = useSession()
  const user = session?.user as any
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()

  // User is handled by next-auth now

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image
                src="/logo-eduaitutors.png"
                alt="EduAiTutors"
                width={150}
                height={50}
                className="object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 w-80 transition"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition">
                <Settings className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
              <div className="hidden text-right md:block">
                <p className="text-sm font-black text-gray-900 leading-tight">{user?.name || 'User'}</p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${user?.role === 'superadmin' ? 'bg-red-100 text-red-600' :
                      user?.role === 'admin' ? 'bg-amber-100 text-amber-600' :
                        user?.role === 'mentor' ? 'bg-indigo-100 text-indigo-600' :
                          user?.role === 'parent' ? 'bg-emerald-100 text-emerald-600' :
                            'bg-slate-100 text-slate-500'
                    }`}>
                    {user?.role || 'Student'}
                  </span>
                  <p className="text-[10px] font-bold text-gray-400 capitalize">{user?.package || 'Global Access'}</p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:shadow-primary-600/20 transform hover:scale-110 transition-all cursor-pointer"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden"
                      >
                        <div className="px-5 py-4 border-b border-gray-50 bg-slate-50/50">
                          <p className="text-sm font-black text-slate-900">{user?.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user?.email}</p>
                        </div>

                        <div className="p-2">
                          <Link href="/subscription" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all group">
                            <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            My Profile
                          </Link>
                          <Link href="/security" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all group">
                            <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Security Settings
                          </Link>
                        </div>

                        <div className="p-2 border-t border-gray-50">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                          >
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

