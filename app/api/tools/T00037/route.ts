import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, currentLevel, goal, availableTime, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!topic) {
      return NextResponse.json({ error: '学びたいテーマは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向け学習コーチです。
以下の情報から、無理のない学習プランを作成してください。

【情報】
- 学びたいテーマ: ${topic}
- 現在のレベル: ${currentLevel || '初心者'}
- 目標: ${goal || '基本を理解する'}
- 週の学習時間: ${availableTime || '未設定'}

【出力形式】
## 4週間学習プラン

### 第1週: 基礎理解
- 学ぶこと:
- おすすめ教材:
- 目標:

### 第2週: 実践入門
- 学ぶこと:
- おすすめ教材:
- 目標:

### 第3週: 応用
- 学ぶこと:
- おすすめ教材:
- 目標:

### 第4週: 実践・復習
- 学ぶこと:
- おすすめ教材:
- 目標:

### 学習のコツ
（55歳以上の方向けの学習アドバイス3つ）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00037 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
