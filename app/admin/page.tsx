'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Users, Trophy, UserPlus, Info, ArrowRight, Zap, TrendingUp } from 'lucide-react'

const sections = [
  {
    href: '/admin/activities',
    label: 'Hoạt động & Sự kiện',
    icon: Calendar,
    description: 'Quản lý bài đăng hoạt động, gallery ảnh, thông tin sự kiện',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    iconColor: 'from-blue-500 to-cyan-500',
  },
  {
    href: '/admin/members',
    label: 'Thành viên & Cơ cấu',
    icon: Users,
    description: 'Thêm/sửa/xóa thành viên, cập nhật chức vụ và ban ngành',
    color: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/30',
    iconColor: 'from-purple-500 to-violet-500',
  },
  {
    href: '/admin/achievements',
    label: 'Thành tích & Dự án',
    icon: Trophy,
    description: 'Cập nhật các thành tích, giải thưởng và dự án nổi bật',
    color: 'from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/30',
    iconColor: 'from-amber-500 to-yellow-500',
  },
  {
    href: '/admin/recruitment',
    label: 'Tuyển thành viên',
    icon: UserPlus,
    description: 'Quản lý mùa tuyển dụng, form đăng ký, deadline và trạng thái',
    color: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    iconColor: 'from-green-500 to-emerald-500',
  },
  {
    href: '/admin/club-info',
    label: 'Thông tin CLB',
    icon: Info,
    description: 'Cập nhật slogan, mạng xã hội, liên hệ và các con số thống kê',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    iconColor: 'from-pink-500 to-rose-500',
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    // Check auth
    fetch('/api/admin/activities').then(r => {
      if (r.status === 401) router.push('/admin/login')
      else r.json().then(d => setCounts(c => ({ ...c, activities: d.length })))
    })
    fetch('/api/admin/members').then(r => r.ok && r.json().then(d => setCounts(c => ({ ...c, members: d.length }))))
    fetch('/api/admin/achievements').then(r => r.ok && r.json().then(d => setCounts(c => ({ ...c, achievements: d.length }))))
    fetch('/api/admin/recruitment').then(r => r.ok && r.json().then(d => setCounts(c => ({ ...c, recruitment: d.length }))))
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
        </div>
        <p className="text-white/40 text-sm ml-11">Quản lý toàn bộ nội dung website FTC</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Hoạt động', value: counts.activities ?? '—', icon: Calendar, color: 'text-cyan-400' },
          { label: 'Thành viên', value: counts.members ?? '—', icon: Users, color: 'text-purple-400' },
          { label: 'Thành tích', value: counts.achievements ?? '—', icon: Trophy, color: 'text-amber-400' },
          { label: 'Tuyển dụng', value: counts.recruitment ?? '—', icon: TrendingUp, color: 'text-green-400' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white/5 border border-white/8 rounded-2xl p-5">
              <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-white/40 text-xs mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map(section => {
          const Icon = section.icon
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`group relative bg-gradient-to-br ${section.color} border ${section.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.iconColor} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-bold text-base mb-2">{section.label}</h3>
              <p className="text-white/50 text-xs leading-relaxed mb-4">{section.description}</p>
              <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                Quản lý <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
