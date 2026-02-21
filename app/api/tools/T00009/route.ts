import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!answers || !Array.isArray(answers) || answers.length < 5) {
      return NextResponse.json({ error: '全ての質問に回答してください' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けAI活用アドバイザーです。
以下の回答からAI活用レベルを判定し、次のステップを提案してください。

【回答】
1. AIを使ったことがあるか: ${answers[0]}
2. AIで䯕したこと: ${answers[1]}
3. AIを副業に使っているか: ${answers[2]}
4. AIの限界を理解しているか: ${answers[3]}
5. 今後やりたいこと: ${answers[4]}

【出力形式】
## AI活用レベル

【レベル】Lv.X （レベル名）
（Lv.1=初心者、Lv.2=入門、Lv.3=実践、Lv.4=活用、Lv.5=プロ）

### あなたの強み
- （回答から読み取れる強み）

### 次のステップ（3つ）
1. （具体的なアクション）
2. 
3. 

### おすすめのツール・記事
- （このレベルに合った学習リソース）

### まず今日やること
（最も簡単な1つ）

全て日本語で書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00009 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}