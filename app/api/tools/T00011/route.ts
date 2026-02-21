import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, mode, targetLength, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!text || !mode) {
      return NextResponse.json({ error: '文章とモードは必須です' }, { status: 400 })
    }
    const modeInstructions: Record<string, string> = {
      'リライト': '元の意味を保ちながら、表現を変えて書き直してください。コピペチェックに引っかからないように。',
      '要約': '文章の要点を抽出し、簡潔にまとめてください。',
      '拡張': '元の文章をもとに、具体例や説明を加えて内容を充実させてください。',
      '簡潔化': '冗長な表現を削り、同じ意味を短く明確に書き直してください。',
    }
    const prompt = `あなたはプロの編集者です。
以下の文章を「${mode}」してください。

【指示】
${modeInstructions[mode] || '文章を改善してください。'}
${targetLength ? '目標文字数: 約' + targetLength + '文字' : ''}

【元の文章】
${text}

【出力形式】
## ${mode}結果

（${mode}した文章）

### 変更ポイント
- （どこをどう変えたかの説明）

全て日本語で出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00011 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}