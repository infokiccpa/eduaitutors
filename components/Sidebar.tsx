'use client'

import { LayoutDashboard, BookOpen, TrendingUp, HelpCircle, Target, CreditCard, Settings, Package, LogOut } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Packages', path: '/packages' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
  { icon: HelpCircle, label: 'Quiz', path: '/quiz' },
  { icon: Target, label: 'Upskill Planner', path: '/upskill' },
  { icon: CreditCard, label: 'My Subscription', path: '/subscription' },
  { icon: Settings, label: 'Security Settings', path: '/security' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-secondary-900 border-r border-secondary-800 h-[calc(100vh-4rem)] fixed left-0 top-16 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4 px-2">Dashboard</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <button
                key={item.label}
                onClick={() => {
                  router.push(item.path)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-primary-600 text-white font-medium' : 'text-gray-300 hover:bg-primary-500/20 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="mt-8 pt-4 border-t border-secondary-800">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

