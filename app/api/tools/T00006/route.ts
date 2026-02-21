import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { targetIncome, availableTime, strengths, weaknesses, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!targetIncome || !availableTime || !strengths) {
      return NextResponse.json({ error: '目標金額・作業時間・得意なことは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けAI副業アドバイザーです。
以下の情報から「やること3つ」と「やらないこと10個」を明確に決めてください。

【情報】
- 目標月収: ${targetIncome}
- 週の作業可能時間: ${availableTime}
- 得意なこと: ${strengths}
- 苦手なこと: ${weaknesses || '特になし'}

【出力形式】
## やること（3つ）
### 1. （具体的なアクション）
- なぜこれをやるのか
- 週に何時間使うか
- 期待できる収入

### 2. / ### 3. （同様）

## やらないこと（10個）
1. （やらないこと） - 理由
...

## まず今日やること
（最も簡単な最初の一歩を1つ）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00006 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}