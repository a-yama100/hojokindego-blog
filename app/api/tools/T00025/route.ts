import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, fromLang, toLang, style, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!text || !toLang) {
      return NextResponse.json({ error: '翻訳したい文章と翻訳先言語は必須です' }, { status: 400 })
    }
    const prompt = `あなたはプロの翻訳者です。
以下の文章を翻訳してください。

【情報】
- 元の言語: ${fromLang || '自動判定'}
- 翻訳先: ${toLang}
- スタイル: ${style || '自然な表現'}

【元の文章】
${text}

【出力形式】
## 翻訳結果

### メイン翻訳
（翻訳文）

### 別の表現（2パターン）
1. （フォーマルな表現）
2. （カジュアルな表現）

### 翻訳ポイント
（注意した点や文化的なニュアンスの説明）

わかりやすく丁寧に出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00025 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
