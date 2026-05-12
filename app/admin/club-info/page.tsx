'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle, CheckCircle, Info } from 'lucide-react'

type InfoItem = { id: string; key: string; value: string; label: string }

export default function AdminClubInfoPage() {
  const router = useRouter()
  const [items, setItems] = useState<InfoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const r = await fetch('/api/admin/club-info')
    if (r.status === 401) { router.push('/admin/login'); return }
    setItems(await r.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function update(key: string, value: string) {
    setItems(items.map(item => item.key === key ? {...item, value} : item))
  }

  async function saveAll() {
    setSaving(true); setError(''); setSaved(false)
    try {
      const r = await fetch('/api/admin/club-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items.map(({ key, value }) => ({ key, value })))
      })
      if (!r.ok) { setError('Lưu thất bại, thử lại'); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  const groups = [
    { title: 'Thông tin cơ bản', keys: ['club_name', 'slogan'] },
    { title: 'Mạng xã hội & Liên hệ', keys: ['facebook_url', 'instagram_url', 'email', 'phone', 'address'] },
    { title: 'Số liệu thống kê', keys: ['member_count', 'project_count', 'partner_count', 'event_count'] },
  ]

  if (loading) return <div className="text-center py-20 text-white/30">Đang tải...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Thông tin CLB</h1>
          <p className="text-white/40 text-sm mt-0.5">Cập nhật thông tin hiển thị trên website</p>
        </div>
        <button onClick={saveAll} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl text-white text-sm font-semibold hover:from-pink-400 hover:to-rose-500 disabled:opacity-40 transition-all shadow-lg">
          {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang lưu...</> : <><Save className="w-4 h-4" />Lưu tất cả</>}
        </button>
      </div>

      {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
      {saved && <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />Đã lưu thành công!</div>}

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
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{item.label || item.key}</label>
                    {item.key === 'slogan' ? (
                      <textarea
                        value={item.value}
                        onChange={e => update(item.key, e.target.value)}
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500/50 transition-all placeholder-white/20 resize-none"
                      />
                    ) : (
                      <input
                        value={item.value}
                        onChange={e => update(item.key, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500/50 transition-all placeholder-white/20"
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
          Các thay đổi sẽ được lưu vào Supabase và hiển thị trên website ngay sau khi bạn nhấn <strong className="text-blue-300">"Lưu tất cả"</strong>. Đảm bảo các trang frontend đã được cập nhật để đọc dữ liệu từ API thay vì hardcode.
        </p>
      </div>
    </div>
  )
}
