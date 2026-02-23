export interface SubsidyData {
  id: string
  slug: string
  title: string
  summary: string | null
  category: string | null
  region: string | null
  max_amount: number | null
  difficulty: string | null
  target_score: number | null
  deadline: string | null
  ministry: string | null
  official_url: string | null
  requirements: string[] | null
  is_active: boolean
  last_checked: string | null
  created_at: string
  updated_at: string
}

export const CATEGORIES: Record<string, { label: string; color: string }> = {
  digitalization: { label: 'IT・デジタル化', color: 'bg-blue-100 text-blue-800' },
  manufacturing: { label: '製造業・ものづくり', color: 'bg-orange-100 text-orange-800' },
  general: { label: '一般事業', color: 'bg-green-100 text-green-800' },
  reconstruction: { label: '事業再構築', color: 'bg-purple-100 text-purple-800' },
  startup: { label: '創業・スタートアップ', color: 'bg-pink-100 text-pink-800' },
}

export const REGIONS: Record<string, string> = {
  national: '全国',
  tokyo: '東京都',
  osaka: '大阪府',
  aichi: '愛知県',
  fukuoka: '福岡県',
}

export const DIFFICULTY_COLOR: Record<string, string> = {
  '簡単': 'text-green-700 bg-green-50',
  '普通': 'text-yellow-700 bg-yellow-50',
  '難しい': 'text-red-700 bg-red-50',
}

export const DIFFICULTY_COLOR_BORDER: Record<string, string> = {
  '簡単': 'text-green-700 bg-green-50 border-green-200',
  '普通': 'text-yellow-700 bg-yellow-50 border-yellow-200',
  '難しい': 'text-red-700 bg-red-50 border-red-200',
}
