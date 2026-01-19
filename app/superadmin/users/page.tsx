'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Search, User, Filter, Download } from 'lucide-react'

export default function UserDirectory() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')

    useEffect(() => {
        fetchUsers()
    }, [search, roleFilter])

    const fetchUsers = async () => {
        try {
            let url = `/api/admin/users?search=${search}`
            if (roleFilter !== 'all') {
                url += `&role=${roleFilter}`
            } else {
                url += `&role=all`
            }

            const res = await fetch(url)
            const data = await res.json()
            setUsers(data)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="lg:ml-72 min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-slate-900">User Directory</h1>
                            <p className="text-slate-500">View and manage all registered users, students, and parents.</p>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-slate-400 transition"
                                    />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600 font-bold text-sm"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="student">Students</option>
                                        <option value="parent">Parents</option>
                                        <option value="mentor">Mentors</option>
                                        <option value="admin">Admins</option>
                                    </select>
                                    <button className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Package</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Grade / Board</th>
                                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Joined Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading directory...</td></tr>
                                        ) : users.length === 0 ? (
                                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">No users found</td></tr>
                                        ) : (
                                            users.map((user: any) => (
                                                <tr key={user._id} className="hover:bg-slate-50/50 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                                                {user.name?.[0] || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                                <p className="text-xs text-slate-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold capitalize">
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.package ? (
                                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
                                                                {user.package}
                                                            </span>
                                                        ) : <span className="text-slate-400">-</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                                        {user.grade} {user.board && `(${user.board})`}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
