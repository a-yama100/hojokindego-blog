import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'hojokindego'

// Mapping: blog category -> tool categories
const CATEGORY_MAP: Record<string, string[]> = {
  'AI\u6d3b\u7528\u30ac\u30a4\u30c9': ['\u30de\u30a4\u30f3\u30c9\u30bb\u30c3\u30c8\u30fb\u8a3a\u65ad', '\u5b66\u7fd2\u30fb\u9032\u6357\u7ba1\u7406'],
  'AI\u526f\u696d': ['\u526f\u696d\u30fb\u53ce\u76ca\u7ba1\u7406', '\u30ef\u30fc\u30af\u30d5\u30ed\u30fc\u30fb\u52b9\u7387\u5316'],
  '\u30e9\u30a4\u30c6\u30a3\u30f3\u30b0': ['\u6587\u7ae0\u30fb\u30e9\u30a4\u30c6\u30a3\u30f3\u30b0'],
  '\u7269\u8ca9\u30fb\u305b\u3069\u308a': ['\u51fa\u54c1\u30fb\u7269\u8ca9\u652f\u63f4'],
  '\u7ffb\u8a33\u30fb\u6d77\u5916': ['\u7ffb\u8a33\u30fb\u30ea\u30b5\u30fc\u30c1'],
  '\u753b\u50cf\u30fb\u30c7\u30b6\u30a4\u30f3': ['\u753b\u50cf\u30fb\u30d3\u30b8\u30e5\u30a2\u30eb'],
  '\u53ce\u5165\u30fb\u7a0e\u91d1': ['\u526f\u696d\u30fb\u53ce\u76ca\u7ba1\u7406'],
  '\u5065\u5eb7\u30fb\u74b0\u5883': ['\u5065\u5eb7\u30fb\u74b0\u5883'],
  '\u5c65\u6b74\u66f8\u30fb\u30b9\u30ad\u30eb': ['\u5c65\u6b74\u66f8\u30fb\u30b9\u30ad\u30eb'],
  '\u30de\u30a4\u30f3\u30c9\u30bb\u30c3\u30c8': ['\u30de\u30a4\u30f3\u30c9\u30bb\u30c3\u30c8\u30fb\u8a3a\u65ad'],
}

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category')

  if (!category) {
    return NextResponse.json({ tools: [] })
  }

  const supabase = createServiceClient()

  // Find matching tool categories
  let toolCategories: string[] = []
  for (const [blogCat, toolCats] of Object.entries(CATEGORY_MAP)) {
    if (category.includes(blogCat) || blogCat.includes(category)) {
      toolCategories = [...toolCategories, ...toolCats]
    }
  }

  // If no mapping found, try direct match
  if (toolCategories.length === 0) {
    toolCategories = [category]
  }

  // Remove duplicates
  toolCategories = [...new Set(toolCategories)]

  // Query tools matching any of the categories
  let allTools: any[] = []
  for (const cat of toolCategories) {
    const { data } = await supabase
      .from('tools')
      .select('tool_id, name, description, category')
      .eq('category', cat)
      .eq('is_active', true)
      .eq('site_id', SITE_ID)
      .not('tool_id', 'in', '("T00001","T00002","T00003","T00004")')
      .order('tool_id', { ascending: true })
      .limit(5)

    if (data) {
      allTools = [...allTools, ...data]
    }
  }

  // If still few results, get popular tools as fallback
  if (allTools.length < 3) {
    const existingIds = allTools.map(t => t.tool_id)
    const excludeList = ['T00001', 'T00002', 'T00003', 'T00004', ...existingIds]
    const { data: fallback } = await supabase
      .from('tools')
      .select('tool_id, name, description, category')
      .eq('is_active', true)
      .eq('site_id', SITE_ID)
      .not('tool_id', 'in', '(' + excludeList.map(id => '"' + id + '"').join(',') + ')')
      .order('tool_id', { ascending: true })
      .limit(5 - allTools.length)

    if (fallback) {
      allTools = [...allTools, ...fallback]
    }
  }

  // Deduplicate by tool_id
  const seen = new Set<string>()
  const unique = allTools.filter(t => {
    if (seen.has(t.tool_id)) return false
    seen.add(t.tool_id)
    return true
  })

  return NextResponse.json({ tools: unique.slice(0, 5) })
}
