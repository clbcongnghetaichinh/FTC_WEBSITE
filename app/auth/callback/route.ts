import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch { }
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)

    // Tạo Profile cho người dùng mới
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!profile) {
        await supabase.from('profiles').insert({
          id: user.id,
          display_name: user.user_metadata.full_name || 'Thành viên FTC',
          avatar_url: user.user_metadata.avatar_url || ''
        })
      }
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dien-dan`)
}