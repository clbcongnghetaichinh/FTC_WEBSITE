'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, Trophy } from 'lucide-react'
import { useAdminCrud } from '@/hooks/useAdminCrud'
import { useToast } from '@/components/admin/Toast'
import { useAdminLang } from '@/context/AdminLangContext'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { LoadingSkeleton } from '@/components/admin/LoadingSkeleton'
import { ImageUploader } from '@/components/admin/ImageUploader'

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
  category: 'Giải thưởng', img_url: '', sort_order: 0, is_published: true,
}

const CATEGORY_COLORS: Record<string, string> = {
  'Giải thưởng': 'bg-yellow-500/20 text-yellow-300',
  'Dự án': 'bg-blue-500/20 text-blue-300',
  'Sự kiện': 'bg-green-500/20 text-green-300',
  'Hợp tác': 'bg-purple-500/20 text-purple-300',
  'Khác': 'bg-pink-500/20 text-pink-300',
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder-white/20'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function AdminAchievementsPage() {
  const { t } = useAdminLang()
  const toast = useToast()
  const { items, loading, saving, save, remove } = useAdminCrud<Achievement>('/api/admin/achievements')

  const [editing, setEditing] = useState<Achievement | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [filterCat, setFilterCat] = useState(t('all'))

  const filtered = filterCat === t('all') || filterCat === 'Tất cả' || filterCat === 'All'
    ? items
    : items.filter(a => a.category === filterCat)

  async function handleSave() {
    if (!editing) return
    if (!editing.title.trim()) { setFormError('Tiêu đề là bắt buộc'); return }
    setFormError('')
    const result = await save(editing)
    if (!result.ok) { setFormError(result.error || t('error_save')); return }
    setEditing(null)
    toast.success(t('saved_ok'))
  }

  async function handleDelete() {
    if (!deleteId) return
    const r = await remove(deleteId)
    setDeleteId(null)
    r.ok ? toast.success(t('deleted_ok')) : toast.error(r.error || t('error_delete'))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">{t('achievements.title')}</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} mục</p>
        </div>
        <button
          onClick={() => { setEditing({ id: '', ...EMPTY }); setIsNew(true); setFormError('') }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl text-white text-sm font-semibold hover:from-amber-400 hover:to-yellow-500 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> {t('achievements.add')}
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[t('all'), ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterCat === cat
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                : 'bg-white/5 text-white/40 hover:text-white/60 hover:bg-white/10'
            }`}>{cat}</button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <LoadingSkeleton count={4} variant="grid" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="group bg-white/5 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start gap-4">
                {item.img_url ? (
                  <img src={item.img_url} alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-8 h-8 text-amber-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span className={`px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] || 'bg-white/10 text-white/50'}`}>
                      {item.category}
                    </span>
                    <span className="text-white/40">{item.year}</span>
                    {!item.is_published && (
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/25 border border-white/10">{t('hidden')}</span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-white/40 text-xs line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditing({ ...item }); setIsNew(false); setFormError('') }}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-cyan-400 text-xs flex items-center justify-center gap-1 transition-all">
                  <Pencil className="w-3 h-3" /> {t('edit')}
                </button>
                <button onClick={() => setDeleteId(item.id)}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 text-xs flex items-center justify-center gap-1 transition-all">
                  <Trash2 className="w-3 h-3" /> {t('delete')}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-20 text-white/30 text-sm">{t('no_data')}</div>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/8 sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">
                {isNew ? t('achievements.add') : t('achievements.ach_title')}
              </h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-white/30 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{formError}</div>
              )}
              <Field label={`${t('achievements.ach_title')} *`}>
                <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={INPUT} placeholder="VD: Giải nhất cuộc thi..." />
              </Field>
              <Field label={t('achievements.description')}>
                <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className={INPUT} placeholder="Mô tả chi tiết..." />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('achievements.category')}>
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className={INPUT}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label={t('achievements.year')}>
                  <input type="number" value={editing.year} onChange={e => setEditing({ ...editing, year: +e.target.value })} className={INPUT} />
                </Field>
              </div>
              <ImageUploader
                value={editing.img_url}
                onChange={url => setEditing({ ...editing, img_url: url })}
                bucket="images"
                folder="achievements"
                label={t('image_url')}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('sort_order')}>
                  <input type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: +e.target.value })} className={INPUT} />
                </Field>
                <Field label={t('published')}>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="button" onClick={() => setEditing({ ...editing, is_published: !editing.is_published })}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_published ? 'bg-amber-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${editing.is_published ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className="text-white/60 text-sm">{editing.is_published ? t('published') : t('hidden')}</span>
                  </div>
                </Field>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/8 sticky bottom-0 bg-[#001829]">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">{t('cancel')}</button>
              <button onClick={handleSave} disabled={saving || !editing.title}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
                {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('saving')}</> : <><Save className="w-4 h-4" />{t('save')}</>}
              </button>
            </div>
          </div>
        </div>
      )}

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
