'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Save, AlertTriangle, Lock, Globe, Mail } from 'lucide-react'
import { toast } from 'react-toastify'

export default function SystemSettings() {
    const [config, setConfig] = useState<any>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/config')
            if (res.ok) {
                const data = await res.json()
                setConfig(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            })
            if (res.ok) {
                toast.success('System settings updated successfully')
            } else {
                toast.error('Failed to update settings')
            }
        } catch (error) {
            toast.error('Error saving settings')
        } finally {
            setSaving(false)
        }
    }

    const toggle = (key: string) => {
        setConfig((prev: any) => ({ ...prev, [key]: !prev[key] }))
    }

    const handleChange = (key: string, value: string) => {
        setConfig((prev: any) => ({ ...prev, [key]: value }))
    }

    if (loading) return <div className="p-10">Loading settings...</div>

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="lg:ml-72 min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">System Configuration</h1>
                                <p className="text-slate-500">Global settings and platform controls.</p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-600/20 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Maintenance */}
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Maintenance Mode</h3>
                                        <p className="text-sm text-slate-500">Temporarily disable access for all users except admins.</p>
                                    </div>
                                    <div className="ml-auto">
                                        <button
                                            onClick={() => toggle('maintenanceMode')}
                                            className={`w-14 h-8 rounded-full p-1 transition-colors ${config.maintenanceMode ? 'bg-red-600' : 'bg-slate-200'}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${config.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Registration */}
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-6 main">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">New User Registration</h3>
                                        <p className="text-sm text-slate-500">Allow new students and parents to sign up.</p>
                                    </div>
                                    <div className="ml-auto">
                                        <button
                                            onClick={() => toggle('registrationEnabled')}
                                            className={`w-14 h-8 rounded-full p-1 transition-colors ${config.registrationEnabled !== false ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${config.registrationEnabled !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Support Contact</h3>
                                        <p className="text-sm text-slate-500">Email address displayed for support inquiries.</p>
                                    </div>
                                </div>
                                <input
                                    type="email"
                                    value={config.supportEmail || ''}
                                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                                    placeholder="support@eduaitutors.com"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400"
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
