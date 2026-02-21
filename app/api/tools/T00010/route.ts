import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, targetAudience, keywords, tone, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!topic) {
      return NextResponse.json({ error: '記事のテーマは必須です' }, { status: 400 })
    }
    const prompt = `あなたはプロのブログコンサルタントです。
以下の情報から、クリックされやすいブログ記事タイトルを10個生成してください。

【情報】
- テーマ: ${topic}
- ターゲット読者: ${targetAudience || '一般'}
- キーワード: ${keywords || 'なし'}
- トーン: ${tone || '普通'}

【出力形式】
## タイトル候補 10個

### パターンA: 数字×メリット型
1. （タイトル）
2. （タイトル）

### パターンB: 問いかけ型
3. （タイトル）
4. （タイトル）

### パターンC: 体験談・共感型
5. （タイトル）
6. （タイトル）

### パターンD: ノウハウ型
7. （タイトル）
8. （タイトル）

### パターンE: トレンド×緊急性型
9. （タイトル）
10. （タイトル）

### おすすめタイトル
上記から1つ選び、その理由を説明

全て日本語で、SEOにも効果的なタイトルを書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00010 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}