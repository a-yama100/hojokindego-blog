// 締切を過ぎた補助金を一覧・検索に出さないための条件（2026-11-26）。
// 毎日の自動の非表示（/api/cron/expire-subsidies）が止まっていても、締切を過ぎたものは出さない。
// 日付は日本時間で数える。締切が未登録のものは出す。

export function todayJst(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

/** Supabase の .or() に渡す条件: 締切が未登録か、今日以降 */
export function openDeadlineFilter(): string {
  return 'deadline.is.null,deadline.gte.' + todayJst()
}
