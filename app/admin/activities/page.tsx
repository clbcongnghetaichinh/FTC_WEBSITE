'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, Calendar, Users, Clock, Star } from 'lucide-react'
import { useAdminCrud } from '@/hooks/useAdminCrud'
import { useToast } from '@/components/admin/Toast'
import { useAdminLang } from '@/context/AdminLangContext'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { LoadingSkeleton } from '@/components/admin/LoadingSkeleton'
import { ImageUploader } from '@/components/admin/ImageUploader'

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
  status_color: string
  highlights: string[]
  color: string
  sort_order: number
  is_published: boolean
}

const CATEGORIES = ['Học thuật', 'Trải nghiệm', 'Đào tạo', 'Nghề nghiệp', 'Gắn kết']
const STATUSES  = ['Sắp diễn ra', 'Đang diễn ra', 'Đã kết thúc']

const EMPTY: Omit<Activity, 'id'> = {
  title: '', body: '', img_url: '', alt: '',
  category: 'Học thuật', duration: '', participants: '',
  status: 'Sắp diễn ra',
  status_color: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  highlights: [], color: 'from-blue-500 to-cyan-500',
  sort_order: 0, is_published: true,
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-white/20'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function AdminActivitiesPage() {
  const { t } = useAdminLang()
  const toast = useToast()
  const { items, loading, saving, save, remove } = useAdminCrud<Activity>('/api/admin/activities')

  const [editing, setEditing] = useState<Activity | null>(null)
  const [isNew, setIsNew]     = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [filterCat, setFilterCat] = useState(t('all'))

  const filtered = filterCat === t('all') || filterCat === 'Tất cả' || filterCat === 'All'
    ? items
    : items.filter(a => a.category === filterCat)

  function openNew() {
    setEditing({ id: '', ...EMPTY })
    setIsNew(true)
    setFormError('')
  }

  async function handleSave() {
    if (!editing) return
    if (!editing.title.trim() || !editing.body.trim()) {
      setFormError('Tiêu đề và nội dung là bắt buộc')
      return
    }
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

  // Chuyển highlights string[] ⇔ textarea string
  const highlightsText = (editing?.highlights ?? []).join('\n')
  function setHighlights(text: string) {
    if (!editing) return
    setEditing({ ...editing, highlights: text.split('\n').map(s => s.trim()).filter(Boolean) })
  }

  const CATEGORY_COLORS: Record<string, string> = {
    'Học thuật': 'from-blue-500 to-cyan-500',
    'Trải nghiệm': 'from-green-500 to-emerald-500',
    'Đào tạo': 'from-purple-500 to-violet-500',
    'Nghề nghiệp': 'from-amber-700 to-yellow-800',
    'Gắn kết': 'from-pink-500 to-rose-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">{t('activities.title')}</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} hoạt động</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl text-white text-sm font-semibold hover:from-blue-400 hover:to-cyan-500 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> {t('activities.add')}
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[t('all'), ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterCat === cat
                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40'
                : 'bg-white/5 text-white/40 hover:text-white/60 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <LoadingSkeleton count={4} variant="list" />
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className="group bg-white/5 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all"
            >
              <div className="flex items-start gap-4">
                {item.img_url && (
                  <img
                    src={item.img_url}
                    alt={item.alt || item.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
                      CATEGORY_COLORS[item.category] || 'from-blue-500 to-cyan-500'
                    }`}>{item.category}</span>
                    {!item.is_published && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10">{t('hidden')}</span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
                  <p className="text-white/40 text-xs mt-1 line-clamp-2">{item.body}</p>
                  <div className="flex gap-3 mt-2 text-white/30 text-xs">
                    {item.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration}</span>}
                    {item.participants && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{item.participants}</span>}
                    {item.highlights?.length > 0 && <span className="flex items-center gap-1"><Star className="w-3 h-3" />{item.highlights.length} highlights</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => { setEditing({ ...item }); setIsNew(false); setFormError('') }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-cyan-400 text-xs flex items-center gap-1 transition-all"
                  >
                    <Pencil className="w-3 h-3" /> {t('edit')}
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 text-xs flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !loading && (
            <div className="text-center py-20 text-white/30 text-sm">{t('no_data')}</div>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/8 sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">
                {isNew ? t('activities.add') : t('activities.edit')}
              </h2>
              <button onClick={() => setEditing(null)}>
                <X className="w-5 h-5 text-white/30 hover:text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{formError}</div>
              )}

              <Field label={`${t('activities.act_title')} *`}>
                <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={INPUT} placeholder="VD: Workshop FinTech 2025" />
              </Field>

              <Field label={`${t('activities.body')} *`}>
                <textarea value={editing.body} onChange={e => setEditing({ ...editing, body: e.target.value })} rows={4} className={INPUT} placeholder="Mô tả chi tiết hoạt động..." />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label={t('activities.category')}>
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value, color: CATEGORY_COLORS[e.target.value] || editing.color })} className={INPUT}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Trạng thái">
                  <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })} className={INPUT}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label={t('activities.duration')}>
                  <input value={editing.duration} onChange={e => setEditing({ ...editing, duration: e.target.value })} className={INPUT} placeholder="VD: 3 giờ" />
                </Field>
                <Field label={t('activities.participants')}>
                  <input value={editing.participants} onChange={e => setEditing({ ...editing, participants: e.target.value })} className={INPUT} placeholder="VD: 50+ người" />
                </Field>
              </div>

              <Field label="Alt text (ảnh)">
                <input value={editing.alt} onChange={e => setEditing({ ...editing, alt: e.target.value })} className={INPUT} placeholder="Mô tả ảnh cho SEO" />
              </Field>

              <ImageUploader
                value={editing.img_url}
                onChange={url => setEditing({ ...editing, img_url: url })}
                bucket="images"
                folder="activities"
                label={t('image_url')}
              />

              <Field label={`${t('activities.highlights')} (mỗi dòng 1 điểm)`}>
                <textarea
                  value={highlightsText}
                  onChange={e => setHighlights(e.target.value)}
                  rows={4}
                  className={INPUT}
                  placeholder="Workshop thực tiễn&#10;Chuyên gia từ nghiêp vụ&#10;Chứng chỉ tham dự"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label={t('sort_order')}>
                  <input type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: +e.target.value })} className={INPUT} />
                </Field>
                <Field label={t('published')}>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, is_published: !editing.is_published })}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_published ? 'bg-blue-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${editing.is_published ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className="text-white/60 text-sm">{editing.is_published ? t('published') : t('hidden')}</span>
                  </div>
                </Field>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-white/8 sticky bottom-0 bg-[#001829]">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">{t('cancel')}</button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.title || !editing.body}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
              >
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
