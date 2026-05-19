'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Save, X, User } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import { ToastContainer } from '@/components/admin/Toast'
import { useToast } from '@/components/admin/useToast'
import { useLang } from '@/context/AdminLangContext'

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
  'Ban Chap Hanh','Ban Hoc Thuat','Ban Truyen Thong',
  'Ban Su Kien','Ban Tai Chinh','Ban Nhan Su','Thanh vien',
]

const EMPTY: Omit<Member,'id'> = {
  full_name:'',position:'',department:DEPARTMENTS[0],
  avatar_url:'',facebook_url:'',linkedin_url:'',email:'',bio:'',
  sort_order:0,is_active:true,
}

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder-white/20'

function Field({label,children}:{label:string;children:React.ReactNode}){
  return(
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function AdminMembersPage(){
  const router = useRouter()
  const {t} = useLang()
  const {toasts,addToast,dismiss} = useToast()
  const [items,setItems] = useState<Member[]>([])
  const [loading,setLoading] = useState(true)
  const [editing,setEditing] = useState<Member|null>(null)
  const [isNew,setIsNew] = useState(false)
  const [saving,setSaving] = useState(false)
  const [deleteId,setDeleteId] = useState<string|null>(null)
  const [error,setError] = useState('')
  const [filterDept,setFilterDept] = useState('all')

  const load = useCallback(async()=>{
    setLoading(true)
    try{
      const r = await fetch('/api/admin/members')
      if(r.status===401){router.push('/admin/login');return}
      setItems(await r.json())
    }finally{setLoading(false)}
  },[router])

  useEffect(()=>{load()},[load])

  const filtered = filterDept==='all' ? items : items.filter(m=>m.department===filterDept)

  async function save(){
    if(!editing)return
    setSaving(true);setError('')
    const isNew_=isNew
    if(!isNew_) setItems(prev=>prev.map(m=>m.id===editing.id?editing:m))
    try{
      const r = await fetch('/api/admin/members',{
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
    setItems(prev=>prev.filter(m=>m.id!==deleteId))
    setDeleteId(null)
    try{
      const r = await fetch('/api/admin/members',{
        method:'DELETE',
        headers:{'Content-Type':'application/json'},
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
          <h1 className="text-xl font-black text-white">{t('members')}</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} {t('members').toLowerCase()}</p>
        </div>
        <button onClick={()=>{setEditing({id:'',...EMPTY} as Member);setIsNew(true);setError('')}}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg">
          <Plus className="w-4 h-4"/> {t('add_member')}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[{key:'all',label:t('all')},...DEPARTMENTS.map(d=>({key:d,label:d}))].map(({key,label})=>(
          <button key={key} onClick={()=>setFilterDept(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterDept===key?'bg-purple-500/30 text-purple-300 border border-purple-500/40':'bg-white/5 text-white/40 hover:text-white/60'
            }`}>
            {label}{key!=='all'&&<span className="ml-1 text-white/30">{items.filter(m=>m.department===key).length}</span>}
          </button>
        ))}
      </div>

      {loading?(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:6}).map((_,i)=><div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse"/>)}
        </div>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item=>(
            <div key={item.id} className="group bg-white/5 border border-white/[0.08] rounded-2xl p-4 hover:border-white/15 transition-all">
              <div className="flex items-center gap-3 mb-3">
                {item.avatar_url?(
                  <img src={item.avatar_url} alt={item.full_name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
                ):(
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-purple-400"/>
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{item.full_name}</div>
                  <div className="text-white/40 text-xs truncate">{item.position}</div>
                </div>
                {!item.is_active&&<span className="ml-auto text-xs px-2 py-0.5 rounded-lg bg-white/5 text-white/30">{t('inactive')}</span>}
              </div>
              <div className="text-xs px-2 py-1 rounded-lg bg-white/[0.08] text-white/50 inline-block mb-3">{item.department}</div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={()=>{setEditing({...item});setIsNew(false);setError('')}}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-cyan-400 text-xs flex items-center justify-center gap-1 transition-all">
                  <Pencil className="w-3 h-3"/> {t('edit')}
                </button>
                <button onClick={()=>setDeleteId(item.id)}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 text-xs flex items-center justify-center gap-1 transition-all">
                  <Trash2 className="w-3 h-3"/> {t('delete')}
                </button>
              </div>
            </div>
          ))}
          {filtered.length===0&&<div className="col-span-full text-center py-20 text-white/30 text-sm">{t('no_data')}</div>}
        </div>
      )}

      {editing&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001829] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08] sticky top-0 bg-[#001829] z-10">
              <h2 className="text-white font-bold">{isNew?t('add_member'):t('edit')}</h2>
              <button onClick={()=>setEditing(null)}><X className="w-5 h-5 text-white/30 hover:text-white"/></button>
            </div>
            <div className="p-6 space-y-4">
              {error&&<div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">{error}</div>}
              <Field label={t('full_name')+' *'}>
                <input value={editing.full_name} onChange={e=>setEditing({...editing,full_name:e.target.value})} className={INPUT} placeholder="Nguyen Van A"/>
              </Field>
              <Field label={t('position')+' *'}>
                <input value={editing.position} onChange={e=>setEditing({...editing,position:e.target.value})} className={INPUT} placeholder="Truong ban"/>
              </Field>
              <Field label={t('department')}>
                <select value={editing.department} onChange={e=>setEditing({...editing,department:e.target.value})} className={INPUT}>
                  {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <ImageUploader label={t('avatar_url')} value={editing.avatar_url} onChange={url=>setEditing({...editing,avatar_url:url})}/>
              <Field label={t('email')}>
                <input type="email" value={editing.email} onChange={e=>setEditing({...editing,email:e.target.value})} className={INPUT} placeholder="example@gmail.com"/>
              </Field>
              <Field label={t('facebook_url')}>
                <input value={editing.facebook_url} onChange={e=>setEditing({...editing,facebook_url:e.target.value})} className={INPUT} placeholder="https://fb.com/"/>
              </Field>
              <Field label={t('linkedin_url')}>
                <input value={editing.linkedin_url} onChange={e=>setEditing({...editing,linkedin_url:e.target.value})} className={INPUT} placeholder="https://linkedin.com/in/"/>
              </Field>
              <Field label={t('bio')}>
                <textarea value={editing.bio} onChange={e=>setEditing({...editing,bio:e.target.value})} rows={3} className={INPUT}/>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t('sort_order')}>
                  <input type="number" value={editing.sort_order} onChange={e=>setEditing({...editing,sort_order:+e.target.value})} className={INPUT}/>
                </Field>
                <Field label={t('status')}>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="button" onClick={()=>setEditing({...editing,is_active:!editing.is_active})}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${editing.is_active?'bg-purple-500':'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${editing.is_active?'left-7':'left-1'}`}/>
                    </button>
                    <span className="text-white/60 text-sm">{editing.is_active?t('active'):t('inactive')}</span>
                  </div>
                </Field>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/[0.08] sticky bottom-0 bg-[#001829]">
              <button onClick={()=>setEditing(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">{t('cancel')}</button>
              <button onClick={save} disabled={saving||!editing.full_name||!editing.position}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
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
