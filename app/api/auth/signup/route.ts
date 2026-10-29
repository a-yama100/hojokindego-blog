import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { rateLimit, clientIp, TOO_MANY } from '@/lib/security/rateLimit'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (typeof userId !== 'string' || typeof email !== 'string' || !userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    if (!UUID_RE.test(userId) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // 回数制限: 同じ IP から 1 時間に 5 回まで
    const ip = clientIp(request)
    if (!(await rateLimit('register:ip:' + ip, 3600, 5))) {
      return NextResponse.json(TOO_MANY, { status: 429 })
    }

    const supabase = createServiceClient()

    // 渡された userId が Supabase Auth に実在し、メールも一致するときだけ users に入れる
    // （確かめないと、誰でも任意の id・メールの行をサービスキーで作れてしまう）。
    // 一致しないとき（登録済みのメールで signUp したときの仮の id など）は、登録済みかどうかを出さないよう、何もせず成功を返す。
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId)
    const authEmail = String(authData?.user?.email || '').toLowerCase()
    if (authError || !authEmail || authEmail !== email.trim().toLowerCase()) {
      return NextResponse.json({ success: true })
    }

    const { error } = await supabase.from('users').insert({
      id: userId,
      email: authEmail,
      plan_type: 'free',
    })

    if (error) {
      // 既に行がある（二度目の呼び出し）ときもここに来る。DB のエラー文は画面に出さない。
      console.error('Error creating user:', error)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
