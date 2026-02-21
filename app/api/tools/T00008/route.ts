import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolName, frequency, purpose, monthlyUses, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!toolName || !frequency || !purpose) {
      return NextResponse.json({ error: 'ツール名・使用頻度・目的は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けAIツールアドバイザーです。
以下の情報から、このAIツールの有料版に課金すべきか判定してください。

【情報】
- AIツール名: ${toolName}
- 使用頻度: ${frequency}
- 主な目的: ${purpose}
- 月の利用回数: ${monthlyUses || '未計測'}

【出力形式】
## 判定結果

【結論】（無料版で十分 または 有料版がお得 または 別のツールを推奨）

### 判定理由
- （具体的な理由）

### 無料版でできること
- （無料版の機能で十分な使い方）

### 有料版のメリット
- （有料版で増える機能とその価値）

### おすすめの使い方
（最もコスパが良い使い方の提案）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00008 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}