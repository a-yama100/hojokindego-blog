import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callAI } from '@/lib/aiProvider'
import { PLAN_HIERARCHY } from '@/lib/supabase/types'
import type { PlanType } from '@/lib/supabase/types'

const PURPOSE_TO_CATEGORY: Record<string, string> = {
  digitalization: 'digitalization',
  equipment: 'manufacturing',
  startup: 'startup',
  expansion: 'general',
  hiring: 'general',
  energy: 'general',
  reconstruction: 'reconstruction',
}

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

    const { industry, purpose, size } = await request.json()
    if (!industry || !purpose) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const category = PURPOSE_TO_CATEGORY[purpose] || 'general'
    const { data: subsidies } = await supabase
      .from('subsidies')
      .select('slug, title, category, difficulty, max_amount, target_score, deadline, summary')
      .eq('is_active', true)
      .order('target_score', { ascending: false })
      .limit(50)

    if (!subsidies || subsidies.length === 0) {
      return NextResponse.json({ results: [] })
    }

    // Filter by category match first, then fill with others
    const matched = subsidies.filter((s: any) => s.category === category)
    const others = subsidies.filter((s: any) => s.category !== category)
    const candidates = [...matched, ...others].slice(0, 15)

    const listText = candidates.map((s: any, i: number) => 
      `${i+1}. ${s.title} (${s.category}, ${s.difficulty}, ${s.max_amount ? (s.max_amount/10000)+'\u4e07\u5186' : '\u4e0d\u660e'})`
    ).join('\n')

    const prompt = `以下の条件に合う補助金を上位5件選び、それぞれの推蕠理由を日本語で30文字以内で述べてください。

業種: ${industry}
目的: ${purpose}
規模: ${size || '未指定'}

補助金一覧:
${listText}

JSON形式で回答してください: [{"index": 1, "reason": "推蕠理由"}]`

    try {
      const aiResult = await callAI('gemini', prompt)
      const jsonMatch = aiResult.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const picks = JSON.parse(jsonMatch[0])
        const results = picks.slice(0, 5).map((p: any) => {
          const s = candidates[p.index - 1]
          if (!s) return null
          return { ...s, match_reason: p.reason || '' }
        }).filter(Boolean)
        return NextResponse.json({ results })
      }
    } catch {}

    // Fallback: return top category matches
    const fallback = candidates.slice(0, 5).map((s: any) => ({
      ...s, match_reason: 'カテゴリが一致しています'
    }))
    return NextResponse.json({ results: fallback })
  } catch (e) {
    console.error('Matching error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}