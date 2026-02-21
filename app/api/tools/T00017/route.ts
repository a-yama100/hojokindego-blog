import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rawText, meetingType, outputFormat, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!rawText) {
      return NextResponse.json({ error: '議事録・メモの内容は必須です' }, { status: 400 })
    }
    const formatInstructions: Record<string, string> = {
      '要点まとめ': '箇条書きで要点をまとめてください',
      '正式議事録': '日時・出席者・議題・決定事項・次回アクションの形式で',
      'アクションリスト': '誰が何をいつまでにやるかのリスト形式で',
      'メール共有用': '他の人にメールで共有できる形式で',
    }
    const prompt = `あなたはプロの議事録作成者です。
以下のメモや議事録を整理してください。

【指示】
- 会議種類: ${meetingType || '一般'}
- 出力形式: ${formatInstructions[outputFormat] || '要点をまとめてください'}

【元のメモ・議事録】
${rawText}

【出力形式】
## ${outputFormat || '要点まとめ'}

（整理された内容）

### 決定事項
- （決まったことのリスト）

### 次回までのアクション
- （誰が何をいつまでに）

全て日本語で書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00017 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}