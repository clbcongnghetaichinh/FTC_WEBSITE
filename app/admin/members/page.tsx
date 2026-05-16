'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, User } from 'lucide-react'
import { useAdminCrud } from '@/hooks/useAdminCrud'
import { useToast } from '@/components/admin/Toast'
import { useAdminLang } from '@/context/AdminLangContext'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { LoadingSkeleton } from '@/components/admin/LoadingSkeleton'
import { ImageUploader } from '@/components/admin/ImageUploader'

type Member = {
  id: string
  full_name: string
  position: string
  department: string
  avatar_url: string
  facebook_url: string
  linkedin_url: string
  email: string
  bio: string
  sort_order: number
  is_active: boolean
}

const DEPARTMENTS = [
  'Ban Chấp Hành', 'Ban Học Thuật', 'Ban Truyền Thông',
  'Ban Sự Kiện', 'Ban Tài Chính', 'Ban Nhân Sự', 'Thành viên'
]

const EMPTY: Omit<Member, 'id'> = {
  full_name: '', position: '', department: 'Ban Chấp Hành',
  avatar_url: '', facebook_url: '', linkedin_url: '',
  email: '', bio: '', sort_order: 0, is_active: true,
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder-white/20'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function AdminMembersPage() {
  const { t } = useAdminLang()
  const toast = useToast()
  const { items, loading, saving, save, remove } = useAdminCrud<Member>('/api/admin/members')

  const [editing, setEditing] = useState<Member | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [filterDept, setFilterDept] = useState(t('all'))

  const filtered = filterDept === t('all') || filterDept === 'Tất cả' || filterDept === 'All'
    ? items
    : items.filter(m => m.department === filterDept)

  function openNew() {
    setEditing({ id: '', ...EMPTY } as Member)
    setIsNew(true)
    setFormError('')
  }

  function openEdit(item: Member) {
    setEditing({ ...item })
    setIsNew(false)
    setFormError('')
  }

  async function handleSave() {
    if (!editing) return
    if (!editing.full_name.trim() || !editing.position.trim()) {
      setFormError('Họ tên và chức vụ là bắt buộc')
      return
    }
    setFormError('')
    const result = await save(editing)
    if (!result.ok) {
      setFormError(result.error || t('error_save'))
      return
    }
    setEditing(null)
    toast.success(t('saved_ok'))
  }

  async function handleDelete() {
    if (!deleteId) return
    const result = await remove(deleteId)
    setDeleteId(null)
    if (!result.ok) {
      toast.error(result.error || t('error_delete'))
    } else {
      toast.success(t('deleted_ok'))
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">{t('members.title')}</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} {t('nav_members').toLowerCase()}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl text-white text-sm font-semibold hover:from-purple-400 hover:to-violet-500 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> {t('members.add')}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[t('all'), ...DEPARTMENTS].map(dept => (
          <button
            key={dept}
            onClick={() => setFilterDept(dept)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterDept === dept
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
                : 'bg-white/5 text-white/40 hover:text-white/60 hover:bg-white/10'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <LoadingSkeleton count={6} variant="grid" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="group bg-white/5 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                {item.avatar_url ? (
                  <img
                    src={item.avatar_url}
                    alt={item.full_name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-purple-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{item.full_name}</div>
                  <div className="text-white/40 text-xs truncate">{item.position}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded-lg bg-white/8 text-white/50">{item.department}</span>
                {!item.is_active && (
                  <span className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                    {t('inactive')}
                  </span>
                )}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-cyan-400 text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <Pencil className="w-3 h-3" /> {t('edit')}
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <Trash2 className="w-3 h-3" /> {t('delete')}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 text-white/30 text-sm">
              {t('no_data')}
            </div>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-white/8 sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">
                {isNew ? t('members.add') : t('members.edit')}
              </h2>
              <button onClick={() => setEditing(null)}>
                <X className="w-5 h-5 text-white/30 hover:text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                  {formError}
                </div>
              )}

              <Field label={`${t('members.full_name')} *`}>
                <input
                  value={editing.full_name}
                  onChange={e => setEditing({ ...editing, full_name: e.target.value })}
                  className={INPUT}
                  placeholder="Nguyễn Văn A"
                />
              </Field>

              <Field label={`${t('members.position')} *`}>
                <input
                  value={editing.position}
                  onChange={e => setEditing({ ...editing, position: e.target.value })}
                  className={INPUT}
                  placeholder="VD: Trưởng ban"
                />
              </Field>

              <Field label={t('members.department')}>
                <select
                  value={editing.department}
                  onChange={e => setEditing({ ...editing, department: e.target.value })}
                  className={INPUT}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>

              {/* Image uploader: hỗ trợ cả URL lẫn upload thật */}
              <ImageUploader
                value={editing.avatar_url}
                onChange={url => setEditing({ ...editing, avatar_url: url })}
                bucket="images"
                folder="members"
                label={t('members.avatar')}
              />

              <Field label={t('members.email')}>
                <input
                  type="email"
                  value={editing.email}
                  onChange={e => setEditing({ ...editing, email: e.target.value })}
                  className={INPUT}
                  placeholder="example@gmail.com"
                />
              </Field>

              <Field label={t('members.facebook')}>
                <input
                  value={editing.facebook_url}
                  onChange={e => setEditing({ ...editing, facebook_url: e.target.value })}
                  className={INPUT}
                  placeholder="https://fb.com/..."
                />
              </Field>

              <Field label={t('members.linkedin')}>
                <input
                  value={editing.linkedin_url}
                  onChange={e => setEditing({ ...editing, linkedin_url: e.target.value })}
                  className={INPUT}
                  placeholder="https://linkedin.com/in/..."
                />
              </Field>

              <Field label={t('members.bio')}>
                <textarea
                  value={editing.bio}
                  onChange={e => setEditing({ ...editing, bio: e.target.value })}
                  rows={3}
                  className={INPUT}
                  placeholder="Mô tả ngắn về thành viên..."
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label={t('sort_order')}>
                  <input
                    type="number"
                    value={editing.sort_order}
                    onChange={e => setEditing({ ...editing, sort_order: +e.target.value })}
                    className={INPUT}
                  />
                </Field>

                <Field label={t('status')}>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, is_active: !editing.is_active })}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                        editing.is_active ? 'bg-purple-500' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
                        editing.is_active ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                    <span className="text-white/60 text-sm">
                      {editing.is_active ? t('active') : t('inactive')}
                    </span>
                  </div>
                </Field>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 p-6 border-t border-white/8 sticky bottom-0 bg-[#001829]">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.full_name || !editing.position}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-all"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('saving')}</>
                ) : (
                  <><Save className="w-4 h-4" />{t('save')}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        title={t('confirm_delete')}
        description={t('confirm_delete_desc')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
