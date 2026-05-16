'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Info } from 'lucide-react'
import { useToast } from '@/components/admin/Toast'
import { useAdminLang } from '@/context/AdminLangContext'

type InfoItem = { id: string; key: string; value: string; label: string }

/**
 * Club Info — Dạng form inline (không phải danh sách CRUD)
 * Dữ liệu được lưu toàn bộ cùng 1 lần qua PUT
 * Không dùng useAdminCrud vì logic khác biệt
 */
export default function AdminClubInfoPage() {
  const router = useRouter()
  const { t } = useAdminLang()
  const toast = useToast()

  const [items, setItems] = useState<InfoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const r = await fetch('/api/admin/club-info')
    if (r.status === 401) { router.push('/admin/login'); return }
    setItems(await r.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function update(key: string, value: string) {
    setItems(prev => prev.map(item => item.key === key ? { ...item, value } : item))
  }

  async function saveAll() {
    setSaving(true)
    try {
      const r = await fetch('/api/admin/club-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items.map(({ key, value }) => ({ key, value }))),
      })
      if (!r.ok) { toast.error(t('error_save')); return }
      toast.success(t('saved_ok'))
    } catch {
      toast.error('Lỗi kết nối mạng')
    } finally {
      setSaving(false)
    }
  }

  const groups = [
    { title: t('nav_club_info') + ' — Cơ bản', keys: ['club_name', 'slogan'] },
    { title: 'Mạng xã hội & Liên hệ', keys: ['facebook_url', 'instagram_url', 'email', 'phone', 'address'] },
    { title: 'Số liệu thống kê', keys: ['member_count', 'project_count', 'partner_count', 'event_count'] },
  ]

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white/5 border border-white/8 rounded-2xl p-6 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/4 mb-5" />
          <div className="space-y-3">
            {[1,2].map(j => <div key={j} className="h-10 bg-white/5 rounded-xl" />)}
          </div>
        </div>
      ))}
    </div>
  )

  const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500/50 transition-all placeholder-white/20'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">{t('club_info.title')}</h1>
          <p className="text-white/40 text-sm mt-0.5">Cập nhật thông tin hiển thị trên website</p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl text-white text-sm font-semibold hover:from-pink-400 hover:to-rose-500 disabled:opacity-40 transition-all shadow-lg"
        >
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('saving')}</>
            : <><Save className="w-4 h-4" />{t('save')}</>}
        </button>
      </div>

      <div className="space-y-6">
        {groups.map(group => {
          const groupItems = items.filter(item => group.keys.includes(item.key))
          if (groupItems.length === 0) return null
          return (
            <div key={group.title} className="bg-white/5 border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
                <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-pink-500 to-rose-600" />
                {group.title}
              </h2>
              <div className="space-y-4">
                {groupItems.map(item => (
                  <div key={item.key}>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                      {item.label || item.key}
                    </label>
                    {item.key === 'slogan' || item.key === 'address' ? (
                      <textarea
                        value={item.value}
                        onChange={e => update(item.key, e.target.value)}
                        rows={2}
                        className={INPUT + ' resize-none'}
                      />
                    ) : (
                      <input
                        value={item.value}
                        onChange={e => update(item.key, e.target.value)}
                        className={INPUT}
                        type={item.key.includes('count') ? 'number' : item.key.includes('url') || item.key === 'email' ? 'url' : 'text'}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-300/70 text-xs leading-relaxed">
          Các thay đổi được lưu vào Supabase và hiển thị lên website sau vài giây (cache 60s).
          Nhấn <strong className="text-blue-300">“Lưu”</strong> để áp dụng tất cả thay đổi cùng lúc.
        </p>
      </div>
    </div>
  )
}
