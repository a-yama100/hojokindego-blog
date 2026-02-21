import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, aiProvider = 'chatgpt', autonomyLevel = 3 } = body

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: '回答データが必要です' }, { status: 400 })
    }

    const prompt = `あなたは55歳以上のシニア向けAI副業アドバイザーです。
以下の診断回答をもとに、この方に最適なAI副業を3つ提案してください。

【診断回答】
1. パソコンの使用頻度: ${answers[0] || '未回答'}
2. 文章を書くのは好きですか: ${answers[1] || '未回答'}
3. 人とコミュニケーションを取るのは得意ですか: ${answers[2] || '未回答'}
4. コツコツ作業するのは好きですか: ${answers[3] || '未回答'}
5. 1日にAI副業に使える時間: ${answers[4] || '未回答'}
6. 月の目標収入: ${answers[5] || '未回答'}
7. これまでの職業・経験: ${answers[6] || '未回答'}
8. 興味のある分野: ${answers[7] || '未回答'}

【出力形式】
## あなたのタイプ
（性格タイプ名と一言説明）

## おすすめAI副業 トップ3

### 1. （副業名）
- なぜあなたに合うか
- 具体的な始め方（3ステップ）
- 想定月収の目安
- 必要なAIツール

### 2. （副業名）
（同様の形式）

### 3. （副業名）
（同様の形式）

## まず今日やること
（最も簡単な最初の一歩を1つだけ提示）

回答は全て日本語で、55歳以上の方にも分かりやすい言葉で書いてください。
専門用語を使う場合は必ず括弧書きで説明を添えてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00005 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}