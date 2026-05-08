import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const action = payload.function
    const body = payload.body

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
    
    // Kiểm tra người dùng
    const { data: { user } } = await supabase.auth.getUser()

    switch (action) {
      case 'fetchQuestions': {
        let query = supabase
          .from('questions')
          .select(`*, profiles:author_id(display_name, avatar_url)`)
          .order('created_at', { ascending: false })
        
        if (body.take) query = query.limit(body.take)
        
        const { data, error } = await query
        if (error) throw error
        return NextResponse.json({ ok: true, data: { items: data } })
      }

      case 'createQuestion': {
        if (!user) throw new Error("Bạn cần đăng nhập để đăng bài")
        
        let categoryEnum = 'DISCUSSION'
        if (body.category === 'Hỏi về câu lạc bộ') categoryEnum = 'CLUB'
        if (body.category === 'Hỏi về ngành học') categoryEnum = 'MAJOR'

        const { data, error } = await supabase
          .from('questions')
          .insert({
            title: body.title,
            content: body.content,
            category: categoryEnum,
            author_id: user.id,
            is_anonymous: body.anonymous || false
          })
          .select()
          .single()
          
        if (error) throw error
        return NextResponse.json({ ok: true, data })
      }

      default:
        return NextResponse.json({ 
          ok: false, 
          message: `Hành động ${action} đang được nâng cấp!` 
        })
    }

  } catch (error: any) {
    console.error('Forum API Error:', error)
    return NextResponse.json({
      ok: false,
      message: error.message || "Lỗi xử lý API",
    })
  }
}