import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, topic, goal, style, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!platform || !topic) {
      return NextResponse.json({ error: 'SNSとトピックは必須です' }, { status: 400 })
    }
    const charLimits: Record<string, string> = { 'X (Twitter)': '140文字以内', 'Instagram': '2200文字以内、ハッシュタグ付き', 'Facebook': '特に制限なし', 'LINE VOOM': '300文字程度', 'note': 'ブログ記事形式' }
    const prompt = `あなたはプキSNS運用コンサルタントです。
以下の情報で${platform}の投稿文を5パターン生成してください。

【情報】
- SNS: ${platform}（${charLimits[platform] || ''}）
- トピック: ${topic}
- 目的: ${goal || '情報発信'}
- スタイル: ${style || '普通'}

【出力形式】
## ${platform}投稿文 5パターン

### パターン1: 情報提供型
（投稿文）

### パターン2: 共感型
（投稿文）

### パターン3: 質問型
（投稿文）

### パターン4: 体験談型
（投稿文）

### パターン5: CTA型
（投稿文）

### おすすめ投稿時間
（最適な投稿時間と理由）

全て日本語で書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00015 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}