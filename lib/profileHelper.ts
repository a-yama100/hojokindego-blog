export interface ProfileData {
  profile_name?: string
  age_range?: string
  work_experience?: string
  skills?: string
  interests?: string
  available_hours?: string
  income_goal?: string
  pc_level?: string
  ai_experience?: string
  goals?: string
}

export function generateProfileContext(profile: ProfileData | null): string {
  if (!profile) return ''

  const sections: string[] = []

  if (profile.profile_name || profile.age_range) {
    const basic: string[] = []
    if (profile.profile_name) basic.push('名前: ' + profile.profile_name)
    if (profile.age_range) basic.push('年齢層: ' + profile.age_range)
    if (profile.pc_level) basic.push('パソコンスキル: ' + profile.pc_level)
    if (profile.ai_experience) basic.push('AI経験: ' + profile.ai_experience)
    if (basic.length > 0) sections.push('【基本情報】\n' + basic.join('\n'))
  }

  if (profile.work_experience) {
    sections.push('【職歴・経験】\n' + profile.work_experience)
  }

  if (profile.skills || profile.interests) {
    const skillInfo: string[] = []
    if (profile.skills) skillInfo.push('スキル・得意なこと: ' + profile.skills)
    if (profile.interests) skillInfo.push('興味のある分野: ' + profile.interests)
    if (skillInfo.length > 0) sections.push('【スキル・興味】\n' + skillInfo.join('\n'))
  }

  if (profile.available_hours || profile.income_goal) {
    const work: string[] = []
    if (profile.available_hours) work.push('作業可能時間: ' + profile.available_hours)
    if (profile.income_goal) work.push('目標収入: ' + profile.income_goal)
    if (work.length > 0) sections.push('【副業条件】\n' + work.join('\n'))
  }

  if (profile.goals) {
    sections.push('【目標】\n' + profile.goals)
  }

  if (sections.length === 0) return ''

  return '\n\n--- ユーザープロフィール ---\n' + sections.join('\n\n') + '\n--- プロフィールここまで ---\n\n上記プロフィールを考慮して、このユーザーに最適化した回答をしてください。'
}