import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, targetTone, aiProvider = 'chatgpt', autonomyLevel = 3 } = body

    if (!text || !targetTone) {
      return NextResponse.json({ error: '文章と変換先のトーンは必須です' }, { status: 400 })
    }

    const prompt = `あなたは文章のトーン変換の専門家です。以下の文章を指定されたトーンに変換してください。

【元の文章】
${text}

【変換先のトーン】
${targetTone}

【出力形式】
## 変換後の文章

（変換後の文章をここに出力）

## 変更ポイント
- （どの部分をどう変えたか、3つ程度箇条書き）

## 注意点
- （このトーンで気をつけるべきポイント）

日本語で出力してください。元の意味や情報を変えずに、トーンだけを変換してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00014 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}