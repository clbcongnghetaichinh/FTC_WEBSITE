/**
 * LangToggle — Nút chuyển ngôn ngữ EN/VI cho Admin Panel
 * Đặt trong sidebar hoặc header
 */
'use client'

import { useAdminLang } from '@/context/AdminLangContext'

export function LangToggle() {
  const { lang, setLang } = useAdminLang()
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
      {(['vi', 'en'] as const).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
            lang === l
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/30'
              : 'text-white/30 hover:text-white/60'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
