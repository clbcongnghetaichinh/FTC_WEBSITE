'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Save, X, AlertCircle, Trophy } from 'lucide-react'

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

const CATEGORIES = ['Giải thưởng', 'Dự án', 'Sự kiện', 'Hợp tác', 'Khác']

const EMPTY: Omit<Achievement, 'id'> = {
  title: '', description: '', year: new Date().getFullYear(),
  category: 'Giải thưởng', img_url: '', sort_order: 0, is_published: true
}

export default function AdminAchievementsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const r = await fetch('/api/admin/achievements')
    if (r.status === 401) { router.push('/admin/login'); return }
    setItems(await r.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    if (!editing) return
    setSaving(true); setError('')
    try {
      const method = isNew ? 'POST' : 'PUT'
      const body = isNew ? { ...editing, id: undefined } : editing
      const r = await fetch('/api/admin/achievements', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })
      if (!r.ok) { const d = await r.json(); setError(d.error || 'Lỗi lưu'); return }
      setEditing(null); load()
    } finally { setSaving(false) }
  }

  async function confirmDelete() {
    if (!deleteId) return
    await fetch('/api/admin/achievements', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId })
    })
    setDeleteId(null); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Thành tích & Dự án</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} mục</p>
        </div>
        <button onClick={() => { setEditing({ id: '', ...EMPTY } as Achievement); setIsNew(true); setError('') }} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl text-white text-sm font-semibold hover:from-amber-400 hover:to-yellow-500 transition-all shadow-lg">
          <Plus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      {loading ? <div className="text-center py-20 text-white/30">Đang tải...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="group bg-white/5 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start gap-4">
                {item.img_url ? (
                  <img src={item.img_url} alt={item.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-8 h-8 text-amber-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">{item.category}</span>
                    <span>{item.year}</span>
                    {!item.is_published && <span className="px-2 py-0.5 rounded-full bg-white/10">Ẩn</span>}
                  </div>
                  {item.description && <p className="text-white/40 text-xs line-clamp-2">{item.description}</p>}
                </div>
              </div>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditing({...item}); setIsNew(false); setError('') }} className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-cyan-400 text-xs flex items-center justify-center gap-1 transition-all"><Pencil className="w-3 h-3" /> Sửa</button>
                <button onClick={() => setDeleteId(item.id)} className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 text-xs flex items-center justify-center gap-1 transition-all"><Trash2 className="w-3 h-3" /> Xóa</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="col-span-full text-center py-20 text-white/30 text-sm">Chưa có thành tích nào.</div>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/8 sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">{isNew ? 'Thêm thành tích' : 'Chỉnh sửa thành tích'}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-white/30 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{error}</div>}
              <Field label="Tiêu đề *"><input value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className={INPUT} placeholder="VD: Giải nhất cuộc thi..." /></Field>
              <Field label="Mô tả"><textarea value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} rows={3} className={INPUT} placeholder="Mô tả chi tiết..." /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Danh mục">
                  <select value={editing.category} onChange={e => setEditing({...editing, category: e.target.value})} className={INPUT}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Năm"><input type="number" value={editing.year} onChange={e => setEditing({...editing, year: +e.target.value})} className={INPUT} /></Field>
              </div>
              <Field label="URL ảnh"><input value={editing.img_url} onChange={e => setEditing({...editing, img_url: e.target.value})} className={INPUT} placeholder="https://..." /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Thứ tự"><input type="number" value={editing.sort_order} onChange={e => setEditing({...editing, sort_order: +e.target.value})} className={INPUT} /></Field>
                <Field label="Hiển thị">
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={() => setEditing({...editing, is_published: !editing.is_published})} className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_published ? 'bg-amber-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${editing.is_published ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className="text-white/60 text-sm">{editing.is_published ? 'Hiển thị' : 'Ẩn'}</span>
                  </div>
                </Field>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/8 sticky bottom-0 bg-[#001829]">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">Hủy</button>
              <button onClick={save} disabled={saving || !editing.title} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
                {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang lưu...</> : <><Save className="w-4 h-4" />Lưu</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-bold mb-2">Xác nhận xóa?</h3>
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

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder-white/20'
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>{children}</div>
}
