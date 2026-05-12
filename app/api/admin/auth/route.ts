import { NextRequest, NextResponse } from 'next/server'
import { adminLogin, adminLogout, SESSION_COOKIE_NAME } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const { action, email, password, token } = await req.json()

  if (action === 'login') {
    const result = await adminLogin(email, password)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }
    const res = NextResponse.json({ success: true })
    res.cookies.set(SESSION_COOKIE_NAME, result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    })
    return res
  }

  if (action === 'logout') {
    const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
    if (sessionToken) await adminLogout(sessionToken)
    const res = NextResponse.json({ success: true })
    res.cookies.delete(SESSION_COOKIE_NAME)
    return res
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
