'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, ShieldCheck, Sparkles, GraduationCap, Key } from 'lucide-react'
import { toast } from 'react-toastify'
import { signIn } from 'next-auth/react'

function TutorAuthContent() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        invitationCode: ''
    })

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (isLogin) {
                const res = await signIn('credentials', {
                    redirect: false,
                    email: formData.email,
                    password: formData.password
                })

                if (res?.error) {
                    toast.error(res.error)
                } else {
                    toast.success('Welcome back, Mentor!')
                    router.push('/mentor')
                }
            } else {
                const res = await fetch('/api/auth/mentor-signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })

                const data = await res.json()

                if (res.ok) {
                    toast.success('Account created! Please sign in.')
                    setIsLogin(true)
                } else {
                    toast.error(data.message || 'Registration failed')
                }
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 selection:bg-indigo-100 font-sans">
            {/* Left Side: Branding */}
            <div className="hidden lg:relative lg:flex flex-col items-center justify-center p-16 bg-[#0F172A] overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center"
                >
                    <Image src="/logo-eduaitutors.png" alt="Logo" width={300} height={100} className="mx-auto mb-12 brightness-0 invert" />
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-12">
                        <Sparkles className="w-4 h-4" />
                        Educator Workspace
                    </div>
                    <h1 className="text-5xl xl:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
                        Teach the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Future.</span>
                    </h1>
                    <p className="text-slate-400 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                        Access your advanced mentor dashboard, manage live sessions, and inspire students with AI-powered insights.
                    </p>
                </motion.div>

                <div className="absolute bottom-12 left-12 right-12">
                    <div className="grid grid-cols-3 gap-6">
                        {[
                            { label: 'Live Tools', icon: ShieldCheck },
                            { label: 'Chat Access', icon: Mail },
                            { label: 'Analytics', icon: GraduationCap }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-center">
                                <item.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 lg:p-16 relative">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mb-12">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Student Site
                    </Link>

                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-3">
                            {isLogin ? 'Tutor Login' : 'Become a Mentor'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {isLogin ? 'Sign in to access your teaching dashboard.' : 'Join our elite cohort of AI-driven educators.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                required={!isLogin}
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-100 border-2 border-transparent focus:bg-white focus:border-indigo-600/20 rounded-2xl outline-none font-bold transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Invitation Code</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                                <Key className="w-5 h-5" />
                                            </div>
                                            <input
                                                required={!isLogin}
                                                type="text"
                                                value={formData.invitationCode}
                                                onChange={(e) => setFormData({ ...formData, invitationCode: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-100 border-2 border-transparent focus:bg-white focus:border-indigo-600/20 rounded-2xl outline-none font-bold transition-all"
                                                placeholder="EDUAI-XXXX-XXXX"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Official Email</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border-2 border-transparent focus:bg-white focus:border-indigo-600/20 rounded-2xl outline-none font-bold transition-all"
                                    placeholder="mentor@eduaitutors.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Access Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-100 border-2 border-transparent focus:bg-white focus:border-indigo-600/20 rounded-2xl outline-none font-bold transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : (isLogin ? 'Enter Workspace' : 'Create Mentor Account')}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 font-medium">
                            {isLogin ? "New educator here?" : "Already Have account?"}{' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-indigo-600 font-black uppercase tracking-widest text-xs hover:text-indigo-700"
                            >
                                {isLogin ? 'Register as Mentor' : 'Sign in here'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default function TutorLogin() {
    return (
        <Suspense fallback={<div>Loading Educator Portal...</div>}>
            <TutorAuthContent />
        </Suspense>
    )
}
