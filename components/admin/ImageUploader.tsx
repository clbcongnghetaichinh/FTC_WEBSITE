/**
 * ImageUploader — Component upload ảnh lên Supabase Storage hoặc nhập URL
 *
 * Props:
 *   value: string           — URL ảnh hiện tại
 *   onChange: (url) => void — callback khi URL thay đổi
 *   bucket: string          — tên bucket Supabase Storage (default: 'images')
 *   folder?: string         — subfolder trong bucket (default: '')
 *   label?: string          — label hiển thị
 *
 * Cách dùng:
 *   <ImageUploader
 *     value={form.avatar_url}
 *     onChange={(url) => setForm({ ...form, avatar_url: url })}
 *     bucket="images"
 *     folder="members"
 *     label="Ảnh đại diện"
 *   />
 *
 * SETUP Supabase Storage:
 *   1. Vào Supabase Dashboard → Storage → New bucket
 *   2. Tên bucket: "images", bật Public
 *   3. Policy: cho phép INSERT với service_role
 */
'use client'

import { useRef, useState } from 'react'
import { Upload, Link, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  label?: string
  className?: string
}

export function ImageUploader({
  value,
  onChange,
  bucket = 'images',
  folder = '',
  label = 'Hình ảnh',
  className = '',
}: ImageUploaderProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    // Validate
    if (!file.type.startsWith('image/')) {
      setUploadError('Chỉ chấp nhận file ảnh (jpg, png, webp, gif)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File quá lớn — tối đa 5MB')
      return
    }

    setUploading(true)
    setUploadError('')

    // Tạo tên file unique để tránh conflict
    const ext = file.name.split('.').pop()
    const filename = `${folder ? folder + '/' : ''}${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { upsert: false })

    if (error) {
      setUploadError(`Upload thất bại: ${error.message}`)
      setUploading(false)
      return
    }

    // Lấy public URL
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path)
    onChange(publicUrl)
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const INPUT_CLASS = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder-white/20'

  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
        {label}
      </label>

      {/* Mode toggle */}
      <div className="flex gap-1 mb-3 bg-white/5 rounded-xl p-1 w-fit">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'url' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Link className="w-3 h-3" /> Nhập URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'upload' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          <Upload className="w-3 h-3" /> Upload file
        </button>
      </div>

      {mode === 'url' ? (
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={INPUT_CLASS}
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver ? 'border-cyan-400/60 bg-cyan-500/10' : 'border-white/15 hover:border-white/30 bg-white/3'
          } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              <span className="text-white/50 text-xs">Đang upload...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-white/30" />
              <span className="text-white/50 text-xs">Kéo thả ảnh vào đây hoặc click để chọn</span>
              <span className="text-white/25 text-xs">JPG, PNG, WebP — tối đa 5MB</span>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="mt-2 text-red-400 text-xs">{uploadError}</p>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-3 relative group w-full max-h-40 rounded-xl overflow-hidden border border-white/10">
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white/60 text-xs truncate">{value}</p>
          </div>
        </div>
      )}
    </div>
  )
}
