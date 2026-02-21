import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sleepHours, anxietyLevel, infoTime, recentAction, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!sleepHours || !anxietyLevel || !infoTime) {
      return NextResponse.json({ error: '全ての質問に回答してください' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けメンタルケアアドバイザーです。
以下の回答から「焦り度」を診断し、今日やるべきタスクを1つだけ提示してください。

【回答】
- 昨晚の睡眠時間: ${sleepHours}
- 不安度: ${anxietyLevel}
- 1日の情報収集時間: ${infoTime}
- 最近とった行動: ${recentAction || '特になし'}

【出力形式】
## 焦り度診断

【結果】（安全⾗注意⾗危険 の3段階）

### 診断理由
- （各回答の分析）

### 今日やるべきたった1つのタスク
（具体的で簡単なタスクを1つだけ）

### やってはいけないこと
- （今の状態で避けるべき行動を列挙）

### 励ましの言葉
（優しく背中を押す一言）

全て日本語で、優しいトーンで書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00007 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}