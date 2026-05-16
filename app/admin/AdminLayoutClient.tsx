/**
 * AdminLayoutClient — Sidebar + Layout wrapper cho toàn bộ admin
 *
 * Thay đổi so với bản cũ:
 *  - Thêm ToastProvider (toast notification toàn cục)
 *  - Thêm AdminLangProvider (song ngữ EN/VI)
 *  - Thêm LangToggle vào cuối sidebar
 *  - Labels sidebar lấy từ t() thay vì hardcode tiếng Việt
 */
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Calendar, Users, Trophy, UserPlus, Info,
  LogOut, Menu, X, ChevronRight, Zap, Shield, Building2
} from 'lucide-react'
import { ToastProvider } from '@/components/admin/Toast'
import { AdminLangProvider, useAdminLang } from '@/context/AdminLangContext'
import { LangToggle } from '@/components/admin/LangToggle'

function AdminSidebarContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useAdminLang()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => { setSidebarOpen(false) }, [pathname])

  if (pathname === '/admin/login') return <>{children}</>

  const navItems = [
    { href: '/admin',              label: t('nav_dashboard'),    icon: LayoutDashboard, exact: true },
    { href: '/admin/activities',   label: t('nav_activities'),   icon: Calendar },
    { href: '/admin/departments',  label: t('nav_departments'),  icon: Building2 },
    { href: '/admin/members',      label: t('nav_members'),      icon: Users },
    { href: '/admin/achievements', label: t('nav_achievements'), icon: Trophy },
    { href: '/admin/recruitment',  label: t('nav_recruitment'),  icon: UserPlus },
    { href: '/admin/club-info',    label: t('nav_club_info'),    icon: Info },
  ]

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#001829] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#001220] border-r border-white/5 z-30 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-black text-sm tracking-wide">FTC ADMIN</div>
            <div className="text-cyan-400/50 text-xs">Control Panel</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/30 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = isActive(item)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-cyan-400' : ''}`} />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto text-cyan-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-white/5 space-y-2">
          {/* Language toggle */}
          <div className="px-1">
            <LangToggle />
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            {loggingOut ? t('logging_out') : t('logout')}
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-white/30 hover:text-white/50 transition-all"
          >
            <Zap className="w-3 h-3" />
            {t('view_site')}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-[#001220] border-b border-white/5 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-white/50 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white font-bold text-sm">FTC Admin</span>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AdminLangProvider>
      <ToastProvider>
        <AdminSidebarContent>{children}</AdminSidebarContent>
      </ToastProvider>
    </AdminLangProvider>
  )
}
