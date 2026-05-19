'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Info, RefreshCw } from 'lucide-react'
import { ToastContainer } from '@/components/admin/Toast'
import { useToast } from '@/components/admin/useToast'
import { useLang } from '@/context/AdminLangContext'

type InfoRow = { key: string; value: string; label: string; type?: 'text'|'textarea'|'number'|'url' }

// Map key -> display label + input type
const FIELD_META: Record<string, { label: string; type?: InfoRow['type'] }> = {
  club_name:     { label: 'Ten cau lac bo' },
  slogan:        { label: 'Slogan', type: 'textarea' },
  email:         { label: 'Email', type: 'text' },
  phone:         { label: 'So dien thoai' },
  address:       { label: 'Dia chi', type: 'textarea' },
  facebook_url:  { label: 'Facebook URL', type: 'url' },
  youtube_url:   { label: 'YouTube URL', type: 'url' },
  instagram_url: { label: 'Instagram URL', type: 'url' },
  website_url:   { label: 'Website URL', type: 'url' },
  member_count:  { label: 'So thanh vien', type: 'number' },
  project_count: { label: 'So du an', type: 'number' },
  partner_count: { label: 'So doi tac', type: 'number' },
  event_count:   { label: 'So su kien', type: 'number' },
  founded_year:  { label: 'Nam thanh lap', type: 'number' },
  about:         { label: 'Gioi thieu CLB', type: 'textarea' },
  mission:       { label: 'Su menh', type: 'textarea' },
  vision:        { label: 'Tam nhin', type: 'textarea' },
}

// Group keys by section
const SECTIONS = [
  { title: 'Thong tin co ban', keys: ['club_name','slogan','founded_year','about'] },
  { title: 'Lien he', keys: ['email','phone','address'] },
  { title: 'Mang xa hoi', keys: ['facebook_url','youtube_url','instagram_url','website_url'] },
  { title: 'Thong ke', keys: ['member_count','project_count','partner_count','event_count'] },
  { title: 'Su menh & Tam nhin', keys: ['mission','vision'] },
]

const INPUT_BASE = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder-white/20'

export default function AdminClubInfoPage(){
  const router = useRouter()
  const {t} = useLang()
  const {toasts,addToast,dismiss} = useToast()
  const [rows,setRows] = useState<Record<string,string>>({})
  const [original,setOriginal] = useState<Record<string,string>>({})
  const [loading,setLoading] = useState(true)
  const [saving,setSaving] = useState(false)

  const load = useCallback(async()=>{
    setLoading(true)
    try{
      const r = await fetch('/api/admin/club-info')
      if(r.status===401){router.push('/admin/login');return}
      const data: {key:string;value:string}[] = await r.json()
      const map = Object.fromEntries(data.map(d=>[d.key,d.value]))
      setRows(map)
      setOriginal(map)
    }finally{setLoading(false)}
  },[router])

  useEffect(()=>{load()},[load])

  const isDirty = JSON.stringify(rows) !== JSON.stringify(original)

  async function save(){
    setSaving(true)
    try{
      const updates = Object.entries(rows).map(([key,value])=>({key,value}))
      const r = await fetch('/api/admin/club-info',{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(updates),
      })
      if(!r.ok){
        const json = await r.json()
        addToast('error',json.error||t('save_error'))
        return
      }
      setOriginal({...rows})
      addToast('success',t('saved_ok'))
    }catch{addToast('error',t('save_error'))}
    finally{setSaving(false)}
  }

  function reset(){
    setRows({...original})
  }

  function set(key:string,value:string){
    setRows(prev=>({...prev,[key]:value}))
  }

  if(loading){
    return(
      <div className="space-y-4">
        {Array.from({length:4}).map((_,i)=><div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse"/>)}
      </div>
    )
  }

  return(
    <div>
      <ToastContainer toasts={toasts} onDismiss={dismiss}/>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400"/>{t('club_info')}
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Thong tin hien thi ra website public</p>
        </div>
        <div className="flex gap-2">
          {isDirty&&(
            <button onClick={reset}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm transition-all">
              <RefreshCw className="w-4 h-4"/> Reset
            </button>
          )}
          <button onClick={save} disabled={saving||!isDirty}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all shadow-lg">
            {saving?<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{t('saving')}</>:<><Save className="w-4 h-4"/>{t('save')}</>}
          </button>
        </div>
      </div>

      {isDirty&&(
        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          Co thay doi chua duoc luu. Nhan Luu de ap dung.
        </div>
      )}

      <div className="space-y-6">
        {SECTIONS.map(section=>{
          const sectionKeys = section.keys.filter(k=>k in rows || k in FIELD_META)
          if(sectionKeys.length===0) return null
          return(
            <div key={section.title} className="bg-white/5 border border-white/[0.08] rounded-2xl p-5">
              <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">{section.title}</h2>
              <div className="space-y-4">
                {sectionKeys.map(key=>{
                  const meta = FIELD_META[key]
                  if(!meta) return null
                  const val = rows[key]??''
                  const isTextarea = meta.type==='textarea'
                  return(
                    <div key={key}>
                      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                        {t(key)||meta.label}
                      </label>
                      {isTextarea?(
                        <textarea
                          value={val}
                          onChange={e=>set(key,e.target.value)}
                          rows={3}
                          className={INPUT_BASE}
                        />
                      ):(
                        <input
                          type={meta.type||'text'}
                          value={val}
                          onChange={e=>set(key,e.target.value)}
                          className={INPUT_BASE}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Keys not in any section */}
        {(()=>{
          const allSectionKeys = SECTIONS.flatMap(s=>s.keys)
          const extra = Object.keys(rows).filter(k=>!allSectionKeys.includes(k))
          if(extra.length===0) return null
          return(
            <div className="bg-white/5 border border-white/[0.08] rounded-2xl p-5">
              <h2 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Khac</h2>
              <div className="space-y-4">
                {extra.map(key=>(
                  <div key={key}>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{key}</label>
                    <input type="text" value={rows[key]??''} onChange={e=>set(key,e.target.value)} className={INPUT_BASE}/>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
