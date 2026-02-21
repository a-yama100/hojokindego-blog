import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { field, purpose, timeframe, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!field) {
      return NextResponse.json({ error: '調べたい分野は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けトレンドリサーチャーです。
以下の分野の最新トレンドを分析してください。

【情報】
- 分野: ${field}
- 目的: ${purpose || '情報収集'}
- 期間: ${timeframe || '最近'}

【出力形式】
## トレンドリサーチ結果

### 注目トレンド TOP5
1. （トレンド名）: （概要と注目理由）
2. （トレンド名）: （概要と注目理由）
3. （トレンド名）: （概要と注目理由）
4. （トレンド名）: （概要と注目理由）
5. （トレンド名）: （概要と注目理由）

### 55歳以上が活かせるチャンス
（年齢や経験を活かせるポイント）

### 注意すべきリスク
（気をつけるべき点）

### おすすめのアクション
（今すぐ始められること3つ）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00027 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
