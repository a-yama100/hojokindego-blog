import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'mail@a-yama.jp'

function buildAdminHtml(name: string, email: string, catLabel: string, message: string) {
  return [
    '<div style="font-family:sans-serif;max-width:600px;margin:0 auto">',
    '<h2 style="color:#2563eb;border-bottom:2px solid #2563eb;padding-bottom:8px">新しいお問い合わせ</h2>',
    '<table style="width:100%;border-collapse:collapse;margin:16px 0">',
    '<tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:bold;width:120px">お名前</td><td style="padding:8px 12px">' + name + '</td></tr>',
    '<tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:bold">メール</td><td style="padding:8px 12px">' + email + '</td></tr>',
    '<tr><td style="padding:8px 12px;background:#f3f4f6;font-weight:bold">カテゴリ</td><td style="padding:8px 12px">' + catLabel + '</td></tr>',
    '</table>',
    '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0">',
    '<h3 style="margin-top:0;color:#374151">お問い合わせ内容</h3>',
    '<p style="white-space:pre-wrap;line-height:1.6">' + message + '</p>',
    '</div>',
    '<p style="color:#6b7280;font-size:12px">ai-workhack.comのお問い合わせフォームから送信。Reply-To: ' + email + '</p>',
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
    '<p style="color:#6b7280;font-size:12px">おとなのAI実践ラボ - AI Work Hack<br /><a href="https://ai-workhack.com">https://ai-workhack.com</a></p>',
    '</div>',
  ].join('')
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, category, message } = await request.json()

    if (!name || !email || !message) {
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

    const catLabel = category || '一般'

    // Send notification to admin
    await resend.emails.send({
      from: 'おとなのAI実践ラボ <onboarding@resend.dev>',
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: '\u3010お問い合わせ\u3011' + catLabel + ' - ' + name,
      html: buildAdminHtml(name, email, catLabel, message),
    })

    // Send auto-reply to user
    await resend.emails.send({
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
