import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const JGRANTS_BASE = 'https://api.jgrants-portal.go.jp/exp/v1/public/subsidies'
const KEYWORDS = ['IT', 'DX', 'manufacturing', 'startup', 'subsidy']

function generateSlug(title: string, id: string): string {
  const base = title
    .replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\s-]/g, '')
    .trim()
    .substring(0, 50)
    .replace(/\s+/g, '-')
    .toLowerCase()
  return base ? base + '-' + id.substring(0, 6) : 'subsidy-' + id.substring(0, 10)
}

function guessCategory(title: string, detail: string, industry: string): string {
  const text = (title + ' ' + detail + ' ' + industry).toLowerCase()
  if (text.includes('it') || text.includes('digital') || text.includes('dx') || text.includes('\u30c7\u30b8\u30bf\u30eb')) return 'digitalization'
  if (text.includes('\u88fd\u9020') || text.includes('\u3082\u306e\u3065\u304f\u308a') || text.includes('manufacturing')) return 'manufacturing'
  if (text.includes('\u5275\u696d') || text.includes('startup') || text.includes('\u8d77\u696d')) return 'startup'
  if (text.includes('\u518d\u69cb\u7bc9') || text.includes('\u8ee2\u63db')) return 'reconstruction'
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
  if (area.includes('\u5168\u56fd')) return 'national'
  if (area.includes('\u6771\u4eac')) return 'tokyo'
  if (area.includes('\u5927\u962a')) return 'osaka'
  if (area.includes('\u611b\u77e5')) return 'aichi'
  if (area.includes('\u798f\u5ca1')) return 'fukuoka'
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
  let totalErrors = 0

  for (const keyword of KEYWORDS) {
    try {
      const url = JGRANTS_BASE + '?keyword=' + encodeURIComponent(keyword)
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(30000),
      })
      if (!res.ok) continue

      const json = await res.json()
      const items = json?.result || []

      for (const item of items) {
        if (!item.id || !item.title) continue

        const endDate = item.acceptance_end_datetime
          ? item.acceptance_end_datetime.split('T')[0]
          : null

        const today = new Date()
        const daysLeft = endDate
          ? Math.ceil((new Date(endDate).getTime() - today.getTime()) / 86400000)
          : 30

        if (daysLeft < 0) continue

        const area = item.target_area_search || ''
        const slug = generateSlug(item.title, item.id)

        const row = {
          jgrants_id: item.id,
          slug: slug,
          title: item.title,
          summary: item.detail || item.subsidy_catch_phrase || null,
          category: guessCategory(item.title, item.detail || '', item.industry || ''),
          region: guessRegion(area),
          max_amount: item.subsidy_max_limit || null,
          difficulty: guessDifficulty(item.subsidy_max_limit),
          target_score: calcTargetScore(item.subsidy_max_limit, daysLeft),
          deadline: endDate,
          ministry: null,
          official_url: item.front_subsidy_detail_page_url || null,
          jgrants_url: 'https://www.jgrants-portal.go.jp/subsidy/' + item.id,
          subsidy_rate: item.subsidy_rate || null,
          target_industry: item.industry || null,
          target_employees: item.target_number_of_employees || null,
          detail: item.detail || null,
          acceptance_start: item.acceptance_start_datetime ? item.acceptance_start_datetime.split('T')[0] : null,
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
          const { error } = await supabase
            .from('subsidies')
            .insert({ ...row, id: crypto.randomUUID(), created_at: today.toISOString() })
          if (error) totalErrors++
          else totalNew++
        }
      }

      await new Promise(r => setTimeout(r, 1000))
    } catch {
      totalErrors++
    }
  }

  return NextResponse.json({
    message: 'jGrants fetch completed',
    new: totalNew,
    updated: totalUpdated,
    errors: totalErrors,
  })
}
