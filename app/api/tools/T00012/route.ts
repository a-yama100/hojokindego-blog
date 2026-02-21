import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipient, purpose, keyPoints, tone, aiProvider = 'chatgpt', autonomyLevel = 3 } = body

    if (!recipient || !purpose || !keyPoints) {
      return NextResponse.json({ error: '宛先・目的・伝えたいことは必須です' }, { status: 400 })
    }

    const prompt = `あなたはビジネスメールの専門家です。55歳以上の方が安心して使える、丁寧で正確なメールを作成してください。

【メール情報】
- 宛先/相手: ${recipient}
- 目的: ${purpose}
- 伝えたいこと: ${keyPoints}
- トーン: ${tone || '丁寧・ビジネス'}

【出力形式】
## 件名案（3つ）
1. （件名1）
2. （件名2）
3. （件名3）

## メール本文

（ここにメール本文を記載。挨拶文から署名欄まで完成形で出力）

## NG表現チェック
- （もし入力内容に不適切な表現やリスクがあれば指摘）
- （敬語の誤りや二重敬語があれば修正案を提示）

## ワンポイントアドバイス
（このメールをより良くするためのヒント1つ）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00012 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}