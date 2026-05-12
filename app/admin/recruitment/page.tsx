'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Save, X, AlertCircle, UserPlus, ToggleLeft, ToggleRight } from 'lucide-react'

type Recruitment = {
  id: string
  season: string
  is_open: boolean
  deadline: string
  form_url: string
  description: string
  requirements: string[]
  departments: string[]
  banner_url: string
}

const EMPTY: Omit<Recruitment, 'id'> = {
  season: '', is_open: false, deadline: '',
  form_url: '', description: '', requirements: ['', '', ''],
  departments: [], banner_url: ''
}

const ALL_DEPARTMENTS = ['Ban Chấp Hành', 'Ban Học Thuật', 'Ban Truyền Thông', 'Ban Sự Kiện', 'Ban Tài Chính', 'Ban Nhân Sự']

export default function AdminRecruitmentPage() {
  const router = useRouter()
  const [items, setItems] = useState<Recruitment[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Recruitment | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const r = await fetch('/api/admin/recruitment')
    if (r.status === 401) { router.push('/admin/login'); return }
    setItems(await r.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleOpen(item: Recruitment) {
    await fetch('/api/admin/recruitment', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, is_open: !item.is_open })
    })
    load()
  }

  async function save() {
    if (!editing) return
    setSaving(true); setError('')
    try {
      const method = isNew ? 'POST' : 'PUT'
      const body = { ...editing, requirements: editing.requirements.filter(Boolean) }
      if (isNew) delete (body as any).id
      const r = await fetch('/api/admin/recruitment', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })
      if (!r.ok) { const d = await r.json(); setError(d.error || 'Lỗi lưu'); return }
      setEditing(null); load()
    } finally { setSaving(false) }
  }

  async function confirmDelete() {
    if (!deleteId) return
    await fetch('/api/admin/recruitment', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId })
    })
    setDeleteId(null); load()
  }

  function toggleDept(dept: string) {
    if (!editing) return
    const depts = editing.departments.includes(dept)
      ? editing.departments.filter(d => d !== dept)
      : [...editing.departments, dept]
    setEditing({...editing, departments: depts})
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Tuyển thành viên</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} mùa tuyển dụng</p>
        </div>
        <button onClick={() => { setEditing({ id: '', ...EMPTY } as Recruitment); setIsNew(true); setError('') }} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-sm font-semibold hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg">
          <Plus className="w-4 h-4" /> Thêm mùa tuyển
        </button>
      </div>

      {loading ? <div className="text-center py-20 text-white/30">Đang tải...</div> : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="group bg-white/5 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.is_open ? 'bg-green-500/20' : 'bg-white/5'}`}>
                    <UserPlus className={`w-6 h-6 ${item.is_open ? 'text-green-400' : 'text-white/30'}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{item.season}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ item.is_open ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-white/10 text-white/40' }`}>
                        {item.is_open ? '🟢 Đang mở' : '⚫ Đã đóng'}
                      </span>
                      {item.deadline && <span className="text-xs text-white/40">Deadline: {new Date(item.deadline).toLocaleDateString('vi-VN')}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleOpen(item)} className={`p-2 rounded-lg transition-all ${ item.is_open ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-white/5 text-white/30 hover:text-green-400 hover:bg-green-500/10' }`}>
                    {item.is_open ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button onClick={() => { setEditing({...item, requirements: item.requirements?.length ? item.requirements : ['','','']}); setIsNew(false); setError('') }} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-cyan-400 transition-all"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {item.departments?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 ml-16">
                  {item.departments.map(d => <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/50">{d}</span>)}
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <div className="text-center py-20 text-white/30 text-sm">Chưa có mùa tuyển dụng nào.</div>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/8 sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">{isNew ? 'Thêm mùa tuyển dụng' : 'Chỉnh sửa'}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-white/30 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{error}</div>}
              <Field label="Tên mùa tuyển *"><input value={editing.season} onChange={e => setEditing({...editing, season: e.target.value})} className={INPUT} placeholder="VD: Tuyển thành viên Kỳ 1 - 2025" /></Field>
              <Field label="Mô tả"><textarea value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} rows={3} className={INPUT} placeholder="Thông tin chi tiết về đợt tuyển..." /></Field>
              <Field label="Link form đăng ký"><input value={editing.form_url} onChange={e => setEditing({...editing, form_url: e.target.value})} className={INPUT} placeholder="https://forms.google.com/..." /></Field>
              <Field label="Deadline">
                <input type="datetime-local" value={editing.deadline ? editing.deadline.slice(0,16) : ''} onChange={e => setEditing({...editing, deadline: e.target.value})} className={INPUT} />
              </Field>
              <Field label="URL banner">
                <input value={editing.banner_url} onChange={e => setEditing({...editing, banner_url: e.target.value})} className={INPUT} placeholder="https://..." />
              </Field>
              <Field label="Yêu cầu ứng viên">
                <div className="space-y-2">
                  {[0, 1, 2].map(i => <input key={i} value={editing.requirements[i] || ''} onChange={e => { const r = [...editing.requirements]; r[i] = e.target.value; setEditing({...editing, requirements: r}) }} className={INPUT} placeholder={`Yêu cầu ${i+1}`} />)}
                </div>
              </Field>
              <Field label="Các ban tuyển dụng">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ALL_DEPARTMENTS.map(dept => (
                    <button key={dept} onClick={() => toggleDept(dept)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${ editing.departments.includes(dept) ? 'bg-green-500/20 text-green-300 border-green-500/40' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20' }`}>{dept}</button>
                  ))}
                </div>
              </Field>
              <Field label="Trạng thái">
                <div className="flex items-center gap-3 pt-1">
                  <button onClick={() => setEditing({...editing, is_open: !editing.is_open})} className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_open ? 'bg-green-500' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${editing.is_open ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span className="text-white/60 text-sm">{editing.is_open ? '🟢 Đang mở đơn' : '⚫ Đã đóng đơn'}</span>
                </div>
              </Field>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/8 sticky bottom-0 bg-[#001829]">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm">Hủy</button>
              <button onClick={save} disabled={saving || !editing.season} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
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

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder-white/20'
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>{children}</div>
}
