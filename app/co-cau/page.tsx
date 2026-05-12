'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHeader } from '@/components/page-header'
import {
  Shield, BookOpen, Calendar, Megaphone, Wallet, Users,
  Handshake, TrendingUp, Target, Sparkles, Zap, ArrowRight,
  Search, FileText, Settings, Palette, Video, GraduationCap,
  DollarSign, UserCheck, Calculator, Heart, Image as ImageIcon,
  ChevronLeft, ChevronRight
} from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  Shield, BookOpen, Calendar, Megaphone, Wallet, Users, Handshake,
  TrendingUp, Target, Sparkles, Zap, Search, FileText, Settings,
  Palette, Video, GraduationCap, DollarSign, UserCheck, Calculator, Heart,
}

type QuickFeature = { icon: string; text: string; color: string }

type Department = {
  id: string
  title: string
  category: string
  icon_name: string
  color: string
  card_gradient: string
  photos: string[]
  quick_features: QuickFeature[]
  responsibilities: string[]
  sort_order: number
  is_active: boolean
}

function DepartmentPhotoCarousel({ departments }: { departments: Department[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | 'none'>('none')

  const withPhotos = departments.filter(d => d.photos && d.photos.length > 0)
  if (withPhotos.length === 0) return null

  const current = withPhotos[currentIndex]

  const navigate = (nextIndex: number, dir: 'left' | 'right') => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDirection(dir)
    setTimeout(() => {
      setCurrentIndex(nextIndex)
      setDirection('none')
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  useEffect(() => {
    const t = setInterval(() => navigate((currentIndex + 1) % withPhotos.length, 'right'), 5000)
    return () => clearInterval(t)
  }, [currentIndex, isTransitioning])

  return (
    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden max-w-4xl mx-auto">
      <div className="absolute top-4 right-4 z-20">
        <div className="text-white/70 text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
          {currentIndex + 1} / {withPhotos.length}
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <div className={`relative w-full h-full transition-all duration-500 ease-out ${
          direction === 'right' ? 'translate-x-full opacity-0' :
          direction === 'left' ? '-translate-x-full opacity-0' :
          'translate-x-0 opacity-100'
        }`}>
          <img
            src={current.photos[0]}
            alt={current.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        <button onClick={() => navigate((currentIndex - 1 + withPhotos.length) % withPhotos.length, 'left')}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => navigate((currentIndex + 1) % withPhotos.length, 'right')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex flex-wrap gap-2 justify-center">
          {withPhotos.map((dept, i) => (
            <button key={dept.id} onClick={() => navigate(i, i > currentIndex ? 'right' : 'left')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                i === currentIndex
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
              }`}>
              {dept.title}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/60 text-xs">Tự động chuyển ảnh</span>
        </div>
      </div>
    </div>
  )
}

export default function CoPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/departments')
      .then(r => r.json())
      .then(data => {
        setDepartments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#003663] text-white overflow-hidden">
      <Navigation />

      <PageHeader
        title="CƠ CẤU TỔ CHỨC"
        subtitle="Khám phá cấu trúc tổ chức và vai trò của các ban trong câu lạc bộ"
        showSocialMedia={false}
        badgeText="Tổ chức chuyên nghiệp"
        badgeIcon={Sparkles}
        badgeColor="from-emerald-500/20 to-teal-500/20"
        badgeBorderColor="border-emerald-400/30"
        badgeIconColor="text-emerald-400"
        badgeTextColor="text-emerald-100"
        badgeShadowColor="shadow-emerald-500/10"
      />

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Photo Carousel */}
          {departments.some(d => d.photos?.length > 0) && (
            <section className="py-8 sm:py-12 px-4 lg:px-8 mb-6">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <ImageIcon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">HÌNH ẢNH HOẠT ĐỘNG</h2>
                  <p className="text-white/70 italic">Khám phá các hoạt động và thành viên của từng ban</p>
                </div>
                <DepartmentPhotoCarousel departments={departments} />
              </div>
            </section>
          )}

          {/* Department Cards */}
          <section className="py-8 sm:py-16 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">CÁC BAN CHUYÊN MÔN</h2>
                <p className="text-white/70 italic">Tìm hiểu chi tiết về vai trò và trách nhiệm của từng ban</p>
              </div>

              {departments.length === 0 ? (
                <div className="text-center py-20 text-white/40">Chưa có dữ liệu ban/phòng.</div>
              ) : (
                <div className="grid gap-8 lg:gap-12">
                  {departments.map(dept => {
                    const IconComp = ICON_MAP[dept.icon_name] || Shield
                    return (
                      <div key={dept.id} className="group relative">
                        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-400/30">
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                          <div className="relative z-10 p-6 lg:p-8">
                            {/* Category badge */}
                            <div className="mb-4">
                              <span className={`px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${dept.card_gradient}`}>
                                {dept.category}
                              </span>
                            </div>

                            {/* Title */}
                            <div className="flex items-center gap-3 mb-5">
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 flex items-center justify-center shadow-xl flex-shrink-0">
                                <IconComp className="w-5 h-5 text-white" />
                              </div>
                              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                                {dept.title}
                              </h2>
                            </div>

                            {/* Quick features */}
                            {dept.quick_features?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-6">
                                {dept.quick_features.map((f, i) => {
                                  const FIcon = ICON_MAP[f.icon] || Zap
                                  return (
                                    <div key={i} className="flex items-center gap-2 text-xs text-white/80 bg-white/5 px-3 py-2 rounded-full border border-white/20">
                                      <FIcon className={`w-3 h-3 ${f.color}`} />
                                      <span>{f.text}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            )}

                            {/* Responsibilities */}
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                              <div className="flex items-center gap-2 mb-5">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                                <h3 className="text-lg font-bold text-white">Nhiệm vụ và trách nhiệm</h3>
                              </div>
                              <div className="grid gap-3">
                                {dept.responsibilities.map((r, i) => (
                                  <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-400/20 to-purple-400/20 border border-blue-400/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                                      <span className="text-xs font-bold text-blue-300">{i + 1}</span>
                                    </div>
                                    <p className="text-white/90 leading-relaxed text-sm sm:text-base">{r}</p>
                                  </div>
                                ))}
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
          <section className="py-12 px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 lg:p-12 shadow-2xl">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">THAM GIA ĐỘI NGŨ FTC</h2>
                <p className="text-white/70 mb-8 italic">Khám phá cơ hội phát triển bản thân và đóng góp cho cộng đồng FinTech</p>
                <a href="/ung-tuyen" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-bold hover:scale-105 hover:shadow-xl transition-all">
                  Đăng ký tham gia <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  )
}
