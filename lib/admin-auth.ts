import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabase-admin'
import crypto from 'crypto'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ftc.club'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'FTC@Admin2025'
const SESSION_COOKIE = 'ftc_admin_session'
const SESSION_DURATION_HOURS = 24

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Email hoặc mật khẩu không đúng' }
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000)

  // Clean expired sessions
  await supabaseAdmin.from('admin_sessions').delete().lt('expires_at', new Date().toISOString())

  const { error } = await supabaseAdmin.from('admin_sessions').insert({ token, expires_at: expiresAt.toISOString() })
  if (error) return { success: false, error: 'Lỗi tạo phiên đăng nhập' }

  return { success: true, token }
}

export async function adminLogout(token: string) {
  await supabaseAdmin.from('admin_sessions').delete().eq('token', token)
}

export async function verifyAdminSession(token: string): Promise<boolean> {
  if (!token) return false
  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .select('id')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()
  return !error && !!data
}

export function getAdminToken(): string | undefined {
  try {
    const cookieStore = cookies()
    return cookieStore.get(SESSION_COOKIE)?.value
  } catch {
    return undefined
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE
