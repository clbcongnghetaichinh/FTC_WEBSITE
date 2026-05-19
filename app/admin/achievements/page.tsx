'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Save, X, Trophy } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { ToastContainer } from '@/components/admin/Toast'
import { useToast } from '@/components/admin/useToast'
import { useLang } from '@/context/AdminLangContext'

type Achievement = {
  id: string
  title: string
  description: string
  year: number
  img_url: string
  sort_order: number
  is_published: boolean
}

const EMPTY: Omit<Achievement,'id'> = {
  title:'',description:'',year:new Date().getFullYear(),
  img_url:'',sort_order:0,is_published:true,
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder-white/20'

function Field({label,children}:{label:string;children:React.ReactNode}){
  return(
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function AdminAchievementsPage(){
  const router = useRouter()
  const {t} = useLang()
  const {toasts,addToast,dismiss} = useToast()
  const [items,setItems] = useState<Achievement[]>([])
  const [loading,setLoading] = useState(true)
  const [editing,setEditing] = useState<Achievement|null>(null)
  const [isNew,setIsNew] = useState(false)
  const [saving,setSaving] = useState(false)
  const [deleteId,setDeleteId] = useState<string|null>(null)
  const [error,setError] = useState('')

  const load = useCallback(async()=>{
    setLoading(true)
    try{
      const r = await fetch('/api/admin/achievements')
      if(r.status===401){router.push('/admin/login');return}
      setItems(await r.json())
    }finally{setLoading(false)}
  },[router])

  useEffect(()=>{load()},[load])

  async function save(){
    if(!editing)return
    setSaving(true);setError('')
    const isNew_=isNew
    if(!isNew_) setItems(prev=>prev.map(a=>a.id===editing.id?editing:a))
    try{
      const r = await fetch('/api/admin/achievements',{
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
    setItems(prev=>prev.filter(a=>a.id!==deleteId))
    setDeleteId(null)
    try{
      const r = await fetch('/api/admin/achievements',{
        method:'DELETE',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:deleteId}),
      })
      if(!r.ok){addToast('error',t('delete_error'));load();return}
      addToast('success',t('deleted_ok'))
    }catch{addToast('error',t('delete_error'));load()}
  }

  // Group by year
  const byYear = items.reduce((acc,a)=>{
    const y = String(a.year)
    if(!acc[y]) acc[y]=[]
    acc[y].push(a)
    return acc
  },{} as Record<string,Achievement[]>)
  const years = Object.keys(byYear).sort((a,b)=>+b-+a)

  return(
    <div>
      <ToastContainer toasts={toasts} onDismiss={dismiss}/>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">{t('achievements')}</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} {t('achievements').toLowerCase()}</p>
        </div>
        <button onClick={()=>{setEditing({id:'',...EMPTY} as Achievement);setIsNew(true);setError('')}}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg">
          <Plus className="w-4 h-4"/> {t('add_achievement')}
        </button>
      </div>

      {loading?(
        <div className="space-y-4">
          {Array.from({length:3}).map((_,i)=><div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse"/>)}
        </div>
      ):items.length===0?(
        <div className="text-center py-20 text-white/30 text-sm">{t('no_data')}</div>
      ):(
        <div className="space-y-8">
          {years.map(year=>(
            <div key={year}>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-4 h-4 text-amber-400"/>
                <span className="text-amber-400 font-bold text-sm">{year}</span>
                <div className="flex-1 h-px bg-amber-500/20"/>
                <span className="text-white/30 text-xs">{byYear[year].length} items</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {byYear[year].map(item=>(
                  <div key={item.id} className="group flex items-center gap-4 bg-white/5 border border-white/[0.08] rounded-2xl p-4 hover:border-amber-500/20 transition-all">
                    {item.img_url?(
                      <img src={item.img_url} alt={item.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
                    ):(
                      <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-6 h-6 text-amber-500/50"/>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm truncate">{item.title}</div>
                      <div className="text-white/40 text-xs line-clamp-1 mt-0.5">{item.description}</div>
                      {!item.is_published&&<span className="text-xs text-amber-400/60">Draft</span>}
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=>{setEditing({...item});setIsNew(false);setError('')}}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-amber-400 transition-all">
                        <Pencil className="w-3 h-3"/>
                      </button>
                      <button onClick={()=>setDeleteId(item.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-all">
                        <Trash2 className="w-3 h-3"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08] sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">{isNew?t('add_achievement'):t('edit')}</h2>
              <button onClick={()=>setEditing(null)}><X className="w-5 h-5 text-white/30 hover:text-white"/></button>
            </div>
            <div className="p-6 space-y-4">
              {error&&<div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{error}</div>}
              <Field label={t('title')+' *'}>
                <input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} className={INPUT} placeholder="Ten thanh tich"/>
              </Field>
              <Field label={t('year')}>
                <input type="number" value={editing.year} onChange={e=>setEditing({...editing,year:+e.target.value})} className={INPUT} min={2000} max={2100}/>
              </Field>
              <Field label={t('description')}>
                <textarea value={editing.description} onChange={e=>setEditing({...editing,description:e.target.value})} rows={3} className={INPUT} placeholder="Mo ta..."/>
              </Field>
              <ImageUploader label={t('img_url')} value={editing.img_url} onChange={url=>setEditing({...editing,img_url:url})}/>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('sort_order')}>
                  <input type="number" value={editing.sort_order} onChange={e=>setEditing({...editing,sort_order:+e.target.value})} className={INPUT}/>
                </Field>
                <Field label={t('status')}>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="button" onClick={()=>setEditing({...editing,is_published:!editing.is_published})}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_published?'bg-amber-500':'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${editing.is_published?'left-7':'left-1'}`}/>
                    </button>
                    <span className="text-white/60 text-sm">{editing.is_published?t('published'):t('draft')}</span>
                  </div>
                </Field>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/[0.08] sticky bottom-0 bg-[#001829]">
              <button onClick={()=>setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">{t('cancel')}</button>
              <button onClick={save} disabled={saving||!editing.title}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
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
