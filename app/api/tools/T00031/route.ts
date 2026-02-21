import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skills, interests, availableTime, incomeGoal, experience, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!skills && !interests) {
      return NextResponse.json({ error: 'スキルまたは興味のどちらかは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けキャリアアドバイザーです。
以下の情報から、最適な副業アイデアを提案してください。

【情報】
- スキル・得意なこと: ${skills || '未設定'}
- 興味のあること: ${interests || '未設定'}
- 週の作業時間: ${availableTime || '未設定'}
- 目標月収: ${incomeGoal || '未設定'}
- 副業経験: ${experience || '未経験'}

【出力形式】
## あなたにおすすめの副業 TOP5

### 第1位:（副業名）
- 概要:
- 期待月収: ○○円〜○○円
- 必要時間: 週○時間
- 難易度: ★☆☆☆☆
- 始め方:（具体的なステップ3つ）

### 第2位〜第5位
（同様の形式）

### まず今週やること
（最も始めやすい副業の具体的な第一歩）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00031 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
