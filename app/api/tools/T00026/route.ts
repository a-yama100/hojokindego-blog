import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business, competitors, aspect, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!business) {
      return NextResponse.json({ error: 'ビジネス・サービス名は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けビジネスコンサルタントです。
以下のビジネスの競合リサーチを行ってください。

【情報】
- 自分のビジネス: ${business}
- 競合候補: ${competitors || '自動でリサーチ'}
- 分析したい観点: ${aspect || '全般'}

【出力形式】
## 競合リサーチレポート

### 競合3社の分析
#### 競合1: （名前）
- 強み:
- 弱み:
- 価格帯:
- 特徴:

#### 競合2: （名前）
- 強み:
- 弱み:
- 価格帯:
- 特徴:

#### 競合3: （名前）
- 強み:
- 弱み:
- 価格帯:
- 特徴:

### あなたの差別化ポイント
（競合と比較して打ち出せる強み）

### 具体的なアクション3つ
（今すぐできること）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00026 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
