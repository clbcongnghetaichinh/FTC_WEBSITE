'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, Building2, Calendar, ToggleLeft } from 'lucide-react'
import { useAdminCrud } from '@/hooks/useAdminCrud'
import { useToast } from '@/components/admin/Toast'
import { useAdminLang } from '@/context/AdminLangContext'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { LoadingSkeleton } from '@/components/admin/LoadingSkeleton'

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
  season: '', is_open: false, deadline: '', form_url: '',
  description: '', requirements: [], departments: [], banner_url: '',
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder-white/20'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function AdminRecruitmentPage() {
  const { t } = useAdminLang()
  const toast = useToast()
  const { items, loading, saving, save, remove } = useAdminCrud<Recruitment>('/api/admin/recruitment')

  const [editing, setEditing] = useState<Recruitment | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  function reqText(item: Recruitment) { return (item.requirements ?? []).join('\n') }
  function setReq(text: string) {
    if (!editing) return
    setEditing({ ...editing, requirements: text.split('\n').map(s => s.trim()).filter(Boolean) })
  }
  function deptText(item: Recruitment) { return (item.departments ?? []).join('\n') }
  function setDept(text: string) {
    if (!editing) return
    setEditing({ ...editing, departments: text.split('\n').map(s => s.trim()).filter(Boolean) })
  }

  async function handleSave() {
    if (!editing) return
    if (!editing.season.trim()) { setFormError('Tên mùa tuyển là bắt buộc'); return }
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
          <h1 className="text-xl font-black text-white">{t('recruitment.title')}</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} mùa tuyển</p>
        </div>
        <button
          onClick={() => { setEditing({ id: '', ...EMPTY }); setIsNew(true); setFormError('') }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-sm font-semibold hover:from-green-400 hover:to-emerald-500 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> {t('recruitment.add')}
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} variant="list" />
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="group bg-white/5 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.is_open ? 'bg-green-500/20' : 'bg-white/5'
                }`}>
                  <Building2 className={`w-6 h-6 ${item.is_open ? 'text-green-400' : 'text-white/30'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm">{item.season}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      item.is_open
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-white/5 text-white/30'
                    }`}>
                      {item.is_open ? 'Đang mở' : 'Đã đóng'}
                    </span>
                  </div>
                  {item.deadline && (
                    <p className="text-white/40 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Hạn: {new Date(item.deadline).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-white/30 text-xs mt-1 line-clamp-1">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing({ ...item }); setIsNew(false); setFormError('') }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-cyan-400 text-xs flex items-center gap-1">
                    <Pencil className="w-3 h-3" /> {t('edit')}
                  </button>
                  <button onClick={() => setDeleteId(item.id)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 text-xs flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && !loading && (
            <div className="text-center py-20 text-white/30 text-sm">{t('no_data')}</div>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/8 sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">
                {isNew ? t('recruitment.add') : t('recruitment.title')}
              </h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-white/30 hover:text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{formError}</div>
              )}
              <Field label={`${t('recruitment.season')} *`}>
                <input value={editing.season} onChange={e => setEditing({ ...editing, season: e.target.value })} className={INPUT} placeholder="VD: Mùa tuyển 2025" />
              </Field>
              <Field label={t('recruitment.description')}>
                <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className={INPUT} placeholder="Mô tả mùa tuyển..." />
              </Field>
              <Field label={t('recruitment.deadline')}>
                <input type="datetime-local" value={editing.deadline?.slice(0, 16) ?? ''}
                  onChange={e => setEditing({ ...editing, deadline: e.target.value })}
                  className={INPUT} />
              </Field>
              <Field label={t('recruitment.form_url')}>
                <input value={editing.form_url} onChange={e => setEditing({ ...editing, form_url: e.target.value })} className={INPUT} placeholder="https://forms.google.com/..." />
              </Field>
              <Field label={t('recruitment.is_open')}>
                <div className="flex items-center gap-3 pt-1">
                  <button type="button"
                    onClick={() => setEditing({ ...editing, is_open: !editing.is_open })}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_open ? 'bg-green-500' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${editing.is_open ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span className="text-white/60 text-sm">{editing.is_open ? 'Đang mở tuyển' : 'Đã đóng'}</span>
                </div>
              </Field>
              <Field label="Yêu cầu (mỗi dòng 1 mục)">
                <textarea value={reqText(editing)} onChange={e => setReq(e.target.value)} rows={3} className={INPUT}
                  placeholder="Sinh viên năm 1-3&#10;Nhiệt tình, năng động&#10;Không yêu cầu kinh nghiệm" />
              </Field>
              <Field label="Các ban cần tuyển (mỗi dòng 1 ban)">
                <textarea value={deptText(editing)} onChange={e => setDept(e.target.value)} rows={3} className={INPUT}
                  placeholder="Ban Học Thuật&#10;Ban Truyền Thông" />
              </Field>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/8 sticky bottom-0 bg-[#001829]">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">{t('cancel')}</button>
              <button onClick={handleSave} disabled={saving || !editing.season}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
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
