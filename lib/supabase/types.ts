export type PlanType = 'free' | 'light' | 'standard' | 'premium'

export interface User {
  id: string
  email: string
  username: string | null
  plan_type: PlanType
  subscription_expires_at: string | null
  stripe_customer_id: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  description: string | null
  content: string | null
  thumbnail_url: string | null
  category: string | null
  is_published: boolean
  is_premium: boolean
  required_plan: PlanType
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Download {
  id: string
  slug: string
  title: string
  description: string | null
  file_url: string
  file_size_bytes: number | null
  required_plan: PlanType
  download_count: number
  is_active: boolean
  created_at: string
}

export const PLAN_HIERARCHY: Record<PlanType, number> = {
  free: 0,
  light: 1,
  standard: 2,
  premium: 3,
}

export function hasAccess(userPlan: PlanType, requiredPlan: PlanType): boolean {
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[requiredPlan]
}
