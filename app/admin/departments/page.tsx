'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Save, X, Building2 } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { ToastContainer } from '@/components/admin/Toast'
import { useToast } from '@/components/admin/useToast'
import { useLang } from '@/context/AdminLangContext'

type Department = {
  id: string
  name: string
  description: string
  img_url: string
  sort_order: number
  is_active: boolean
}

const EMPTY: Omit<Department,'id'> = {
  name:'',description:'',img_url:'',sort_order:0,is_active:true,
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder-white/20'

function Field({label,children}:{label:string;children:React.ReactNode}){
  return(
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function AdminDepartmentsPage(){
  const router = useRouter()
  const {t} = useLang()
  const {toasts,addToast,dismiss} = useToast()
  const [items,setItems] = useState<Department[]>([])
  const [loading,setLoading] = useState(true)
  const [editing,setEditing] = useState<Department|null>(null)
  const [isNew,setIsNew] = useState(false)
  const [saving,setSaving] = useState(false)
  const [deleteId,setDeleteId] = useState<string|null>(null)
  const [error,setError] = useState('')

  const load = useCallback(async()=>{
    setLoading(true)
    try{
      const r = await fetch('/api/admin/departments')
      if(r.status===401){router.push('/admin/login');return}
      setItems(await r.json())
    }finally{setLoading(false)}
  },[router])

  useEffect(()=>{load()},[load])

  async function save(){
    if(!editing)return
    setSaving(true);setError('')
    const isNew_=isNew
    if(!isNew_) setItems(prev=>prev.map(d=>d.id===editing.id?editing:d))
    try{
      const r = await fetch('/api/admin/departments',{
        method:isNew_?'POST':'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(isNew_?{...editing,id:undefined}:editing),
      })
      const json = await r.json()
      if(!r.ok){setError(json.error||t('save_error'));load();return}
      if(isNew_) setItems(prev=>[...prev,json])
      setEditing(null)
      addToast('success',t('saved_ok'))
    }catch{setError(t('save_error'));load()}
    finally{setSaving(false)}
  }

  async function confirmDelete(){
    if(!deleteId)return
    setItems(prev=>prev.filter(d=>d.id!==deleteId))
    setDeleteId(null)
    try{
      const r = await fetch('/api/admin/departments',{
        method:'DELETE',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:deleteId}),
      })
      if(!r.ok){addToast('error',t('delete_error'));load();return}
      addToast('success',t('deleted_ok'))
    }catch{addToast('error',t('delete_error'));load()}
  }

  return(
    <div>
      <ToastContainer toasts={toasts} onDismiss={dismiss}/>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">{t('departments')}</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} {t('departments').toLowerCase()}</p>
        </div>
        <button onClick={()=>{setEditing({id:'',...EMPTY} as Department);setIsNew(true);setError('')}}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg">
          <Plus className="w-4 h-4"/> {t('add_department')}
        </button>
      </div>

      {loading?(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i)=><div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse"/>)}
        </div>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item=>(
            <div key={item.id} className="group bg-white/5 border border-white/[0.08] rounded-2xl overflow-hidden hover:border-green-500/20 transition-all">
              {item.img_url?(
                <div className="h-32 overflow-hidden">
                  <img src={item.img_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e=>{(e.target as HTMLImageElement).parentElement!.style.display='none'}}/>
                </div>
              ):(
                <div className="h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-green-500/30"/>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                  {!item.is_active&&<span className="text-xs px-2 py-0.5 rounded-lg bg-white/5 text-white/30">{t('inactive')}</span>}
                </div>
                <p className="text-white/40 text-xs line-clamp-2 mb-3">{item.description}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={()=>{setEditing({...item});setIsNew(false);setError('')}}
                    className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-green-400 text-xs flex items-center justify-center gap-1 transition-all">
                    <Pencil className="w-3 h-3"/> {t('edit')}
                  </button>
                  <button onClick={()=>setDeleteId(item.id)}
                    className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 text-xs flex items-center justify-center gap-1 transition-all">
                    <Trash2 className="w-3 h-3"/> {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length===0&&<div className="col-span-full text-center py-20 text-white/30 text-sm">{t('no_data')}</div>}
        </div>
      )}

      {editing&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08] sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">{isNew?t('add_department'):t('edit')}</h2>
              <button onClick={()=>setEditing(null)}><X className="w-5 h-5 text-white/30 hover:text-white"/></button>
            </div>
            <div className="p-6 space-y-4">
              {error&&<div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{error}</div>}
              <Field label={t('title')+' *'}>
                <input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})} className={INPUT} placeholder="Ten ban"/>
              </Field>
              <Field label={t('description')}>
                <textarea value={editing.description} onChange={e=>setEditing({...editing,description:e.target.value})} rows={3} className={INPUT} placeholder="Mo ta chuc nang, nhiem vu..."/>
              </Field>
              <ImageUploader label={t('img_url')} value={editing.img_url} onChange={url=>setEditing({...editing,img_url:url})}/>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('sort_order')}>
                  <input type="number" value={editing.sort_order} onChange={e=>setEditing({...editing,sort_order:+e.target.value})} className={INPUT}/>
                </Field>
                <Field label={t('status')}>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="button" onClick={()=>setEditing({...editing,is_active:!editing.is_active})}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_active?'bg-green-500':'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${editing.is_active?'left-7':'left-1'}`}/>
                    </button>
                    <span className="text-white/60 text-sm">{editing.is_active?t('active'):t('inactive')}</span>
                  </div>
                </Field>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/[0.08] sticky bottom-0 bg-[#001829]">
              <button onClick={()=>setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">{t('cancel')}</button>
              <button onClick={save} disabled={saving||!editing.name}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
                {saving?<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{t('saving')}</>:<><Save className="w-4 h-4"/>{t('save')}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-white font-bold mb-2">{t('confirm_delete')}</h3>
            <p className="text-white/50 text-sm mb-6">{t('cannot_undo')}</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white transition-all">{t('cancel')}</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-all">{t('delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
