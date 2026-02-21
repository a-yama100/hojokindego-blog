import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product, target, appeal, usage, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!product) {
      return NextResponse.json({ error: '商品・サービス名は必須です' }, { status: 400 })
    }
    const prompt = `あなたはプロのコピーライターです。
以下の情報から、印象的なキャッチコピーを15個生成してください。

【情報】
- 商品・サービス: ${product}
- ターゲット: ${target || '一般'}
- アピールポイント: ${appeal || '特になし'}
- 使用場面: ${usage || '広告全般'}

【出力形式】
## キャッチコピー候補 15個

### 短文型（5個）
1. （10文字以内）
2. ...

### 説明型（5個）
6. （20～30文字）
7. ...

### ストーリー型（5個）
11. （30～50文字）
12. ...

### おすすめTOP3
（上記から3つ選び、理由を説明）

全て日本語で書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00013 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}