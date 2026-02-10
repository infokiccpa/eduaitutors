'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    Phone,
    Mail,
    Calendar,
    BookOpen,
    RefreshCw,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    XCircle,
    UserCheck,
    MessageSquare,
    ChevronDown,
    Download,
    GraduationCap
} from 'lucide-react'

interface Lead {
    _id: string
    name: string
    email: string
    phone: string
    grade: string
    subjects: string[]
    courseInterest: string
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Enrolled'
    notes: string
    source: string
    createdAt: string
}

const statusConfig = {
    New: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
    Contacted: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Phone },
    Qualified: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: UserCheck },
    Enrolled: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    Lost: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
}

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [gradeFilter, setGradeFilter] = useState('all')
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null)

    const fetchLeads = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter !== 'all') params.append('status', statusFilter)
            if (gradeFilter !== 'all') params.append('grade', gradeFilter)

            const res = await fetch(`/api/leads?${params.toString()}`)
            const data = await res.json()
            setLeads(data.leads || [])
        } catch (error) {
            console.error('Error fetching leads:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeads()
    }, [statusFilter, gradeFilter])

    const updateLeadStatus = async (leadId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: leadId, status: newStatus })
            })
            if (res.ok) {
                setLeads(prev => prev.map(lead =>
                    lead._id === leadId ? { ...lead, status: newStatus as Lead['status'] } : lead
                ))
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
        setShowStatusDropdown(null)
    }

    const filteredLeads = leads.filter(lead => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            lead.name.toLowerCase().includes(query) ||
            lead.email.toLowerCase().includes(query) ||
            lead.phone.includes(query)
        )
    })

    const stats = {
        total: leads.length,
        new: leads.filter(l => l.status === 'New').length,
        contacted: leads.filter(l => l.status === 'Contacted').length,
        enrolled: leads.filter(l => l.status === 'Enrolled').length,
    }

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Grade', 'Subjects', 'Status', 'Source', 'Date']
        const rows = filteredLeads.map(lead => [
            lead.name,
            lead.email,
            lead.phone,
            lead.grade,
            lead.subjects?.join(', ') || '',
            lead.status,
            lead.source,
            new Date(lead.createdAt).toLocaleDateString()
        ])

        const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-slate-900">Admin Dashboard</h1>
                                <p className="text-sm text-slate-500">Student Registrations</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchLeads}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-all"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Registrations', value: stats.total, icon: Users, color: 'bg-slate-900' },
                        { label: 'New Leads', value: stats.new, icon: Clock, color: 'bg-blue-500' },
                        { label: 'Contacted', value: stats.contacted, icon: Phone, color: 'bg-yellow-500' },
                        { label: 'Enrolled', value: stats.enrolled, icon: CheckCircle2, color: 'bg-emerald-500' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Search */}
                        <div className="flex-1 min-w-[250px] relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-orange-500"
                            >
                                <option value="all">All Status</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Enrolled">Enrolled</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>

                        {/* Grade Filter */}
                        <select
                            value={gradeFilter}
                            onChange={(e) => setGradeFilter(e.target.value)}
                            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-orange-500"
                        >
                            <option value="all">All Grades</option>
                            <option value="Grade 10">Grade 10</option>
                            <option value="Grade 12">Grade 12</option>
                        </select>

                        {/* Export Button */}
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="text-center py-20">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No registrations found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subjects</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredLeads.map((lead, idx) => {
                                        const StatusIcon = statusConfig[lead.status]?.icon || Clock
                                        return (
                                            <motion.tr
                                                key={lead._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                            {lead.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{lead.name}</p>
                                                            <p className="text-xs text-slate-500">{lead.source}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{lead.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                            <span className="truncate max-w-[180px]">{lead.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                                                        <BookOpen className="w-3.5 h-3.5" />
                                                        {lead.grade || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                        {lead.subjects?.slice(0, 3).map((subject, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                                {subject}
                                                            </span>
                                                        ))}
                                                        {lead.subjects?.length > 3 && (
                                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-medium">
                                                                +{lead.subjects.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 relative">
                                                    <button
                                                        onClick={() => setShowStatusDropdown(showStatusDropdown === lead._id ? null : lead._id)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${statusConfig[lead.status]?.color || 'bg-slate-100 text-slate-700'} transition-all hover:shadow-md`}
                                                    >
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {lead.status}
                                                        <ChevronDown className="w-3 h-3" />
                                                    </button>

                                                    {showStatusDropdown === lead._id && (
                                                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 min-w-[140px]">
                                                            {Object.keys(statusConfig).map((status) => {
                                                                const Icon = statusConfig[status as keyof typeof statusConfig].icon
                                                                return (
                                                                    <button
                                                                        key={status}
                                                                        onClick={() => updateLeadStatus(lead._id, status)}
                                                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${lead.status === status ? 'bg-slate-50' : ''}`}
                                                                    >
                                                                        <Icon className="w-4 h-4" />
                                                                        {status}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}</span>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                <div className="mt-6 text-center text-sm text-slate-500">
                    Showing {filteredLeads.length} of {leads.length} registrations
                </div>
            </main>
        </div>
    )
}
