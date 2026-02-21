import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'ai-workhack'

export async function GET(request: NextRequest) {
  const toolId = request.nextUrl.searchParams.get('toolId')
  const category = request.nextUrl.searchParams.get('category')
  if (!toolId || !category) {
    return NextResponse.json({ tools: [] })
  }
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('tools')
    .select('tool_id, name, category')
    .eq('site_id', SITE_ID)
    .eq('category', category)
    .neq('tool_id', toolId)
    .not('tool_id', 'in', '("T00001","T00002","T00003","T00004")')
    .order('tool_id', { ascending: true })
    .limit(5)
  return NextResponse.json({ tools: data || [] })
}
