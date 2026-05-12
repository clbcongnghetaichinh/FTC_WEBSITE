'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeader } from '@/components/page-header'
import { Trophy, Star, Award, Users, Target, Activity, BookOpen, ArrowRight } from 'lucide-react'

type Achievement = {
  id: string
  title: string
  description: string
  year: number
  category: string
  img_url: string
  sort_order: number
  is_published: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  'Giải thưởng': 'from-yellow-500 to-amber-500',
  'Dự án': 'from-blue-500 to-cyan-500',
  'Sự kiện': 'from-green-500 to-emerald-500',
  'Hợp tác': 'from-purple-500 to-violet-500',
  'Khác': 'from-pink-500 to-rose-500',
}

const ICONS: Record<string, any> = {
  'Giải thưởng': Trophy,
  'Dự án': Star,
  'Sự kiện': Award,
  'Hợp tác': Users,
  'Khác': Target,
}

export default function AchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/achievements')
      .then(r => r.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
      <Navigation />

      <PageHeader
        title="THÀNH TÍCH NỔI BẬT"
        subtitle="Những thành tựu đáng tự hào của câu lạc bộ trong hành trình phát triển"
        showSocialMedia={false}
        badgeText="Thành tích xuất sắc"
        badgeIcon={Trophy}
        badgeColor="from-yellow-500/20 to-amber-500/20"
        badgeBorderColor="border-yellow-400/30"
        badgeIconColor="text-yellow-400"
        badgeTextColor="text-yellow-100"
        badgeShadowColor="shadow-yellow-500/10"
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-32 text-white/40">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Chưa có thành tích nào được đăng.</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:gap-12">
              {items.map((item, idx) => {
                const gradient = CATEGORY_COLORS[item.category] || 'from-yellow-500 to-amber-500'
                const IconComp = ICONS[item.category] || Trophy
                const isLeft = idx % 2 === 0
                return (
                  <div key={item.id} className="group relative">
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/30">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="relative z-10 p-6 lg:p-8">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 flex items-center justify-center shadow-xl">
                            <IconComp className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                              {item.title}
                            </h2>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient}`}>
                                {item.category}
                              </span>
                              <span className="text-white/50 text-xs">{item.year}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content + Image */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                          <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                                <h3 className="text-lg font-bold text-white">Chi tiết thành tích</h3>
                              </div>
                              <p className="text-white/90 leading-relaxed text-justify">
                                {item.description || 'Chưa có mô tả.'}
                              </p>
                            </div>
                            {item.img_url && (
                              <div className="lg:w-1/2 w-full">
                                <div className="relative group/img rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                                  <img
                                    src={item.img_url}
                                    alt={item.title}
                                    className="w-full h-auto object-cover transform group-hover/img:scale-105 transition-transform duration-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl border border-blue-400/30 p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">THÔNG TIN CÂU LẠC BỘ</h3>
                <p className="text-blue-200">Cộng đồng FinTech hàng đầu</p>
              </div>
            </div>
            <a href="/thong-tin" className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl text-white font-bold hover:shadow-xl hover:scale-105 transition-all duration-300">
              <BookOpen className="w-5 h-5" /> Xem chi tiết <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {[
              { href: '/hoat-dong', icon: Activity, label: 'Hoạt động', desc: 'Sự kiện và hoạt động', from: 'from-purple-500', to: 'to-pink-600' },
              { href: '/co-cau', icon: Users, label: 'Cơ cấu', desc: 'Tổ chức và cấu trúc', from: 'from-emerald-500', to: 'to-teal-600' },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.href} className="group bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-5 hover:scale-[1.02] transition-all duration-300 flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.from} ${item.to} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{item.label}</h4>
                    <p className="text-white/50 text-xs">{item.desc}</p>
                  </div>
                  <a href={item.href} className={`px-4 py-2 bg-gradient-to-r ${item.from} ${item.to} rounded-xl text-white text-sm font-semibold`}>Xem</a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
