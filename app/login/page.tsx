'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff, Github, Chrome, ShieldCheck, User, CreditCard, ChevronRight, CheckCircle, Sparkles } from 'lucide-react'
import { toast } from 'react-toastify'
import { signIn, useSession } from 'next-auth/react'

function LoginForm() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const packageName = searchParams.get('package')
  const packagePrice = searchParams.get('price')
  const grade = searchParams.get('grade')
  const board = searchParams.get('board')
  const subjectsStr = searchParams.get('subjects')
  const subjects = subjectsStr ? subjectsStr.split(',') : []

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(mode !== 'signup')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Details, 2: Payment
  const router = useRouter()

  useEffect(() => {
    // Sync isLogin with mode param if it changes
    setIsLogin(mode !== 'signup')
    setStep(1)
  }, [mode])

  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      handleAuth()
    } else {
      if (step === 1) {
        setStep(2)
      } else {
        handleAuth()
      }
    }
  }

  const handleAuth = async () => {
    setIsLoading(true)

    try {
      if (isLogin) {
        // NextAuth Login logic
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password
        })

        if (res?.error) {
          toast.error(res.error)
          setIsLoading(false)
        } else {
          toast.success('Welcome back! Logging you in...')
          setTimeout(() => router.push('/dashboard'), 1000)
        }
      } else {
        // Registration Logic via our API
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            package: packageName,
            price: packagePrice,
            grade,
            board,
            subjects
          })
        })

        const data = await res.json()

        if (res.ok) {
          toast.success('Registration successful! Please sign in.')
          setIsLogin(true)
          setStep(1)
          setIsLoading(false)
        } else {
          toast.error(data.message || 'Registration failed')
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.error('Auth Error:', error)
      toast.error('Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white selection:bg-primary-100">
      {/* Left Side: Visual Branding */}
      <div className="hidden lg:relative lg:flex flex-col items-center justify-center p-12 bg-secondary-900 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full -ml-48 -mb-48 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="mb-12">
            <Image
              src="/logo-eduaitutors.png"
              alt="EduAiTutors"
              width={350}
              height={120}
              className="object-contain brightness-0 invert"
            />
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Elevating Education <br />
            <span className="text-primary-500">Powered by AI.</span>
          </h1>

          <div className="space-y-6 text-gray-300 text-lg">
            <p className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary-500">
                <ShieldCheck className="w-5 h-5" />
              </span>
              Personalized Learning Pathways
            </p>
            <p className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary-500">
                <ShieldCheck className="w-5 h-5" />
              </span>
              24/7 AI-Trained Support
            </p>
            <p className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary-500">
                <ShieldCheck className="w-5 h-5" />
              </span>
              Interactive Advanced Curriculum
            </p>
          </div>
        </motion.div>

        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
            alt="Learning"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Side: Login/Signup Form */}
      <div className="flex items-center justify-center p-8 bg-white relative overflow-hidden">
        {/* Background Gradients for depth */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] -ml-40 -mb-40 opacity-40" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg relative z-10"
        >
          <div className="mb-8 block lg:hidden">
            <Link href="/">
              <Image
                src="/logo-eduaitutors.png"
                alt="EduAiTutors"
                width={200}
                height={64}
                className="object-contain"
              />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-10">
                  <Link
                    href="/"
                    className="inline-flex items-center text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors group mb-8"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                  </Link>

                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-12 bg-primary-600 rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tighter leading-tight">
                      {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h2>
                    <p className="text-slate-500 font-medium text-lg max-w-sm">
                      {isLogin
                        ? 'Join thousands of students on their path to success.'
                        : 'Start your smart learning journey today with EduAiTutors.'}
                    </p>
                  </div>

                  {!isLogin && packageName && (
                    <div className="mt-8 relative group">
                      <div className="absolute inset-0 bg-primary-600/20 blur-2xl rounded-3xl group-hover:bg-primary-600/30 transition-all opacity-50" />
                      <div className="relative p-6 bg-white border-2 border-primary-100 rounded-[2rem] flex items-center justify-between shadow-xl shadow-primary-600/5 transition-transform hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-primary-600/10 flex items-center justify-center text-primary-600">
                            <CheckCircle className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="text-[10px] text-primary-600 font-black uppercase tracking-[0.3em] mb-1">Selected Plan</p>
                            <h4 className="text-slate-900 font-black text-xl leading-tight">{packageName}</h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-primary-600 font-black text-2xl tracking-tighter">₹{Number(packagePrice).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleNextStep} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Full Name</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-focus-within:bg-primary-50 group-focus-within:text-primary-600 transition-all">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          required={!isLogin}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-16 pr-6 py-5 bg-slate-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600/20 active:bg-white outline-none transition-all font-bold text-slate-900 text-lg shadow-sm focus:shadow-xl focus:shadow-primary-600/5 placeholder:text-slate-300"
                          placeholder="Your official name"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-focus-within:bg-primary-50 group-focus-within:text-primary-600 transition-all">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600/20 active:bg-white outline-none transition-all font-bold text-slate-900 text-lg shadow-sm focus:shadow-xl focus:shadow-primary-600/5 placeholder:text-slate-300"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Secret Password</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-focus-within:bg-primary-50 group-focus-within:text-primary-600 transition-all">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-16 pr-14 py-5 bg-slate-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600/20 active:bg-white outline-none transition-all font-bold text-slate-900 text-lg shadow-sm focus:shadow-xl focus:shadow-primary-600/5 placeholder:text-slate-300"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-primary-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="w-full py-6 bg-primary-600 text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary-600/30 hover:bg-primary-700 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        isLogin ? 'Sign In' : (packageName ? 'Continue to Payment' : 'Create Account')
                      )}
                      {!isLogin && packageName && !isLoading && (
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      )}
                    </span>
                  </motion.button>
                </form>

                <div className="mt-10 text-center">
                  <p className="text-slate-500 font-medium">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="font-black text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest text-xs"
                    >
                      {isLogin ? 'Sign up free' : 'Sign in here'}
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-10">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center text-sm font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors group mb-8"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Details
                  </button>

                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-12 bg-primary-600 rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter leading-tight">Secure Payment</h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">Complete your enrollment in {packageName}</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 opacity-20 blur-3xl -mr-16 -mt-16" />
                  <h3 className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em] mb-6">Enrollment Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-white">
                      <span className="font-medium text-slate-400">Selected Plan</span>
                      <span className="font-black text-lg">{packageName}</span>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-white/10 group-hover:border-primary-600/30 transition-colors">
                      <span className="text-slate-400 font-medium text-lg">Total Amount</span>
                      <span className="text-primary-500 text-3xl font-black tracking-tighter flex items-center gap-1">
                        <span className="text-base text-primary-600/50">INR</span>
                        ₹{Number(packagePrice).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleNextStep} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Card Holder Name</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-focus-within:bg-primary-50 group-focus-within:text-primary-600 transition-all">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        defaultValue={name}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600/20 active:bg-white outline-none transition-all font-bold text-slate-900 text-lg shadow-sm focus:shadow-xl focus:shadow-primary-600/5 placeholder:text-slate-300"
                        placeholder="Name as on card"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Card Number</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-focus-within:bg-primary-50 group-focus-within:text-primary-600 transition-all">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
                          let matches = v.match(/\d{4,16}/g)
                          let match = matches && matches[0] || ''
                          let parts = []
                          for (let i = 0, len = match.length; i < len; i += 4) {
                            parts.push(match.substring(i, i + 4))
                          }
                          if (parts.length) { e.target.value = parts.join(' ') } else { e.target.value = v }
                        }}
                        className="w-full pl-16 pr-6 py-5 bg-slate-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600/20 active:bg-white outline-none transition-all font-bold text-slate-900 text-lg shadow-sm focus:shadow-xl focus:shadow-primary-600/5 placeholder:text-slate-300 tracking-widest"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM / YY"
                        maxLength={5}
                        className="w-full px-6 py-5 bg-slate-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600/20 active:bg-white outline-none transition-all font-bold text-slate-900 text-lg shadow-sm focus:shadow-xl focus:shadow-primary-600/5 text-center placeholder:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">CVV Code</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="•••"
                        className="w-full px-6 py-5 bg-slate-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600/20 active:bg-white outline-none transition-all font-bold text-slate-900 text-lg shadow-sm focus:shadow-xl focus:shadow-primary-600/5 text-center placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center group relative overflow-hidden mt-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-3">
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        `Pay ₹${Number(packagePrice).toLocaleString()} & Register`
                      )}
                      {!isLoading && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                    </span>
                  </motion.button>

                  <div className="flex items-center justify-center gap-4 pt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary-600" /> SSL Secured
                    </p>
                    <div className="h-1 w-1 bg-slate-200 rounded-full" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encrypted Pay</p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
