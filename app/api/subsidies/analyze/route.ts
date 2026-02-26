import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callAI } from '@/lib/aiProvider'
import { PLAN_HIERARCHY } from '@/lib/supabase/types'
import type { PlanType } from '@/lib/supabase/types'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('users')
      .select('plan_type')
      .eq('id', user.id)
      .single()

    const userPlan = (profile?.plan_type || 'free') as PlanType
    if (PLAN_HIERARCHY[userPlan] < PLAN_HIERARCHY['light']) {
      return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
    }

    const { slug } = await request.json()
    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 })
    }

    const { data: s } = await supabase
      .from('subsidies')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!s) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    const prompt = `以下の補助金について、申請者向けに分析してください。

補助金名: ${s.title}
カテゴリ: ${s.category || '不明'}
難易度: ${s.difficulty || '不明'}
上限額: ${s.max_amount ? (s.max_amount / 10000).toLocaleString() + '万円' : '不明'}
締切: ${s.deadline || '不明'}
概要: ${s.summary || 'なし'}

以下の3点をそれぞれ2、3文で簡潔にまとめてください:
1. この補助金の特徴と強み
2. 申請時の注意点
3. 採択率を上げるためのポイント`

    const analysis = await callAI('gemini', prompt)
    return NextResponse.json({ analysis })
  } catch (e) {
    console.error('AI analysis error:', e)
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 })
  }
}