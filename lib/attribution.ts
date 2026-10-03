// 流入元の記録と、成果（問い合わせ・申し込み・予約・決済）のGA4送信。
// 初回訪問時のreferrer・utm_*・ランディングページを localStorage に保存し（初回接点）、
// 成果の送信時に API へ一緒に渡して、通知メール・DBに残す。

export type Attribution = {
  source: string
  medium: string
  campaign: string
  referrer: string
  landing: string
  firstSeen: string
}

const KEY = 'first_touch_attribution'

function safeGet(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Attribution) : null
  } catch {
    return null
  }
}

// 全ページ共通で1回呼ぶ。保存済みなら何もしない（初回接点を守る）。
export function captureAttribution(): void {
  if (typeof window === 'undefined' || safeGet()) return
  const params = new URLSearchParams(window.location.search)
  let referrer = document.referrer || ''
  try {
    if (referrer && new URL(referrer).hostname === window.location.hostname) referrer = ''
  } catch {
    referrer = ''
  }
  const source =
    params.get('utm_source') ||
    (referrer ? new URL(referrer).hostname.replace(/^www\./, '') : 'direct')
  const medium = params.get('utm_medium') || (referrer ? 'referral' : 'none')
  const data: Attribution = {
    source,
    medium,
    campaign: params.get('utm_campaign') || '',
    referrer,
    landing: window.location.pathname,
    firstSeen: new Date().toISOString(),
  }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    /* 保存できない環境では記録しない */
  }
}

export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null
  return safeGet()
}

// 成果をGA4へ送る。name は generate_lead / sign_up / purchase など。
export function trackConversion(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  const a = safeGet()
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (typeof w.gtag !== 'function') return
  w.gtag('event', name, {
    ...params,
    first_touch_source: a?.source,
    first_touch_medium: a?.medium,
    first_touch_campaign: a?.campaign,
  })
}

// 通知メール用。サーバー側でHTMLエスケープして使う。
export function attributionRows(a: Partial<Attribution> | null | undefined): string {
  if (!a) return ''
  const esc = (s: unknown) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
  const rows: [string, string][] = [
    ['流入元', [a.source, a.medium].filter(Boolean).join(' / ')],
    ['キャンペーン', a.campaign || ''],
    ['参照元URL', a.referrer || ''],
    ['最初に見たページ', a.landing || ''],
  ]
  return rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        '<tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:bold">' + k + '</td><td style="padding:8px 12px">' + esc(v) + '</td></tr>'
    )
    .join('')
}
