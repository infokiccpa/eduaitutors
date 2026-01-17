'use client'

import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  HelpCircle,
  Target,
  Settings,
  Package,
  LogOut,
  ShieldCheck,
  Users,
  Calendar,
  Layers,
  BarChart4,
  Briefcase,
  Heart,
  Baby
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user as any

  const getMenuItems = () => {
    const role = user?.role || 'student'

    const baseItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }
    ]

    const studentItems = [
      { icon: Package, label: 'Packages', path: '/dashboard/packages' },
      { icon: BookOpen, label: 'Courses', path: '/dashboard/courses' },
      { icon: TrendingUp, label: 'Progress', path: '/progress' },
      { icon: HelpCircle, label: 'Quiz', path: '/quiz' },
      { icon: Target, label: 'Upskill Planner', path: '/upskill' },
      { icon: Settings, label: 'Settings', path: '/security' },
    ]

    const parentItems = [
      { icon: Baby, label: 'Child Progress', path: '/parent/progress' },
      { icon: BarChart4, label: 'Activity Logs', path: '/parent/activities' },
      { icon: Layers, label: 'Subscriptions', path: '/parent/billing' },
      { icon: Settings, label: 'Account', path: '/security' },
    ]

    const mentorItems = [
      { icon: Users, label: 'My Students', path: '/mentor/students' },
      { icon: Calendar, label: 'Schedule Class', path: '/mentor/schedule' },
      { icon: Heart, label: 'Feedbacks', path: '/mentor/feedback' },
      { icon: Settings, label: 'Profile', path: '/security' },
    ]

    const adminItems = [
      { icon: ShieldCheck, label: 'Admin Center', path: '/admin' },
      { icon: Users, label: 'Students', path: '/admin/users' },
      { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
      { icon: Calendar, label: 'Schedules', path: '/admin/schedules' },
    ]

    const superAdminItems = [
      { icon: Briefcase, label: 'Platform Stats', path: '/superadmin' },
      { icon: Users, label: 'Manage Admins', path: '/superadmin/admins' },
      { icon: Settings, label: 'System Settings', path: '/superadmin/config' },
    ]

    switch (role) {
      case 'superadmin': return [...baseItems, ...superAdminItems]
      case 'admin': return [...baseItems, ...adminItems]
      case 'parent': return [...baseItems, ...parentItems]
      case 'mentor': return [...baseItems, ...mentorItems]
      default: return [...baseItems, ...studentItems]
    }
  }

  const menuItems = getMenuItems()

  return (
    <aside className="w-64 bg-secondary-900 border-r border-secondary-800 h-[calc(100vh-4rem)] fixed left-0 top-16 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4 px-2 capitalize">{user?.role || 'Student'} Panel</h2>
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary-600 text-white font-medium' : 'text-gray-300 hover:bg-primary-500/20 hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="mt-8 pt-4 border-t border-secondary-800">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

