// Brevo でメールを送る（2026-10-30）。PHAIWorks-web の lib/email/sendEmail.ts と同じ作り。
// 以前は Resend の試験用の差出人（onboarding@resend.dev）で、鍵も無く、お問い合わせのメールが届いていなかった。
// phaiworks.com は Brevo で認証済みなので、差出人は @phaiworks.com のアドレスにする。
//
// Env:
//   BREVO_API_KEY            (required, secret)  Brevo の送信用の鍵
//   BREVO_DEFAULT_FROM_EMAIL (optional)          差出人。既定は no-reply@phaiworks.com
//   BREVO_DEFAULT_FROM_NAME  (optional)          差出人の表示名。既定は 補助金でゴー！

const BREVO_API_KEY = process.env.BREVO_API_KEY || ""
export const DEFAULT_FROM_EMAIL = process.env.BREVO_DEFAULT_FROM_EMAIL || "no-reply@phaiworks.com"
export const DEFAULT_FROM_NAME = process.env.BREVO_DEFAULT_FROM_NAME || "補助金でゴー！"

interface BrevoAddress {
  name?: string
  email: string
}

export interface BrevoSendParams {
  to: string | string[]
  replyTo?: string
  subject: string
  html: string
}

export interface BrevoSendResult {
  ok: boolean
  error?: string
}

function parseAddress(input: string): BrevoAddress {
  const m = /^\s*(.*?)\s*<\s*([^>]+?)\s*>\s*$/.exec(input)
  if (m) {
    const name = m[1].replace(/^"|"$/g, "").trim()
    return name ? { name, email: m[2].trim() } : { email: m[2].trim() }
  }
  return { email: input.trim() }
}

export async function sendBrevoEmail(params: BrevoSendParams): Promise<BrevoSendResult> {
  if (!BREVO_API_KEY) {
    console.error("[email/sendBrevoEmail] BREVO_API_KEY not set. Skipping:", params.subject)
    return { ok: false, error: "BREVO_API_KEY not configured" }
  }
  const payload: Record<string, unknown> = {
    sender: { name: DEFAULT_FROM_NAME, email: DEFAULT_FROM_EMAIL },
    to: (Array.isArray(params.to) ? params.to : [params.to]).filter(Boolean).map(parseAddress),
    subject: params.subject,
    htmlContent: params.html,
  }
  if (params.replyTo) payload.replyTo = parseAddress(params.replyTo)
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const errText = await res.text()
      console.error("[email/sendBrevoEmail] Brevo API error:", res.status, errText)
      return { ok: false, error: "Brevo API " + res.status }
    }
    return { ok: true }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("[email/sendBrevoEmail] Exception:", msg)
    return { ok: false, error: msg }
  }
}
