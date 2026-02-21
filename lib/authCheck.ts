import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

interface AuthResult {
  userId: string | null
  planType: string
  isAuthenticated: boolean
}

export async function checkAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { userId: null, planType: 'free', isAuthenticated: false }
    }

    const token = authHeader.replace('Bearer ', '')
    const serviceClient = createServiceClient()

    const { data: { user }, error } = await serviceClient.auth.getUser(token)
    if (error || !user) {
      return { userId: null, planType: 'free', isAuthenticated: false }
    }

    const { data: profile } = await serviceClient
      .from('users')
      .select('plan_type')
      .eq('id', user.id)
      .single()

    return {
      userId: user.id,
      planType: profile?.plan_type || 'free',
      isAuthenticated: true,
    }
  } catch {
    return { userId: null, planType: 'free', isAuthenticated: false }
  }
}

export function getDailyLimit(planType: string): number {
  switch (planType) {
    case 'premium': return 50
    case 'standard': return 30
    case 'light': return 15
    default: return 5
  }
}
