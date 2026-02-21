import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serviceClient = createServiceClient()
    const { data, error } = await serviceClient
      .from('users')
      .select('profile_name, age_range, work_experience, skills, interests, available_hours, income_goal, pc_level, ai_experience, goals, profile_updated_at')
      .eq('id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return NextResponse.json({ profile: data || {} })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
