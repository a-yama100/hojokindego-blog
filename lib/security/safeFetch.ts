// 外のサイトの URL を、サーバーから読みに行くときの守り（SSRF 対策）。
// - https だけ
// - 許可したホストだけ（allowedHosts を渡したとき）。渡さないときも、社内・自分の機械・クラウドの管理用の宛先は拒む
// - 転送（リダイレクト）は自動で追わず、転送先も同じ確かめをしてから追う（回数の上限あり）
// - 時間と大きさの上限
import { lookup } from "node:dns/promises"
import net from "node:net"

export type SafeFetchOptions = {
  allowedHosts?: string[]
  timeoutMs?: number
  maxBytes?: number
  maxRedirects?: number
  allowContentTypes?: RegExp
}

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number)
    return (
      a === 0 || a === 10 || a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) || // 169.254.169.254（クラウドの管理用）を含む
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    )
  }
  const v = ip.toLowerCase()
  if (v.startsWith("::ffff:")) return isPrivateIp(v.slice(7))
  return v === "::" || v === "::1" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80") || v.startsWith("ff")
}

async function checkUrl(raw: string, opts: SafeFetchOptions): Promise<URL> {
  const u = new URL(raw)
  if (u.protocol !== "https:") throw new Error("https only")
  if (u.username || u.password) throw new Error("credentials in url")
  if (u.port && u.port !== "443") throw new Error("port not allowed")
  const host = u.hostname.replace(/^\[|\]$/g, "")
  if (opts.allowedHosts && !opts.allowedHosts.includes(host)) throw new Error("host not allowed")
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local")) {
    throw new Error("host not allowed")
  }
  const addrs = net.isIP(host) ? [{ address: host }] : await lookup(host, { all: true })
  if (!addrs.length || addrs.some((a) => isPrivateIp(a.address))) throw new Error("private address")
  return u
}

// 読めた本文（バイト列）と、種類・最後の URL を返す。上限を超えたり、確かめに通らなければ例外。
export async function safeFetch(raw: string, opts: SafeFetchOptions = {}) {
  const timeoutMs = opts.timeoutMs ?? 8000
  const maxBytes = opts.maxBytes ?? 5 * 1024 * 1024
  const maxRedirects = opts.maxRedirects ?? 3
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    let url = await checkUrl(raw, opts)
    for (let i = 0; ; i++) {
      const res = await fetch(url, { redirect: "manual", signal: ctrl.signal })
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location")
        if (!loc || i >= maxRedirects) throw new Error("too many redirects")
        url = await checkUrl(new URL(loc, url).toString(), opts)
        continue
      }
      const type = res.headers.get("content-type") || "application/octet-stream"
      if (opts.allowContentTypes && !opts.allowContentTypes.test(type)) throw new Error("content type not allowed")
      const len = Number(res.headers.get("content-length") || 0)
      if (len > maxBytes) throw new Error("too large")
      const reader = res.body?.getReader()
      const chunks: Uint8Array[] = []
      let total = 0
      if (reader) {
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          total += value.byteLength
          if (total > maxBytes) {
            ctrl.abort()
            throw new Error("too large")
          }
          chunks.push(value)
        }
      }
      const body = new Uint8Array(total)
      let off = 0
      for (const c of chunks) {
        body.set(c, off)
        off += c.byteLength
      }
      return { ok: res.ok, status: res.status, contentType: type, body, url: url.toString() }
    }
  } finally {
    clearTimeout(timer)
  }
}
