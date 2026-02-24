import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()
}

const JGRANTS_BASE = 'https://api.jgrants-portal.go.jp/exp/v1/public/subsidies'
const KEYWORDS = ['補助金', '助成金', 'IT導入', 'DX', '創業', 'ものづくり', '事業再構築', '持続化', '省エネ', '資金繰り', '雇用', '小規模', '中小企業', '設備投資', '販路拡大', 'デジタル', '転換', '地域振興']

function generateSlug(title: string, id: string): string {
  const shortId = id.substring(id.length - 8)
  return 'jg-' + shortId
}

function guessCategory(title: string, detail: string, industry: string): string {
  const text = title + ' ' + detail + ' ' + industry
  if (/IT|DX|\u30c7\u30b8\u30bf\u30eb|ICT|\u60c5\u5831/.test(text)) return 'digitalization'
  if (/\u88fd\u9020|\u3082\u306e\u3065\u304f\u308a|\u8a2d\u5099/.test(text)) return 'manufacturing'
  if (/\u5275\u696d|\u8d77\u696d|\u30b9\u30bf\u30fc\u30c8/.test(text)) return 'startup'
  if (/\u518d\u69cb\u7bc9|\u8ee2\u63db|\u65b0\u4e8b\u696d/.test(text)) return 'reconstruction'
  return 'general'
}

function guessDifficulty(maxAmount: number | null): string {
  if (!maxAmount) return '\u666e\u901a'
  if (maxAmount <= 1000000) return '\u7c21\u5358'
  if (maxAmount <= 10000000) return '\u666e\u901a'
  return '\u96e3\u3057\u3044'
}

function guessRegion(area: string): string {
  if (!area) return 'national'
  if (/\u5168\u56fd/.test(area)) return 'national'
  if (/\u6771\u4eac/.test(area)) return 'tokyo'
  if (/\u5927\u962a/.test(area)) return 'osaka'
  if (/\u611b\u77e5/.test(area)) return 'aichi'
  if (/\u798f\u5ca1/.test(area)) return 'fukuoka'
  return 'national'
}

function calcTargetScore(maxAmount: number | null, daysLeft: number): number {
  let score = 50
  if (maxAmount) {
    if (maxAmount >= 10000000) score += 15
    else if (maxAmount >= 1000000) score += 10
    else score += 5
  }
  if (daysLeft > 60) score += 20
  else if (daysLeft > 30) score += 10
  else if (daysLeft > 7) score += 5
  else score -= 10
  return Math.max(0, Math.min(100, score))
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  let totalNew = 0
  let totalUpdated = 0
  let totalSkipped = 0
  let totalErrors = 0
  const seenIds = new Set<string>()

  for (const keyword of KEYWORDS) {
    try {
      const params = new URLSearchParams({
        keyword: keyword,
        acceptance: '1',
        sort: 'acceptance_end_datetime',
        order: 'ASC',
      })
      const url = JGRANTS_BASE + '?' + params.toString()
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(30000),
      })
      if (!res.ok) {
        totalErrors++
        continue
      }

      const json = await res.json()
      const items = json?.result || []

      for (const item of items) {
        if (!item.id || !item.title) continue
        if (seenIds.has(item.id)) { totalSkipped++; continue }
        seenIds.add(item.id)

        const endDate = item.acceptance_end_datetime
          ? item.acceptance_end_datetime.split('T')[0]
          : null
        const startDate = item.acceptance_start_datetime
          ? item.acceptance_start_datetime.split('T')[0]
          : null

        const today = new Date()
        const daysLeft = endDate
          ? Math.ceil((new Date(endDate).getTime() - today.getTime()) / 86400000)
          : 30

        if (daysLeft < 0) { totalSkipped++; continue }

        const area = item.target_area_search || ''
        const slug = generateSlug(item.title, item.id)
        const detail = item.detail || item.subsidy_catch_phrase || ''

        const row = {
          jgrants_id: item.id,
          slug: slug,
          title: item.title,
          summary: detail ? detail.substring(0, 500) : null,
          category: guessCategory(item.title, detail, item.industry || ''),
          region: guessRegion(area),
          max_amount: item.subsidy_max_limit || null,
          difficulty: guessDifficulty(item.subsidy_max_limit),
          target_score: calcTargetScore(item.subsidy_max_limit, daysLeft),
          deadline: endDate,
          ministry: null,
          official_url: item.front_subsidy_detail_page_url || null,
          jgrants_url: 'https://www.jgrants-portal.go.jp/subsidy/' + item.id,
          subsidy_rate: null,
          target_industry: item.industry || null,
          target_employees: item.target_number_of_employees || null,
          detail: detail || null,
          acceptance_start: startDate,
          acceptance_end: endDate,
          is_active: true,
          last_checked: today.toISOString().split('T')[0],
          updated_at: today.toISOString(),
        }

        const { data: existing } = await supabase
          .from('subsidies')
          .select('id')
          .eq('jgrants_id', item.id)
          .single()

        if (existing) {
          const { error } = await supabase
            .from('subsidies')
            .update(row)
            .eq('jgrants_id', item.id)
          if (error) totalErrors++
          else totalUpdated++
        } else {
          const newId = crypto.randomUUID()
          const { error } = await supabase
            .from('subsidies')
            .insert({ ...row, id: newId, created_at: today.toISOString() })
          if (error) totalErrors++
          else totalNew++
        }

        // Fetch detail if summary is missing
        if (!row.summary) {
          try {
            const detailUrl = 'https://api.jgrants-portal.go.jp/exp/v1/public/subsidies/id/' + item.id
            const detailRes = await fetch(detailUrl, {
              headers: { 'Accept': 'application/json' },
              signal: AbortSignal.timeout(15000),
            })
            if (detailRes.ok) {
              const detailJson = await detailRes.json()
              const d = detailJson?.result?.[0]
              if (d) {
                const updates: Record<string, any> = { updated_at: new Date().toISOString() }
                if (d.detail) updates.summary = stripHtml(d.detail).substring(0, 1000)
                if (d.detail) updates.detail = d.detail
                if (d.subsidy_rate) updates.subsidy_rate = d.subsidy_rate
                if (d.use_purpose) updates.target_industry = d.use_purpose
                if (d.front_subsidy_detail_page_url) updates.official_url = d.front_subsidy_detail_page_url
                if (Object.keys(updates).length > 1) {
                  await supabase.from('subsidies').update(updates).eq('jgrants_id', item.id)
                }
              }
            }
            await new Promise(r => setTimeout(r, 500))
          } catch {}
        }
      }

      await new Promise(r => setTimeout(r, 1500))
    } catch {
      totalErrors++
    }
  }

  return NextResponse.json({
    message: 'jGrants fetch completed',
    new: totalNew,
    updated: totalUpdated,
    skipped: totalSkipped,
    errors: totalErrors,
    keywords_used: KEYWORDS.length,
  })
}
