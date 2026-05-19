'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Save, X, Calendar } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { ToastContainer } from '@/components/admin/Toast'
import { useToast } from '@/components/admin/useToast'
import { useLang } from '@/context/AdminLangContext'

type Activity = {
  id: string
  title: string
  body: string
  category: string
  duration: string
  participants: number
  highlights: string
  img_url: string
  sort_order: number
  is_published: boolean
}

const CATEGORIES = ['Workshop','Seminar','Competition','Social','Training','Other']

const EMPTY: Omit<Activity,'id'> = {
  title:'',body:'',category:CATEGORIES[0],duration:'',
  participants:0,highlights:'',img_url:'',sort_order:0,is_published:true,
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder-white/20'

function Field({label,children}:{label:string;children:React.ReactNode}){
  return(
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function AdminActivitiesPage(){
  const router = useRouter()
  const {t} = useLang()
  const {toasts,addToast,dismiss} = useToast()
  const [items,setItems] = useState<Activity[]>([])
  const [loading,setLoading] = useState(true)
  const [editing,setEditing] = useState<Activity|null>(null)
  const [isNew,setIsNew] = useState(false)
  const [saving,setSaving] = useState(false)
  const [deleteId,setDeleteId] = useState<string|null>(null)
  const [error,setError] = useState('')
  const [filterCat,setFilterCat] = useState('all')

  const load = useCallback(async()=>{
    setLoading(true)
    try{
      const r = await fetch('/api/admin/activities')
      if(r.status===401){router.push('/admin/login');return}
      setItems(await r.json())
    }finally{setLoading(false)}
  },[router])

  useEffect(()=>{load()},[load])

  const filtered = filterCat==='all' ? items : items.filter(a=>a.category===filterCat)

  async function save(){
    if(!editing)return
    setSaving(true);setError('')
    const isNew_=isNew
    if(!isNew_) setItems(prev=>prev.map(a=>a.id===editing.id?editing:a))
    try{
      const r = await fetch('/api/admin/activities',{
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
      const r = await fetch('/api/admin/activities',{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:deleteId}),
      })
      if(!r.ok){addToast('error',t('delete_error'));load();return}
      addToast('success',t('deleted_ok'))
    }catch{addToast('error',t('delete_error'));load()}
  }

  const BADGE:Record<string,string> = {
    Workshop:'bg-blue-500/20 text-blue-300',
    Seminar:'bg-purple-500/20 text-purple-300',
    Competition:'bg-amber-500/20 text-amber-300',
    Social:'bg-green-500/20 text-green-300',
    Training:'bg-cyan-500/20 text-cyan-300',
    Other:'bg-white/10 text-white/50',
  }

  return(
    <div>
      <ToastContainer toasts={toasts} onDismiss={dismiss}/>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">{t('activities')}</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} {t('activities').toLowerCase()}</p>
        </div>
        <button onClick={()=>{setEditing({id:'',...EMPTY} as Activity);setIsNew(true);setError('')}}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg">
          <Plus className="w-4 h-4"/> {t('add_activity')}
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{key:'all',label:t('all')},...CATEGORIES.map(c=>({key:c,label:c}))].map(({key,label})=>(
          <button key={key} onClick={()=>setFilterCat(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterCat===key?'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40':'bg-white/5 text-white/40 hover:text-white/60'
            }`}>
            {label}{key!=='all'&&<span className="ml-1 text-white/30">{items.filter(a=>a.category===key).length}</span>}
          </button>
        ))}
      </div>

      {loading?(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({length:4}).map((_,i)=><div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse"/>)}
        </div>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(item=>(
            <div key={item.id} className="group bg-white/5 border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/15 transition-all">
              {item.img_url&&(
                <div className="h-36 overflow-hidden">
                  <img src={item.img_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e=>{(e.target as HTMLImageElement).parentElement!.style.display='none'}}/>
                </div>
              )}
              {!item.img_url&&(
                <div className="h-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-cyan-500/30"/>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-semibold text-sm line-clamp-2">{item.title}</h3>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-lg ${BADGE[item.category]||BADGE.Other}`}>{item.category}</span>
                </div>
                <p className="text-white/40 text-xs line-clamp-2 mb-3">{item.body}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-white/30">
                    {item.duration&&<span>{item.duration}</span>}
                    {item.participants>0&&<span>{item.participants} people</span>}
                    {!item.is_published&&<span className="text-amber-400/70">Draft</span>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>{setEditing({...item});setIsNew(false);setError('')}}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-cyan-400 transition-all">
                      <Pencil className="w-3 h-3"/>
                    </button>
                    <button onClick={()=>setDeleteId(item.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-all">
                      <Trash2 className="w-3 h-3"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length===0&&<div className="col-span-full text-center py-20 text-white/30 text-sm">{t('no_data')}</div>}
        </div>
      )}

      {/* Edit modal */}
      {editing&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08] sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">{isNew?t('add_activity'):t('edit')}</h2>
              <button onClick={()=>setEditing(null)}><X className="w-5 h-5 text-white/30 hover:text-white"/></button>
            </div>
            <div className="p-6 space-y-4">
              {error&&<div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{error}</div>}
              <Field label={t('title')+' *'}>
                <input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} className={INPUT} placeholder="Ten hoat dong"/>
              </Field>
              <Field label={t('category')}>
                <select value={editing.category} onChange={e=>setEditing({...editing,category:e.target.value})} className={INPUT}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={t('body')}>
                <textarea value={editing.body} onChange={e=>setEditing({...editing,body:e.target.value})} rows={4} className={INPUT} placeholder="Mo ta chi tiet hoat dong..."/>
              </Field>
              <ImageUploader label={t('img_url')} value={editing.img_url} onChange={url=>setEditing({...editing,img_url:url})}/>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('duration')}>
                  <input value={editing.duration} onChange={e=>setEditing({...editing,duration:e.target.value})} className={INPUT} placeholder="VD: 2 gio"/>
                </Field>
                <Field label={t('participants')}>
                  <input type="number" value={editing.participants} onChange={e=>setEditing({...editing,participants:+e.target.value})} className={INPUT}/>
                </Field>
              </div>
              <Field label={t('highlights')}>
                <textarea value={editing.highlights} onChange={e=>setEditing({...editing,highlights:e.target.value})} rows={2} className={INPUT} placeholder="Diem noi bat..."/>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('sort_order')}>
                  <input type="number" value={editing.sort_order} onChange={e=>setEditing({...editing,sort_order:+e.target.value})} className={INPUT}/>
                </Field>
                <Field label={t('status')}>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="button" onClick={()=>setEditing({...editing,is_published:!editing.is_published})}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_published?'bg-cyan-500':'bg-white/10'}`}>
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
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
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
