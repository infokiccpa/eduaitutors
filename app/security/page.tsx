'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import {
  Lock, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2,
  User, Mail, Phone, LifeBuoy, MessageSquare, ChevronRight,
  Camera
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

export default function SecurityProfilePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('profile')
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Password State
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [pwStatus, setPwStatus] = useState('idle')

  useEffect(() => {
    if (session) {
      fetchUser()
    }
  }, [session])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user/me')
      if (res.ok) {
        const data = await res.json()
        setUserData(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setPwStatus('loading')
    // Simulate API call
    setTimeout(() => {
      setPwStatus('success')
      toast.success('Password updated successfully')
      setTimeout(() => setPwStatus('idle'), 3000)
    }, 1500)
  }

  const VerificationBadge = ({ verified }: { verified: boolean }) => (
    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ml-2 ${verified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
      {verified ? 'Verified' : 'Unverified'}
    </span>
  )

  const passwordRequirements = [
    { label: 'At least 8 characters long', met: passwords.new.length >= 8 },
    { label: 'Include an uppercase letter', met: /[A-Z]/.test(passwords.new) },
    { label: 'Include a number or symbol', met: /[0-9!@#$%^&*]/.test(passwords.new) }
  ]

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Security & Login', icon: ShieldCheck },
    { id: 'support', label: 'Help & Support', icon: LifeBuoy },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="lg:ml-72 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Account Settings</h1>
              <p className="text-slate-500 font-medium text-lg">Manage your personal details, security preferences, and get support.</p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-4 mb-10 border-b border-slate-200 pb-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-t-2xl font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all relative top-[1px] ${activeTab === tab.id
                      ? 'bg-white border-x border-t border-slate-200 text-primary-600 border-b-white'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary-600' : ''}`} />
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  <div className="lg:col-span-2 space-y-8">
                    {/* Personal Details */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900">Personal Information</h3>
                          <p className="text-sm font-medium text-slate-500">Update your basic profile details.</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <input
                              type="text"
                              defaultValue={userData?.name}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</label>
                            <input
                              type="text"
                              readOnly
                              value={userData?.role || 'Student'}
                              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-500 capitalize cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                          <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-slate-900">Contact Details</h4>
                          </div>
                          <div className="space-y-5">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                              <div className="flex-1 w-full space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                                  Email Address <VerificationBadge verified={userData?.isEmailVerified} />
                                </label>
                                <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input
                                    type="email"
                                    defaultValue={userData?.email}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-indigo-500"
                                  />
                                </div>
                              </div>
                              {!userData?.isEmailVerified && (
                                <button className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition mt-6 md:mt-0 w-full md:w-auto">
                                  Verify Email
                                </button>
                              )}
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                              <div className="flex-1 w-full space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                                  Phone Number <VerificationBadge verified={userData?.isPhoneVerified} />
                                </label>
                                <div className="relative">
                                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input
                                    type="tel"
                                    placeholder="+91 00000 00000"
                                    defaultValue={userData?.phone}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-indigo-500"
                                  />
                                </div>
                              </div>
                              {!userData?.isPhoneVerified && (
                                <button className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition mt-6 md:mt-0 w-full md:w-auto">
                                  Verify Phone
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="pt-6">
                          <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Avatar Column */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm text-center">
                      <div className="relative inline-block mb-6">
                        <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                          <span className="text-4xl font-black text-slate-300">{userData?.name?.[0]}</span>
                          {/* Image would go here */}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2.5 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="text-lg font-black text-slate-900">{userData?.name || 'User'}</h3>
                      <p className="text-sm font-medium text-slate-500">{userData?.role}</p>
                      <p className="text-xs text-slate-400 mt-1">Member since {new Date(userData?.createdAt || Date.now()).getFullYear()}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  {/* Password Change */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                          <Lock className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900">Change Password</h3>
                          <p className="text-sm font-medium text-slate-500">Update your login credentials securely.</p>
                        </div>
                      </div>

                      <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                          <div className="relative">
                            <input
                              type={showCurrent ? 'text' : 'password'}
                              value={passwords.current}
                              onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-primary-500"
                              placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                            <div className="relative">
                              <input
                                type={showNew ? 'text' : 'password'}
                                value={passwords.new}
                                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-primary-500"
                                placeholder="New password"
                              />
                              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                            <div className="relative">
                              <input
                                type={showConfirm ? 'text' : 'password'}
                                value={passwords.confirm}
                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-primary-500"
                                placeholder="Confirm password"
                              />
                              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={pwStatus === 'loading'}
                          className="w-full py-4 bg-secondary-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition shadow-lg shadow-slate-900/10 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                          {pwStatus === 'loading' ? 'Updating...' : 'Update Password'}
                        </button>
                      </form>
                    </div>

                    {/* Activity */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-slate-900">Login Activity</h2>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent sessions and security events</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 font-bold text-sm text-center py-12">
                        No suspicious activity detected in the last 30 days.
                      </div>
                    </div>
                  </div>

                  {/* Side Panel for Security */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Password Requirements</h3>
                      <div className="space-y-4">
                        {passwordRequirements.map((req, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${req.met ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-300'}`}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <span className={`text-sm font-bold ${req.met ? 'text-slate-700' : 'text-slate-400'}`}>{req.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                        <p className="text-xs font-bold text-primary-700 leading-relaxed">
                          Security Tip: A strong password helps protect your student data.
                        </p>
                      </div>
                    </div>

                    <div className="bg-secondary-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                      <div className="relative z-10">
                        <ShieldCheck className="w-10 h-10 text-primary-500 mb-4" />
                        <h3 className="text-lg font-black mb-2">Two-Factor Auth</h3>
                        <p className="text-slate-400 text-xs font-bold mb-6 leading-relaxed">Add an extra layer of security to your account by enabling 2FA.</p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                          Enable Now
                        </button>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                      <LifeBuoy className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">How can we help you?</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Our support team is always ready to assist you. Browse FAQs or get in touch directly.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100 flex flex-col items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-slate-400" />
                        <span className="font-bold text-slate-700">Live Chat</span>
                      </button>
                      <button className="p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100 flex flex-col items-center gap-3">
                        <Mail className="w-6 h-6 text-slate-400" />
                        <span className="font-bold text-slate-700">Email Support</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest pl-2">Common Questions</h3>
                    {[
                      "How do I change my subscription plan?",
                      "Where can I find my course certificates?",
                      "How do verify my student ID?",
                      "Can I download lectures offline?"
                    ].map((q, i) => (
                      <button key={i} className="w-full p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-center hover:shadow-md transition text-left group">
                        <span className="font-bold text-slate-700 group-hover:text-primary-600 transition">{q}</span>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  )
}
