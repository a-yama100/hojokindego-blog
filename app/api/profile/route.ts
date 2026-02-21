import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await request.json()
    const serviceClient = createServiceClient()

    const profileData = {
      profile_name: profile.profile_name || null,
      age_range: profile.age_range || null,
      work_experience: profile.work_experience || null,
      skills: profile.skills || null,
      interests: profile.interests || null,
      available_hours: profile.available_hours || null,
      income_goal: profile.income_goal || null,
      pc_level: profile.pc_level || null,
      ai_experience: profile.ai_experience || null,
      goals: profile.goals || null,
      profile_updated_at: new Date().toISOString(),
    }

    const { error } = await serviceClient
      .from('users')
      .update(profileData)
      .eq('id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
