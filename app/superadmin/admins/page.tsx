'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Plus, Trash2, Shield, Mail, User } from 'lucide-react'
import { toast } from 'react-toastify'

export default function ManageAdmins() {
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' })

    useEffect(() => {
        fetchAdmins()
    }, [])

    const fetchAdmins = async () => {
        try {
            // Reusing users API with role=admin logic we added.
            // But fetching both admin and superadmin to view.
            const res = await fetch('/api/admin/users?role=all')
            const data = await res.json()
            // Filter client side or rely on API. Since API returns all if role=all, let's filter here for just admins/superadmins for this page
            const adminUsers = data.filter((u: any) => ['admin', 'superadmin', 'support'].includes(u.role))
            setAdmins(adminUsers)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (res.ok) {
                toast.success('Admin added successfully')
                setShowModal(false)
                fetchAdmins()
                setFormData({ name: '', email: '', password: '', role: 'admin' })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to add admin')
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="lg:ml-72 min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">Manage Admins</h1>
                                <p className="text-slate-500">Control access levels and manage administrative staff.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                            >
                                <Plus className="w-5 h-5" /> Add New Admin
                            </button>
                        </div>

                        {loading ? <p>Loading...</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {admins.map((admin: any) => (
                                    <div key={admin._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${admin.role === 'superadmin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${admin.role === 'superadmin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {admin.role}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{admin.name}</h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-2 mb-4">
                                            <Mail className="w-4 h-4" /> {admin.email}
                                        </p>
                                        {/* Add Delete/Edit buttons here if needed */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">Add New Admin</h2>
                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Password</label>
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-400"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                    <option value="support">Support</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
                                >
                                    Create Access
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
