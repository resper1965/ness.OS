'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  DollarSign,
  FileText,
  TrendingUp,
  AlertTriangle,
  Settings,
  Users,
  Briefcase,
  Scale,
  Shield,
  GraduationCap,
  ChevronDown,
  Menu,
  X,
  Bell
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  children?: { title: string; href: string }[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Financeiro',
    href: '/fin',
    icon: DollarSign,
    children: [
      { title: 'Contratos', href: '/fin/contratos' },
      { title: 'Rentabilidade', href: '/fin/rentabilidade' },
      { title: 'Alertas', href: '/fin/alertas' },
    ],
  },
  {
    title: 'Operações',
    href: '/ops',
    icon: Settings,
  },
  {
    title: 'Comercial',
    href: '/growth',
    icon: Briefcase,
  },
  {
    title: 'Jurídico',
    href: '/jur',
    icon: Scale,
  },
  {
    title: 'Governança',
    href: '/gov',
    icon: Shield,
  },
  {
    title: 'Pessoas',
    href: '/people',
    icon: GraduationCap,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string | null>('/fin')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-ness-dark text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-ness-dark text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="text-2xl font-bold">
            ness<span className="text-ness-cyan">.OS</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const isExpanded = expanded === item.href
            const Icon = item.icon

            return (
              <div key={item.href}>
                <Link
                  href={item.children ? '#' : item.href}
                  onClick={(e) => {
                    if (item.children) {
                      e.preventDefault()
                      setExpanded(isExpanded ? null : item.href)
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors",
                    isActive
                      ? "bg-ness-cyan text-white"
                      : "text-gray-300 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {item.children && (
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  )}
                </Link>

                {/* Submenu */}
                {item.children && isExpanded && (
                  <div className="ml-9 mb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-1.5 rounded text-sm transition-colors",
                          pathname === child.href
                            ? "text-ness-cyan"
                            : "text-gray-400 hover:text-white"
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ness-cyan flex items-center justify-center">
              <Users size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin</p>
              <p className="text-xs text-gray-400 truncate">admin@ness.com.br</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="lg:hidden w-8" /> {/* Spacer for mobile menu */}
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        
        {/* User menu */}
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
          <div className="w-8 h-8 rounded-full bg-ness-cyan text-white flex items-center justify-center text-sm font-medium">
            RE
          </div>
        </button>
      </div>
    </header>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
