import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callAI } from '@/lib/aiProvider'
import { PLAN_HIERARCHY } from '@/lib/supabase/types'
import type { PlanType } from '@/lib/supabase/types'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('users').select('plan_type').eq('id', user.id).single()
    const userPlan = (profile?.plan_type || 'free') as PlanType
    if (PLAN_HIERARCHY[userPlan] < PLAN_HIERARCHY['standard']) {
      return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
    }

    const { text, subsidyName } = await request.json()
    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: '最低50文字以上入力してください' }, { status: 400 })
    }

    const prompt = `以下の補助金申請書のテキストをレビューしてください。

${subsidyName ? '補助金名: ' + subsidyName : ''}

申請書テキスト:
${text.slice(0, 3000)}

以下の観点でレビューし、具体的な改善提案をしてください:
1. 全体の論理構成・説得力
2. 具体性（数値目標・スケジュールの有無）
3. 審査員が重視するポイントへの対応
4. 文章の分かりやすさ
5. 総合評価（100点満点）

日本語で回答してください。`

    const review = await callAI('gemini', prompt)
    return NextResponse.json({ review })
  } catch (e) {
    console.error('Review error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}