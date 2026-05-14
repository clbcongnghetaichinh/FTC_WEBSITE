import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession, SESSION_COOKIE_NAME } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * POST /api/admin/upload
 * Body: FormData with field "file" (image) and "bucket" (optional, default "ftc-media")
 * Returns: { url: string }
 *
 * Supabase Storage bucket "ftc-media" must be created with public access.
 * Để tạo bucket: Supabase Dashboard → Storage → New bucket → "ftc-media" → Public: true
 */
export async function POST(req: NextRequest) {
  // Auth check
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!(await verifyAdminSession(token || ''))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const bucket = (formData.get('bucket') as string) || 'ftc-media'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Chỉ hỗ trợ ảnh JPG, PNG, WebP, GIF, SVG' }, { status: 400 })
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Ảnh quá lớn, tối đa 5MB' }, { status: 400 })
  }

  // Generate unique filename: {timestamp}-{random}.{ext}
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path = `uploads/${filename}`

  const arrayBuffer = await file.arrayBuffer()
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path)

  return NextResponse.json({ url: urlData.publicUrl })
}
