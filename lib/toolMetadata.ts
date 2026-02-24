import { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'hojokindego'

export async function generateToolMetadata(toolId: string): Promise<Metadata> {
  try {
    const supabase = createServiceClient()
    const { data: tool } = await supabase
      .from('tools')
      .select('name, description, category')
      .eq('tool_id', toolId)
      .eq('site_id', SITE_ID)
      .single()

    if (!tool) {
      return { title: toolId }
    }

    const title = tool.name
    const description = tool.description || `AI-powered ${tool.name} tool for professionals aged 55+`

    return {
      title,
      description,
      openGraph: {
        title: `${title} | AI Work Hack`,
        description,
      },
      twitter: {
        card: 'summary',
        title: `${title} | AI Work Hack`,
        description,
      },
    }
  } catch {
    return { title: toolId }
  }
}
