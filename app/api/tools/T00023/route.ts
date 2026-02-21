import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scene, situation, tone, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!scene) {
      return NextResponse.json({ error: 'シーンは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けメルカリ・物販の専門家です。
以下のシーンに合った購入者・出品者向けメッセージを作成してください。

【情報】
- シーン: ${scene}
- 状況の詳細: ${situation || '特になし'}
- トーン: ${tone || '丁寧'}

【出力形式】
## メッセージ 3パターン

### パターン1: 丁寧型
\`\`\`
（コピペ可能なメッセージ）
\`\`\`

### パターン2: フレンドリー型
\`\`\`
（コピペ可能なメッセージ）
\`\`\`

### パターン3: 簡潔型
\`\`\`
（コピペ可能なメッセージ）
\`\`\`

### マナーポイント
（メルカリでの取引マナーアドバイス）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00023 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
