'use client'

import { useRef, useState } from 'react'
import { Upload, Link, X, ImageIcon, Loader2, AlertCircle } from 'lucide-react'

type Props = {
  value: string          // current URL (shown in preview)
  onChange: (url: string) => void
  label?: string
  bucket?: string        // Supabase Storage bucket name, default 'ftc-media'
  className?: string
}

/**
 * ImageUploader — dual-mode:
 *  - Tab "Upload": chọn file từ máy, upload lên Supabase Storage
 *  - Tab "URL": nhập link ảnh thủ công
 *
 * Sử dụng:
 *   <ImageUploader value={form.avatar_url} onChange={url => setForm({...form, avatar_url: url})} />
 */
export default function ImageUploader({ value, onChange, label = 'Ảnh', bucket = 'ftc-media', className = '' }: Props) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [urlInput, setUrlInput] = useState(value || '')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', bucket)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Upload thất bại'); return }
      onChange(json.url)
      setUrlInput(json.url)
    } catch {
      setError('Lỗi kết nối')
    } finally {
      setUploading(false)
      // reset input so same file can be re-uploaded
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleUrlConfirm() {
    onChange(urlInput)
    setError('')
  }

  function clearImage() {
    onChange('')
    setUrlInput('')
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Preview */}
      {value && (
        <div className="relative mb-3 rounded-xl overflow-hidden border border-white/10 group">
          <img
            src={value}
            alt="preview"
            className="w-full h-40 object-cover"
            onError={e => { (e.target as HTMLImageElement).src = '' }}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-lg text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {!value && (
        <div className="mb-3 h-32 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-white/20" />
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex rounded-xl bg-white/5 p-1 mb-3">
        {(['upload', 'url'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === m ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {m === 'upload' ? <Upload className="w-3 h-3" /> : <Link className="w-3 h-3" />}
            {m === 'upload' ? 'Upload file' : 'Nhập URL'}
          </button>
        ))}
      </div>

      {/* Upload mode */}
      {mode === 'upload' && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            id="img-upload-input"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full py-2.5 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Đang upload...</>
            ) : (
              <><Upload className="w-4 h-4" /> Chọn ảnh từ máy</>  
            )}
          </button>
          <p className="text-white/25 text-xs mt-1.5 text-center">JPG, PNG, WebP, GIF • Tối đa 5MB</p>
        </div>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlConfirm()}
            placeholder="https://example.com/image.jpg"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 placeholder-white/20 transition-all"
          />
          <button
            type="button"
            onClick={handleUrlConfirm}
            className="px-3 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl text-cyan-400 text-sm font-semibold transition-all"
          >
            Áp dụng
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
