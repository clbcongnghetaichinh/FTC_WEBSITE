/**
 * LoadingSkeleton — Skeleton placeholder thay spinner
 * Dùng khi đang load danh sách trong admin
 */
'use client'

interface SkeletonProps {
  /** Số lượng card skeleton */
  count?: number
  /** Kiểu layout: 'grid' | 'list' */
  variant?: 'grid' | 'list'
}

export function LoadingSkeleton({ count = 6, variant = 'grid' }: SkeletonProps) {
  const items = Array.from({ length: count })

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/8 rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-white/10 rounded-lg w-2/5" />
                <div className="h-2.5 bg-white/5 rounded-lg w-3/5" />
              </div>
              <div className="w-16 h-6 bg-white/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((_, i) => (
        <div key={i} className="bg-white/5 border border-white/8 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-white/10 rounded-lg w-3/4" />
              <div className="h-2.5 bg-white/5 rounded-lg w-1/2" />
            </div>
          </div>
          <div className="h-2.5 bg-white/5 rounded-lg w-1/3 mb-3" />
          <div className="flex gap-2">
            <div className="flex-1 h-7 bg-white/5 rounded-lg" />
            <div className="flex-1 h-7 bg-white/5 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
