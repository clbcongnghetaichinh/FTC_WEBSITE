'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeader } from '@/components/page-header'
import { Users, Clock, Star, TrendingUp, Sparkles } from 'lucide-react'

type Activity = {
  id: string
  title: string
  body: string
  img_url: string
  alt: string
  category: string
  duration: string
  participants: string
  status: string
  highlights: string[]
  color: string
  is_published: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  'Học thuật': 'from-blue-500 to-cyan-500',
  'Trải nghiệm': 'from-green-500 to-emerald-500',
  'Đào tạo': 'from-purple-500 to-violet-500',
  'Nghề nghiệp': 'from-amber-700 to-yellow-800',
  'Gắn kết': 'from-pink-500 to-rose-500',
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/activities')
      .then(r => r.json())
      .then(data => {
        setActivities(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
      <Navigation />

      <PageHeader
        title="HOẠT ĐỘNG CỦA FTC"
        subtitle="Khám phá những sự kiện đặc sắc và hoạt động thú vị của câu lạc bộ"
        showSocialMedia={false}
        badgeText="Hoạt động nổi bật"
        badgeIcon={Sparkles}
        badgeColor="from-purple-500/20 to-pink-500/20"
        badgeBorderColor="border-purple-400/30"
        badgeIconColor="text-purple-400"
        badgeTextColor="text-purple-100"
        badgeShadowColor="shadow-purple-500/10"
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-32 text-white/40">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Chưa có hoạt động nào được đăng.</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:gap-12">
              {activities.map((activity) => {
                const gradient = CATEGORY_COLORS[activity.category] || 'from-blue-500 to-cyan-500'
                return (
                  <div key={activity.id} className="group relative">
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/30">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="relative z-10 p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row gap-6 mb-8">
                          {activity.img_url && (
                            <div className="lg:w-2/5">
                              <div className="relative h-[280px] lg:h-[320px] overflow-hidden rounded-3xl shadow-2xl">
                                <img
                                  src={activity.img_url}
                                  alt={activity.alt || activity.title}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                              </div>
                            </div>
                          )}

                          <div className={`${activity.img_url ? 'lg:w-3/5' : 'w-full'} flex flex-col justify-center space-y-4`}>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <div className={`px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${gradient}`}>
                                {activity.category}
                              </div>
                              {activity.duration && (
                                <div className="flex items-center gap-2 text-white/80 bg-white/10 px-3 py-2 rounded-full border border-white/20">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-xs font-medium">{activity.duration}</span>
                                </div>
                              )}
                              {activity.participants && (
                                <div className="flex items-center gap-2 text-white/80 bg-white/10 px-3 py-2 rounded-full border border-white/20">
                                  <Users className="w-4 h-4" />
                                  <span className="text-xs font-medium">{activity.participants}</span>
                                </div>
                              )}
                            </div>

                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
                              {activity.title}
                            </h2>

                            {activity.status && (
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/70 border border-white/20 w-fit">
                                {activity.status}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          <div className="lg:col-span-3">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                                <h3 className="text-lg font-bold text-white">Mô tả chi tiết</h3>
                              </div>
                              <p className="text-white/90 leading-relaxed text-base font-light text-justify">
                                {activity.body}
                              </p>
                            </div>
                          </div>

                          {activity.highlights?.filter(Boolean).length > 0 && (
                            <div>
                              <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 border border-white/20 shadow-xl h-full`}>
                                <div className="flex items-center gap-2 mb-4">
                                  <Star className="w-5 h-5 text-white" />
                                  <span className="text-sm font-bold text-white">Điểm nổi bật</span>
                                </div>
                                <div className="space-y-3">
                                  {activity.highlights.filter(Boolean).map((h, i) => (
                                    <div key={i} className="flex items-center gap-3 text-white">
                                      <div className="w-2 h-2 bg-white/70 rounded-full" />
                                      <span className="text-xs font-medium">{h}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
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

      <Footer />
    </div>
  )
}
