"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronDown, X, Package, ChevronLeft, ChevronRight, Atom, FlaskConical, Dna, Calculator, Sparkles, Trophy, Cpu, Zap, Target, Star } from 'lucide-react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

type Props = {
  variant?: 'full' | 'compact'
  onLinkClick?: () => void
  onlySubscribed?: boolean
  hideHeader?: boolean
}

const packagesData = [
  { title: 'Foundation Builder', subtitle: 'Strengthens core concepts through structured lessons and step-by-step learning to build confidence and consistency.', file: 'foundation1.jpeg', price: 4999 },
  { title: 'Mastery Accelerator', subtitle: 'Balances concept clarity, practice, and skill refinement to deepen understanding and improve academic performance.', file: 'mastery.png', price: 7499 },
  { title: 'Excellence Pro', subtitle: 'Accelerated learning, advanced topics, and critical-thinking challenges to maximize potential and competitive readiness.', file: 'excellence.png', price: 9999 },
  { title: 'Revision Before Board Exam', subtitle: 'Intensive, results-driven revision program focused on high-yield topics and exam patterns.', file: 'revision board.png', price: 5999 },
  { title: 'Revision Before Final Exam', subtitle: 'Structured revision to reinforce concepts and improve retention.', file: 'revision final exam.png', price: 4999 },
  { title: 'Live Classes', subtitle: 'Real-time learning with expert educators with instant doubt clearing and flexible scheduling.', file: 'live class.png', price: 5499 },
]

const CompetitiveCard = ({ pkg, user }: any) => {
  const router = useRouter()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/5] group/ecard cursor-pointer perspective-2000"
    >
      <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-br from-primary-400/20 to-transparent opacity-0 group-hover/ecard:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

      <div
        className="absolute inset-0 bg-[#0c1222]/90 backdrop-blur-3xl border border-white/20 rounded-[3.5rem] overflow-hidden shadow-[0_45px_100px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover/ecard:border-primary-400 group-hover/ecard:shadow-[0_0_80px_-10px_rgba(37,99,235,0.4)]"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <div className="absolute inset-0 z-0 opacity-0 group-hover/ecard:opacity-100 transition-opacity duration-1000">
          <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-primary-500/30 to-transparent animate-spin-slow" />
        </div>

        <div className="relative h-[60%] overflow-hidden" style={{ transform: "translateZ(40px)" }}>
          <motion.img
            src={`/Packages/${pkg.img}`}
            alt={pkg.title}
            className="w-full h-full object-cover grayscale-[40%] group-hover/ecard:grayscale-0 transition-all duration-[1.5s] ease-out scale-110 group-hover/ecard:scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-transparent to-transparent" />

          {user?.package === pkg.title && (
            <div className="absolute top-6 left-6 z-30 flex items-center gap-2 bg-primary-600 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] text-[7px] shadow-2xl">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Active Access
            </div>
          )}
        </div>

        <div className="px-8 pb-10 flex flex-col items-center text-center relative z-20 -mt-10" style={{ transform: "translateZ(70px)" }}>
          <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-500 mb-6 group-hover/ecard:scale-110 group-hover/ecard:bg-primary-600 group-hover/ecard:text-white transition-all duration-500">
            {pkg.title.includes('JEE') ? <Cpu className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover/ecard:text-primary-400 transition-colors">{pkg.title}</h3>
          <div className="flex flex-col items-center gap-1 mb-6">
            <span className="text-primary-500 font-black text-2xl tracking-tight">₹{pkg.price.toLocaleString()}</span>
            <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">Elite Engineering</span>
          </div>

          <button
            onClick={() => {
              if (user) {
                const updatedUser = { ...user, package: pkg.title, price: pkg.price }
                localStorage.setItem('currentUser', JSON.stringify(updatedUser))
                window.location.reload() // Reload to update all components
              } else {
                router.push(`/login?mode=signup&package=${encodeURIComponent(pkg.title)}&price=${pkg.price}`)
              }
            }}
            className="w-full py-4 bg-white text-slate-900 rounded-[2rem] flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all shadow-xl active:scale-95"
          >
            Access Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function PackagesSection({ variant = 'full', onLinkClick, onlySubscribed = false, hideHeader = false }: Props) {
  const router = useRouter()
  const [selectedPkg, setSelectedPkg] = React.useState<any>(null)
  const [grade, setGrade] = React.useState('')
  const [board, setBoard] = React.useState('')
  const [subjects, setSubjects] = React.useState<string[]>([])
  const [user, setUser] = React.useState<any>(null)

  const [scrollProgress, setScrollProgress] = React.useState(0)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const progress = target.scrollLeft / (target.scrollWidth - target.clientWidth)
    setScrollProgress(progress || 0)
  }

  const displayPackages = React.useMemo(() => {
    if (onlySubscribed && user?.package) {
      return packagesData.filter(pkg => pkg.title === user.package)
    }
    return packagesData
  }, [onlySubscribed, user?.package])

  const handleEnrollClick = (pkg: any) => {
    setSelectedPkg(pkg)
  }

  const handleProceed = () => {
    if (!grade || !board || subjects.length === 0) return

    if (user) {
      // User is already logged in, update their package in DB
      const updateData = {
        package: selectedPkg.title,
        price: selectedPkg.price.toString(),
        grade,
        board,
        subjects
      }

      fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
        .then(res => res.json())
        .then(data => {
          toast.success(`Successfully enrolled in ${selectedPkg.title}!`)
          setSelectedPkg(null)
          setSubjects([])
          // Refresh the page to update session data
          window.location.reload()
        })
        .catch(err => {
          console.error('Update Error:', err)
          toast.error('Failed to update subscription. Please try again.')
        })

      return
    }

    const url = `/login?mode=signup&package=${encodeURIComponent(selectedPkg.title)}&price=${selectedPkg.price}&grade=${grade}&board=${board}&subjects=${encodeURIComponent(subjects.join(','))}`
    if (onLinkClick) onLinkClick()
    router.push(url)
    setSelectedPkg(null)
    setSubjects([])
  }

  const scrollNext = () => {
    if (scrollRef.current) {
      const cardWidth = 380
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
    }
  }

  const scrollPrev = () => {
    if (scrollRef.current) {
      const cardWidth = 380
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' })
    }
  }

  if (variant === 'compact') {
    return (
      <div className="py-8">
        <div
          className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar scroll-smooth"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {displayPackages.map((pkg, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className={`flex-shrink-0 w-72 h-[450px] bg-primary-50 rounded-[2.5rem] overflow-hidden shadow-xl border-2 transition-all duration-500 cursor-pointer relative snap-start group ${user?.package === pkg.title ? 'border-primary-600' : 'border-gray-100'}`}
              onClick={() => {
                if (user?.package !== pkg.title) handleEnrollClick(pkg)
              }}
            >
              <img
                src={`/Packages/${encodeURIComponent(pkg.file)}`}
                alt={pkg.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-3/4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xl font-bold text-white leading-tight pr-4">{pkg.title}</h4>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-primary-600 transition-colors">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-white/70 text-sm line-clamp-3 mb-4 leading-relaxed">{pkg.subtitle}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <span className="text-white font-bold">₹{pkg.price.toLocaleString()}</span>
                  {user?.package === pkg.title && (
                    <span className="text-[10px] font-black uppercase text-primary-400">Your Plan</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {selectedPkg && (
            <PackageModal
              pkg={selectedPkg}
              onClose={() => setSelectedPkg(null)}
              grade={grade}
              setGrade={setGrade}
              board={board}
              setBoard={setBoard}
              subjects={subjects}
              setSubjects={setSubjects}
              onProceed={handleProceed}
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <section id="packages" className={`relative ${onlySubscribed ? 'py-0' : 'py-24'} bg-white overflow-hidden`}>
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-50 rounded-full blur-[120px] -mr-32 -mt-32 opacity-50" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-[100px] -ml-24 -mb-24 opacity-50" />

      <div className="max-w-[1440px] mx-auto relative z-10 px-6 md:px-12 lg:px-20">
        {!onlySubscribed && !hideHeader && (
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-0.5 w-8 bg-orange-500 rounded-full" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-orange-500">Available Plans</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.05] tracking-tight">
                Explore <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-rose-500 to-primary-600">Learning Packages</span>
              </h2>

              <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                Manage your subscription and explore new academic pathways tailored for your success.
              </p>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {displayPackages.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
              viewport={{ once: true }}
              className={`group relative perspective-1000 ${user?.package === pkg.title ? 'z-20' : 'z-10'}`}
              onClick={() => {
                if (user?.package !== pkg.title) handleEnrollClick(pkg)
              }}
            >
              <div className={`relative h-[540px] rounded-[3rem] overflow-hidden transition-all duration-500 bg-white border border-slate-100 shadow-xl flex flex-col ${user?.package === pkg.title ? 'ring-2 ring-primary-600' : 'group-hover:border-primary-200 group-hover:shadow-primary-600/10'}`}>

                <div className="h-[42%] relative overflow-hidden">
                  <motion.img
                    src={`/Packages/${encodeURIComponent(pkg.file)}`}
                    alt={pkg.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white" />

                  {user?.package === pkg.title && (
                    <div className="absolute top-6 left-6 z-30">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">
                        <Sparkles className="w-3 h-3" />
                        Active
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-8 flex flex-col relative bg-white">
                  <div className="mb-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-0.5 w-6 bg-primary-600/30 rounded-full" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-600">Premium Pathway</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight mb-4 transition-colors group-hover:text-primary-600">
                      {pkg.title}
                    </h3>
                    <p className="text-slate-500 font-medium text-xs leading-relaxed mb-6 line-clamp-2">
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Subscription</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">₹{pkg.price.toLocaleString()}</span>
                        <span className="text-slate-400 text-[10px] font-bold uppercase">/Yr</span>
                      </div>
                    </div>

                    {user?.package === pkg.title ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all active:scale-95">
                        Details <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!onlySubscribed && (
          <div className="px-6 md:px-12 lg:px-20 mt-24">
            <div className="relative p-12 md:p-20 bg-[#050810] rounded-[3.5rem] overflow-hidden group shadow-2xl border border-white/5">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 via-transparent to-indigo-600/5 blur-[120px]" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="max-w-2xl mb-16">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 mb-6"
                  >
                    <Trophy className="w-5 h-5 text-primary-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Elite Competitive Prep</span>
                  </motion.div>
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-8">
                    Master the <span className="text-primary-400 italic">Competitive Edge.</span>
                  </h2>
                  <p className="text-slate-400 font-medium text-lg leading-relaxed opacity-70">
                    India's most advanced AI-powered preparation modules for JEE & NEET.
                    Unrivaled technology for unprecedented results.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl perspective-2000">
                  <div className="group/card-outer transition-transform duration-500">
                    <CompetitiveCard
                      user={user}
                      pkg={{ title: 'JEE Mastery', price: 14999, img: 'jee-mastery.jpg' }}
                    />
                  </div>
                  <div className="group/card-outer transition-transform duration-500">
                    <CompetitiveCard
                      user={user}
                      pkg={{ title: 'NEET Prep', price: 14999, img: 'neet-prep.jpg' }}
                    />
                  </div>
                </div>

                <div className="mt-16 flex flex-wrap justify-center gap-4">
                  {['Adaptive AI Engine', 'Neural Recall Technology', 'Rank Prediction', 'Live Interactive Modules'].map(t => (
                    <span key={t} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white/50 uppercase tracking-widest hover:text-white transition-colors cursor-default">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .perspective-1000 { perspective: 1000px; }
        .perspective-2000 { perspective: 2000px; }
        .perspective-3000 { perspective: 3000px; }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 15s infinite linear; }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 20px); }
        }
        .animate-float-slow { animation: float-slow 20s infinite ease-in-out; }
        
        @keyframes float-slow-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, -20px); }
        }
        .animate-float-slow-reverse { animation: float-slow-reverse 22s infinite ease-in-out; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulse-slow 5s infinite ease-in-out; }
      `}</style>

      <AnimatePresence>
        {selectedPkg && (
          <PackageModal
            pkg={selectedPkg}
            onClose={() => setSelectedPkg(null)}
            grade={grade}
            setGrade={setGrade}
            board={board}
            setBoard={setBoard}
            subjects={subjects}
            setSubjects={setSubjects}
            onProceed={handleProceed}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function PackageModal({ pkg, onClose, grade, setGrade, board, setBoard, subjects, setSubjects, onProceed }: any) {
  const availableSubjects = [
    { name: 'Physics', icon: <Atom className="w-4 h-4" /> },
    { name: 'Chemistry', icon: <FlaskConical className="w-4 h-4" /> },
    { name: 'Biology', icon: <Dna className="w-4 h-4" /> },
    { name: 'Mathematics', icon: <Calculator className="w-4 h-4" /> }
  ]

  const toggleSubject = (s: string) => {
    if (subjects.includes(s)) {
      setSubjects(subjects.filter((item: string) => item !== s))
    } else {
      setSubjects([...subjects, s])
    }
  }

  const isComplete = grade && board && subjects.length > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-4xl relative overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-primary-50 p-6 md:p-7 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
          <button
            onClick={onClose}
            className="absolute right-5 top-5 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white hover:shadow-lg transition-all text-slate-400 hover:text-slate-900 z-20 group"
          >
            <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
          </button>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-600">Quick Config</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight tracking-tight">{pkg.title}</h3>
          </div>
        </div>
        <div className="p-6 pt-5 space-y-6">
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-5 h-5 rounded-md bg-primary-50 flex items-center justify-center text-primary-600 font-black text-[9px]">01</div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Select Grade</h4>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {[...Array(12)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setGrade((i + 1).toString())}
                  className={`h-9 rounded-lg font-black text-xs transition-all border-2 flex items-center justify-center ${grade === (i + 1).toString()
                    ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/20 active:scale-95'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </section>
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-5 h-5 rounded-md bg-primary-50 flex items-center justify-center text-primary-600 font-black text-[9px]">02</div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Choose Subjects</h4>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {availableSubjects.map((s) => (
                <button
                  key={s.name}
                  onClick={() => toggleSubject(s.name)}
                  className={`p-3 rounded-xl font-black text-[10px] transition-all border-2 flex items-center gap-3 group relative ${subjects.includes(s.name)
                    ? 'bg-white border-primary-600 text-primary-600 shadow-md active:scale-95'
                    : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-200'
                    }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${subjects.includes(s.name) ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-slate-300'
                    }`}>
                    {s.icon}
                  </div>
                  <span className="flex-1 text-left tracking-tight">{s.name}</span>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${subjects.includes(s.name) ? 'bg-primary-600 text-white scale-100' : 'bg-slate-200 text-transparent scale-0'
                    }`}>
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  </div>
                </button>
              ))}
            </div>
          </section>
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-5 h-5 rounded-md bg-primary-50 flex items-center justify-center text-primary-600 font-black text-[9px]">03</div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Select Board</h4>
            </div>
            <div className="flex gap-2.5">
              {['CBSE', 'ICSE'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBoard(b)}
                  className={`flex-1 py-3 rounded-xl font-black text-xs transition-all border-2 text-center uppercase tracking-[0.15em] ${board === b
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg active:scale-95'
                    : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-200'
                    }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </section>
        </div>
        <div className="p-6 bg-white border-t border-slate-50 flex-shrink-0">
          <button
            disabled={!isComplete}
            onClick={onProceed}
            className="w-full py-4 bg-primary-600 text-white rounded-xl font-black text-sm uppercase tracking-[0.15em] shadow-xl shadow-primary-600/30 transition-all hover:bg-primary-700 active:scale-[0.98] disabled:opacity-20 disabled:pointer-events-none group"
          >
            <span className="flex items-center justify-center gap-2.5">
              Confirm & Proceed
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
