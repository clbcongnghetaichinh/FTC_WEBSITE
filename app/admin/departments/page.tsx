'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Save, X, AlertCircle, GripVertical } from 'lucide-react'

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

const COLOR_OPTIONS = [
  'from-red-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-violet-500',
  'from-amber-700 to-yellow-800',
  'from-indigo-500 to-blue-500',
  'from-pink-500 to-rose-500',
]

const ICON_OPTIONS = [
  'Shield', 'BookOpen', 'Calendar', 'Megaphone', 'Wallet', 'Users',
  'TrendingUp', 'Target', 'Search', 'FileText', 'Settings', 'Palette',
  'Video', 'GraduationCap', 'DollarSign', 'UserCheck', 'Calculator', 'Heart', 'Zap',
]

const EMPTY: Omit<Department, 'id'> = {
  title: '', category: '', icon_name: 'Shield',
  color: 'from-blue-500 to-cyan-500',
  card_gradient: 'from-blue-500 to-cyan-500',
  photos: [], quick_features: [], responsibilities: [],
  sort_order: 0, is_active: true,
}

export default function AdminDepartmentsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Department | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')
  // For editing responsibilities & features as text
  const [respText, setRespText] = useState('')
  const [featuresText, setFeaturesText] = useState('')
  const [photosText, setPhotosText] = useState('')

  async function load() {
    setLoading(true)
    const r = await fetch('/api/admin/departments')
    if (r.status === 401) { router.push('/admin/login'); return }
    setItems(await r.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openEdit(item: Department) {
    setEditing({ ...item })
    setIsNew(false)
    setError('')
    setRespText(item.responsibilities.join('\n'))
    setFeaturesText(item.quick_features.map(f => `${f.icon}|${f.text}|${f.color}`).join('\n'))
    setPhotosText(item.photos.join('\n'))
  }

  function openNew() {
    setEditing({ id: '', ...EMPTY } as Department)
    setIsNew(true)
    setError('')
    setRespText('')
    setFeaturesText('')
    setPhotosText('')
  }

  async function save() {
    if (!editing) return
    setSaving(true); setError('')
    try {
      const responsibilities = respText.split('\n').map(s => s.trim()).filter(Boolean)
      const photos = photosText.split('\n').map(s => s.trim()).filter(Boolean)
      const quick_features: QuickFeature[] = featuresText
        .split('\n').map(s => s.trim()).filter(Boolean)
        .map(line => {
          const [icon, text, color] = line.split('|')
          return { icon: icon?.trim() || 'Zap', text: text?.trim() || '', color: color?.trim() || 'text-white' }
        })

      const payload = { ...editing, responsibilities, photos, quick_features, card_gradient: editing.color }
      if (isNew) delete (payload as any).id

      const r = await fetch('/api/admin/departments', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!r.ok) { const d = await r.json(); setError(d.error || 'Lỗi lưu'); return }
      setEditing(null); load()
    } finally { setSaving(false) }
  }

  async function confirmDelete() {
    if (!deleteId) return
    await fetch('/api/admin/departments', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId })
    })
    setDeleteId(null); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Cơ cấu tổ chức / Ban</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} ban</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white text-sm font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg">
          <Plus className="w-4 h-4" /> Thêm ban mới
        </button>
      </div>

      {loading ? <div className="text-center py-20 text-white/30">Đang tải...</div> : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="group bg-white/5 border border-white/8 rounded-2xl p-4 flex items-center gap-4 hover:border-white/15 transition-all">
              <GripVertical className="w-4 h-4 text-white/20" />
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.card_gradient} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-bold">{item.title.slice(4, 6)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
                <p className="text-white/40 text-xs truncate">{item.category}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-cyan-400 transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-center py-20 text-white/30 text-sm">Chưa có ban nào. Nhấn "Thêm ban mới".</div>}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/8 sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">{isNew ? 'Thêm ban mới' : 'Chỉnh sửa ban'}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-white/30 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm flex gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}

              <Field label="Tên ban *"><input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={INPUT} placeholder="VD: BAN HỌC THUẬT" /></Field>
              <Field label="Mô tả ngắn (category)"><input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className={INPUT} placeholder="VD: Phụ trách chuyên môn học thuật" /></Field>

              <Field label="Icon">
                <select value={editing.icon_name} onChange={e => setEditing({ ...editing, icon_name: e.target.value })} className={INPUT}>
                  {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </Field>

              <Field label="Màu sắc">
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {COLOR_OPTIONS.map(c => (
                    <button key={c} onClick={() => setEditing({ ...editing, color: c, card_gradient: c })}
                      className={`h-9 rounded-xl bg-gradient-to-r ${c} border-2 transition-all ${ editing.color === c ? 'border-white scale-105' : 'border-transparent' }`} />
                  ))}
                </div>
              </Field>

              <Field label="Nhiệm vụ (mỗi dòng 1 nhiệm vụ)">
                <textarea
                  value={respText}
                  onChange={e => setRespText(e.target.value)}
                  rows={5} className={INPUT}
                  placeholder={`Nhiệm vụ 1\nNhiệm vụ 2\nNhiệm vụ 3`}
                />
              </Field>

              <Field label="Điểm nổi bật (mỗi dòng: TênIcon|Nội dung|text-color)">
                <textarea
                  value={featuresText}
                  onChange={e => setFeaturesText(e.target.value)}
                  rows={3} className={INPUT}
                  placeholder={`Search|Nghiên cứu Fintech|text-blue-400\nTarget|Đảm bảo chuyên môn|text-cyan-400`}
                />
                <p className="text-white/30 text-xs mt-1">Format: TênIcon|Nội dung|text-color-400</p>
              </Field>

              <Field label="URL ảnh (mỗi dòng 1 URL)">
                <textarea
                  value={photosText}
                  onChange={e => setPhotosText(e.target.value)}
                  rows={3} className={INPUT}
                  placeholder="/BAN HỌC THUẬT.JPG\nhttps://...cdn.../photo.jpg"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Thứ tự hiển thị"><input type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: +e.target.value })} className={INPUT} /></Field>
                <Field label="Trạng thái">
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={() => setEditing({ ...editing, is_active: !editing.is_active })} className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_active ? 'bg-emerald-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${editing.is_active ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className="text-white/60 text-sm">{editing.is_active ? 'Hiển thị' : 'Ẩn'}</span>
                  </div>
                </Field>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-white/8 sticky bottom-0 bg-[#001829]">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">Hủy</button>
              <button onClick={save} disabled={saving || !editing.title} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
                {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang lưu...</> : <><Save className="w-4 h-4" />Lưu</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-bold mb-2">Xác nhận xóa ban?</h3>
            <p className="text-white/50 text-sm mb-6">Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm">Hủy</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder-white/20 resize-none'
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>{children}</div>
}
