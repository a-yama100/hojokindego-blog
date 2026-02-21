import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { toolId } = await request.json()
    if (!toolId) {
      return NextResponse.json({ error: 'toolId is required' }, { status: 400 })
    }

    // For now, return default usage limits
    // TODO: Integrate with Supabase user auth and usage_logs
    return NextResponse.json({
      usage: {
        dailyLimit: 10,
        used: 0,
        remaining: 10,
      }
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
