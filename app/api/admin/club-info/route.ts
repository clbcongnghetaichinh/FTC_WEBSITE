import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { verifyAdminSession, SESSION_COOKIE_NAME } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'

async function auth(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  return verifyAdminSession(token || '')
}

export async function GET(req: NextRequest) {
  if (!(await auth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabaseAdmin.from('club_info').select('*').order('key')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  if (!(await auth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const updates: { key: string; value: string }[] = await req.json()
  const results = await Promise.all(
    updates.map(({ key, value }) =>
      supabaseAdmin.from('club_info').update({ value }).eq('key', key)
    )
  )
  const errors = results.filter(r => r.error)
  if (errors.length > 0) return NextResponse.json({ error: 'Some updates failed' }, { status: 500 })
  revalidatePath('/')
  revalidatePath('/thong-tin')
  revalidatePath('/api/public/club-info')
  return NextResponse.json({ success: true })
}
