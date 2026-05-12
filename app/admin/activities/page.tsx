'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, GripVertical, AlertCircle } from 'lucide-react'

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
  sort_order: number
  is_published: boolean
}

const CATEGORIES = ['Học thuật', 'Trải nghiệm', 'Đào tạo', 'Nghề nghiệp', 'Gắn kết']
const STATUSES = ['Đang diễn ra', 'Sắp diễn ra', 'Sắp tới', 'Thường niên', 'Hằng tuần', 'Hằng tháng', 'Thành công']

const EMPTY: Omit<Activity, 'id'> = {
  title: '', body: '', img_url: '', alt: '', category: 'Học thuật',
  duration: '', participants: '', status: 'Sắp diễn ra', highlights: ['', '', ''],
  sort_order: 0, is_published: true
}

export default function AdminActivitiesPage() {
  const router = useRouter()
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Activity | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const r = await fetch('/api/admin/activities')
    if (r.status === 401) { router.push('/admin/login'); return }
    setItems(await r.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function startNew() {
    setEditing({ id: '', ...EMPTY } as Activity)
    setIsNew(true)
    setError('')
  }

  function startEdit(item: Activity) {
    setEditing({ ...item, highlights: item.highlights?.length ? item.highlights : ['', '', ''] })
    setIsNew(false)
    setError('')
  }

  async function save() {
    if (!editing) return
    setSaving(true)
    setError('')
    try {
      const method = isNew ? 'POST' : 'PUT'
      const body = isNew ? { ...editing, id: undefined } : editing
      const r = await fetch('/api/admin/activities', {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, highlights: editing.highlights.filter(Boolean) })
      })
      if (!r.ok) { const d = await r.json(); setError(d.error || 'Lỗi lưu'); return }
      setEditing(null)
      load()
    } finally { setSaving(false) }
  }

  async function togglePublish(item: Activity) {
    await fetch('/api/admin/activities', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, is_published: !item.is_published })
    })
    load()
  }

  async function confirmDelete() {
    if (!deleteId) return
    await fetch('/api/admin/activities', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteId })
    })
    setDeleteId(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Hoạt động & Sự kiện</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} hoạt động</p>
        </div>
        <button onClick={startNew} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg">
          <Plus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30">Đang tải...</div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white/5 border border-white/8 rounded-2xl p-4 flex items-center gap-4 group hover:border-white/15 transition-all">
              <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
              {item.img_url && (
                <img src={item.img_url} alt={item.alt} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
                  {!item.is_published && <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/40">Ẩn</span>}
                </div>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="px-2 py-0.5 rounded-full bg-white/10">{item.category}</span>
                  <span>{item.status}</span>
                  {item.duration && <span>{item.duration}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => togglePublish(item)} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  {item.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-cyan-400 transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-20 text-white/30 text-sm">Chưa có hoạt động nào. Nhấn "Thêm mới" để bắt đầu.</div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/8 sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">{isNew ? 'Thêm hoạt động mới' : 'Chỉnh sửa hoạt động'}</h2>
              <button onClick={() => setEditing(null)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}

              <Field label="Tiêu đề *"><input value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className={INPUT} placeholder="VD: Cuộc thi ATTACKER" /></Field>
              <Field label="Mô tả *"><textarea value={editing.body} onChange={e => setEditing({...editing, body: e.target.value})} rows={4} className={INPUT} placeholder="Nội dung chi tiết hoạt động..." /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Danh mục">
                  <select value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})} className={INPUT}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Trạng thái">
                  <select value={editing.status} onChange={e => setEditing({...editing, status: e.target.value})} className={INPUT}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Thời lượng"><input value={editing.duration} onChange={e => setEditing({...editing, duration: e.target.value})} className={INPUT} placeholder="VD: 3 tháng" /></Field>
                <Field label="Số người tham gia"><input value={editing.participants} onChange={e => setEditing({...editing, participants: e.target.value})} className={INPUT} placeholder="VD: 100+ sinh viên" /></Field>
              </div>
              <Field label="URL ảnh"><input value={editing.img_url} onChange={e => setEditing({...editing, img_url: e.target.value})} className={INPUT} placeholder="https://..." /></Field>
              <Field label="Mô tả ảnh (alt)"><input value={editing.alt} onChange={e => setEditing({...editing, alt: e.target.value})} className={INPUT} placeholder="VD: Ảnh cuộc thi ATTACKER" /></Field>
              <Field label="Điểm nổi bật (mỗi ô 1 điểm)">
                <div className="space-y-2">
                  {[0, 1, 2].map(i => (
                    <input key={i} value={editing.highlights[i] || ''} onChange={e => { const h = [...editing.highlights]; h[i] = e.target.value; setEditing({...editing, highlights: h}) }} className={INPUT} placeholder={`Điểm nổi bật ${i + 1}`} />
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Thứ tự hiển thị"><input type="number" value={editing.sort_order} onChange={e => setEditing({...editing, sort_order: +e.target.value})} className={INPUT} /></Field>
                <Field label="Trạng thái hiển thị">
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={() => setEditing({...editing, is_published: !editing.is_published})} className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_published ? 'bg-cyan-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${editing.is_published ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className="text-white/60 text-sm">{editing.is_published ? 'Hiển thị' : 'Ẩn'}</span>
                  </div>
                </Field>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/8 sticky bottom-0 bg-[#001829]">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm transition-all">Hủy</button>
              <button onClick={save} disabled={saving || !editing.title || !editing.body} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-blue-500 transition-all">
                {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang lưu...</> : <><Save className="w-4 h-4" /> Lưu</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-white font-bold">Xác nhận xóa</h3>
            </div>
            <p className="text-white/60 text-sm mb-6">Bạn có chắc muốn xóa hoạt động này? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">Hủy</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-all">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder-white/20'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}
