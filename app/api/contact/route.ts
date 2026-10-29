import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { attributionRows, type Attribution } from '@/lib/attribution'
import { escapeHtml, headerSafe } from '@/lib/security/escapeHtml'
import { overLimit } from '@/lib/security/limits'
import { rateLimit, clientIp, TOO_MANY } from '@/lib/security/rateLimit'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'mail@a-yama.jp'

function buildAdminHtml(name: string, email: string, catLabel: string, message: string, attribution?: unknown) {
  return [
    '<div style="font-family:sans-serif;max-width:600px;margin:0 auto">',
    '<h2 style="color:#2563eb;border-bottom:2px solid #2563eb;padding-bottom:8px">新しいお問い合わせ</h2>',
    '<table style="width:100%;border-collapse:collapse;margin:16px 0">',
    '<tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:bold;width:120px">お名前</td><td style="padding:8px 12px">' + name + '</td></tr>',
    '<tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:bold">メール</td><td style="padding:8px 12px">' + email + '</td></tr>',
    '<tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:bold">カテゴリ</td><td style="padding:8px 12px">' + catLabel + '</td></tr>',
    attributionRows(attribution as Partial<Attribution> | null),
    '</table>',
    '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0">',
    '<h3 style="margin-top:0;color:#374151">お問い合わせ内容</h3>',
    '<p style="white-space:pre-wrap;line-height:1.6">' + message + '</p>',
    '</div>',
    '<p style="color:#6b7280;font-size:12px">hojokin.phaiworks.comのお問い合わせフォームから送信。Reply-To: ' + email + '</p>',
    '</div>',
  ].join('')
}

function buildReplyHtml(name: string, catLabel: string, message: string) {
  return [
    '<div style="font-family:sans-serif;max-width:600px;margin:0 auto">',
    '<h2 style="color:#2563eb">お問い合わせありがとうございます</h2>',
    '<p>' + name + ' 様</p>',
    '<p>以下の内容でお問い合わせを受け付けました。通常24時間以内にご返信いたします。</p>',
    '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0">',
    '<p><strong>カテゴリ:</strong> ' + catLabel + '</p>',
    '<p><strong>お問い合わせ内容:</strong></p>',
    '<p style="white-space:pre-wrap">' + message + '</p>',
    '</div>',
    '<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />',
    '<p style="color:#6b7280;font-size:12px">おとなのAI実践ラボ - AI Work Hack<br /><a href="https://hojokin.phaiworks.com">https://hojokin.phaiworks.com</a></p>',
    '</div>',
  ].join('')
}

export async function POST(request: NextRequest) {
  try {
    const { name: rawName, email, category: rawCategory, message: rawMessage, consent, attribution } = await request.json()

    if (!rawName || !email || !rawMessage) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'メールアドレスの形式が正しくありません' },
        { status: 400 }
      )
    }

    if (overLimit({ name: rawName, email, category: rawCategory, message: rawMessage })) {
      return NextResponse.json({ error: '入力が長すぎます' }, { status: 400 })
    }
    if (consent !== true) {
      return NextResponse.json({ error: 'プライバシーポリシーへの同意が必要です' }, { status: 400 })
    }
    // 回数制限: 同じ IP から 10 分に 5 回まで。自動返信を他人宛に送り付ける使い方を防ぐため、同じ宛先へも 1 時間に 3 回まで。
    const ip = clientIp(request)
    if (!(await rateLimit('contact:ip:' + ip, 600, 5)) || !(await rateLimit('contact:to:' + String(email).toLowerCase(), 3600, 3))) {
      return NextResponse.json(TOO_MANY, { status: 429 })
    }

    // メール本文は HTML なので、入力は必ず変換してから埋め込む（自社のドメインから任意の HTML を送らせない）
    const name = escapeHtml(rawName)
    const message = escapeHtml(rawMessage)
    const catLabel = escapeHtml(rawCategory || '一般')

    // Send notification to admin
    await resend?.emails.send({
      from: 'おとなのAI実践ラボ <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: headerSafe('\u3010お問い合わせ\u3011' + (rawCategory || '一般') + ' - ' + rawName),
      html: buildAdminHtml(name, escapeHtml(email), catLabel, message, attribution),
    })

    // Send auto-reply to user
    await resend?.emails.send({
      from: 'おとなのAI実践ラボ <onboarding@resend.dev>',
      to: email,
      subject: '\u3010おとなのAI実践ラボ\u3011お問い合わせを受け付けました',
      html: buildReplyHtml(name, catLabel, message),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: '送信に失敗しました。時間をおいて再度お試しください。' },
      { status: 500 }
    )
  }
}
