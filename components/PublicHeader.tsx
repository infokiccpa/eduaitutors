'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, X, ArrowRight, Video, GraduationCap, BookOpen, HelpCircle, Trophy, Target, Smile, Star, LogOut, User, MoreVertical, LayoutDashboard } from 'lucide-react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import PackagesSection from '@/components/PackagesSection'
import PublicFooter from '@/components/PublicFooter'
import { toast } from 'react-toastify'
import { useSession, signOut } from 'next-auth/react'

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [fullScreenDropdown, setFullScreenDropdown] = useState<string | null>(null)
  const { data: session } = useSession()
  const user = session?.user
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // User is handled by next-auth now

  const handleLogout = async () => {
    await signOut({ redirect: false })
    toast.success('Logged out successfully')
    router.push('/')
  }

  const studyMenuItems = [
    {
      title: 'Subject Areas',
      href: '/courses',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
      description: 'Subject areas',
      subItems: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']
    },
    {
      title: 'Boards',
      href: '/courses',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      description: 'Education Boards',
      subItems: ['CBSE', 'ICSE']
    },
    {
      title: 'Packages',
      href: '/#packages',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
      description: 'Learning Packages',
      subItems: ['Genius Package', 'Advanced Student Plan', 'Student Development Plan']
    },
  ]

  const handleDropdownToggle = (menu: string) => {
    setFullScreenDropdown((current) => {
      const next = current === menu ? null : menu
      document.body.style.overflow = next ? 'hidden' : 'auto'
      return next
    })
  }

  const handleDropdownClose = () => {
    setFullScreenDropdown(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 py-4 md:px-8 ${isScrolled ? 'md:py-4' : 'md:py-6'
          }`}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-primary-600 origin-left z-[60]"
          style={{ scaleX }}
        />

        <div
          className={`max-w-[90rem] mx-auto transition-all duration-500 border border-transparent bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2rem] border-white/40 px-6`}
        >
          <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-16 md:h-20' : 'h-20 md:h-32'
            }`}>
            <Link href="/" className="flex items-center space-x-3 group outline-none">
              <Image
                src="/logo-eduaitutors.png"
                alt="EduAiTutors"
                width={320}
                height={96}
                priority
                className={`w-auto transition-all duration-500 group-hover:scale-105 ${isScrolled ? 'h-12 md:h-16' : 'h-16 md:h-28'
                  }`}
              />
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {[
                { name: 'Home', href: '/' },
                { name: 'Courses', href: '/courses' },
                { name: 'Features', href: '/features' },
                { name: 'About', href: '/#about' },
                { name: 'Packages', href: '/packages' }
              ].map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <div key={item.name} className="relative group/nav">
                    <Link
                      href={item.href}
                      onClick={handleDropdownClose}
                      className={`px-5 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${isActive
                        ? 'text-primary-600 bg-primary-50/50 shadow-[0_4px_12px_rgba(0,0,0,0.03)]'
                        : 'text-gray-900 hover:text-primary-600'
                        }`}
                    >
                      {item.name}
                    </Link>
                  </div>
                )
              })}

              <div className="h-4 w-[1px] bg-gray-200 mx-4" />

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 bg-gray-50/50 backdrop-blur-md border border-gray-100/50 rounded-full px-2 py-2 hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-primary-600/20">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-3xl border border-gray-100 overflow-hidden z-20 p-2"
                        >
                          <div className="px-6 py-6 bg-gray-50/50 rounded-[1.5rem] mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600 block mb-2">Member Account</span>
                            <h4 className="text-lg font-black text-gray-900 leading-none">{user.name || 'User'}</h4>
                            <p className="text-xs text-gray-500 mt-2 truncate font-medium">{user.email}</p>
                          </div>

                          <div className="space-y-1">
                            <Link
                              href="/dashboard"
                              className="flex items-center space-x-3 px-6 py-4 text-sm font-black text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all rounded-xl"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                              <span>Dashboard Overview</span>
                            </Link>

                            <button
                              onClick={() => {
                                setIsProfileOpen(false)
                                handleLogout()
                              }}
                              className="w-full flex items-center space-x-3 px-6 py-4 text-sm font-black text-red-500 hover:bg-red-50 transition-all rounded-xl text-left"
                            >
                              <LogOut className="w-5 h-5 flex-shrink-0" />
                              <span>Sign Out Profile</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/?action=register"
                    className="px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest text-gray-900 hover:bg-gray-100 transition-all"
                  >
                    Register
                  </Link>
                  <Link
                    href="/login"
                    className="bg-primary-600 text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest hover:bg-primary-700 transition shadow-lg shadow-primary-600/30 active:scale-95"
                  >
                    Login
                  </Link>
                </div>
              )}
            </nav>

            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isScrolled ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-900'
                  } shadow-sm border border-gray-100`}
              >
                <div className="w-6 flex flex-col items-end gap-1.5">
                  <span className="w-full h-0.5 bg-current rounded-full" />
                  <span className="w-2/3 h-0.5 bg-current rounded-full" />
                  <span className="w-full h-0.5 bg-current rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Dropdown - Oxford International Style with Large Image Cards */}
      {fullScreenDropdown === 'study' && (
        <div
          className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto dropdown-content"
          style={{ top: '80px' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-dropdown-enter">
            <button
              onClick={handleDropdownClose}
              className="flex items-center gap-2 text-primary-600 font-black uppercase tracking-widest mb-12 hover:gap-4 transition-all group"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
              <span>Back to Main</span>
            </button>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Study with Us</h2>
            </div>

            {/* Large Image Cards - Oxford International Style */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {studyMenuItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={handleDropdownClose}
                  className="group relative block overflow-hidden rounded-lg h-96 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Background Image with Fallback */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Fallback gradient background */}
                    <div className={`absolute inset-0 ${idx === 0 ? 'bg-gradient-to-br from-primary-400 to-primary-600' :
                      idx === 1 ? 'bg-gradient-to-br from-secondary-700 to-secondary-900' :
                        'bg-gradient-to-br from-orange-400 to-orange-600'
                      }`} />
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {item.title}
                    </h3>

                    {/* Arrow Icon */}
                    <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Hover Description */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.subItems.map((subItem, subIdx) => (
                        <span key={subIdx} className="text-xs text-primary-600 font-medium">
                          {subItem}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom Section with Quick Links */}
            <div className="pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="/courses"
                      onClick={handleDropdownClose}
                      className="text-gray-600 hover:text-primary-600 transition py-2"
                    >
                      All Courses
                    </Link>
                    <Link
                      href="/#packages"
                      onClick={handleDropdownClose}
                      className="text-gray-600 hover:text-primary-600 transition py-2"
                    >
                      View Packages
                    </Link>
                    <Link
                      href="/login"
                      onClick={handleDropdownClose}
                      className="text-gray-600 hover:text-primary-600 transition py-2"
                    >
                      How to Apply
                    </Link>
                    <Link
                      href="/packages"
                      onClick={handleDropdownClose}
                      className="text-gray-600 hover:text-primary-600 transition py-2"
                    >
                      Packages
                    </Link>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Get Started</h3>
                  <p className="text-gray-600 mb-4">
                    Explore our courses and find the perfect fit for your learning goals.
                  </p>
                  <Link
                    href="/login"
                    onClick={handleDropdownClose}
                    className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* About Dropdown */}
      {
        fullScreenDropdown === 'about' && (
          <div
            className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto dropdown-content"
            style={{ top: '80px' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-dropdown-enter">
              <button
                onClick={handleDropdownClose}
                className="flex items-center gap-2 text-primary-600 font-black uppercase tracking-widest mb-12 hover:gap-4 transition-all group"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
                <span>Back to Main</span>
              </button>
              <div className="mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  About EduAiTutors
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  EduAiTutors is dedicated to delivering high-quality LIVE interactive classes,
                  helping students build strong concepts, improve scores, and learn with confidence.
                </p>
              </div>

              {/* About Cards Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                  <p className="text-gray-600">
                    To make quality education accessible to every student through structured,
                    engaging and exam-focused online learning.
                  </p>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Faculty</h3>
                  <p className="text-gray-600">
                    Learn from experienced, passionate teachers who simplify complex topics and
                    keep sessions interactive.
                  </p>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl hover:shadow-lg transition">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Smile className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Student Success</h3>
                  <p className="text-gray-600">
                    With regular tests, doubt clearing, and personalized feedback, we ensure
                    students stay on track and achieve results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Features Dropdown */}
      {
        fullScreenDropdown === 'features' && (
          <div
            className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto dropdown-content"
            style={{ top: '80px' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-dropdown-enter">
              <button
                onClick={handleDropdownClose}
                className="flex items-center gap-2 text-primary-600 font-black uppercase tracking-widest mb-12 hover:gap-4 transition-all group"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
                <span>Back to Main</span>
              </button>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Why Choose Edu Altutors?</h2>
                <p className="text-xl text-gray-600 text-center">Experience the best online learning platform</p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Live Interactive Classes</h3>
                  <p className="text-gray-600">Real-time interaction with expert teachers</p>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Faculty</h3>
                  <p className="text-gray-600">Learn from India's top educators</p>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl hover:shadow-lg transition">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Study Material</h3>
                  <p className="text-gray-600">Comprehensive notes and resources</p>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl hover:shadow-lg transition">
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HelpCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Doubt Clearing</h3>
                  <p className="text-gray-600">Get your doubts solved immediately</p>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl hover:shadow-lg transition">
                  <div className="bg-gradient-to-br from-red-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Proven Results</h3>
                  <p className="text-gray-600">98% success rate in exams</p>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Testimonials Dropdown */}
      {
        fullScreenDropdown === 'testimonials-section' && (
          <div
            className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto dropdown-content"
            style={{ top: '80px' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-dropdown-enter">
              <div className="mb-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Students Say</h2>
                <p className="text-xl text-gray-600">Hear from our successful students</p>
              </div>

              {/* Testimonials Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      RS
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900">Rahul Sharma</h4>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">&quot;The live classes are incredibly interactive. The faculty is amazing and always ready to help. I scored AIR 250 in JEE Mains thanks to EduAiTutors!&quot;</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      PK
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900">Priya Krishnan</h4>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">&quot;Best decision I made for my NEET preparation. The study materials are comprehensive and the doubt clearing sessions are super helpful.&quot;</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                      AM
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900">Aditya Mehta</h4>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">&quot;I scored 98% in my CBSE board exams. The teachers explain concepts so well that even the toughest topics become easy to understand.&quot;</p>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Mobile Menu */}
      {
        mobileMenuOpen && (
          <div className="lg:hidden bg-gray-50 border-t fixed inset-0 z-50" style={{ top: '80px' }}>
            <div className="px-4 py-4 space-y-3 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <Link href="/" className="block text-gray-700 hover:text-primary-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/courses" className="block text-gray-700 hover:text-primary-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
              <Link href="/features" className="block text-gray-700 hover:text-primary-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="/#about" className="block text-gray-700 hover:text-primary-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/#testimonials" className="block text-gray-700 hover:text-primary-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Testimonials</Link>
              {user ? (
                <div className="pt-4 border-t mt-4 space-y-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">Go to Dashboard</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t mt-4">
                  <Link
                    href="/?action=register"
                    className="block text-gray-700 hover:text-primary-600 font-medium mb-3 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link href="/login" className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-primary-700 transition" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )
      }
    </>
  )
}
