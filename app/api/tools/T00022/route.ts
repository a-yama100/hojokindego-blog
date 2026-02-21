import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, style, includeItems, targetPlatform, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!category) {
      return NextResponse.json({ error: '商品カテゴリは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けメルカリ・物販の専門家です。
以下のカテゴリ向けの出品テンプレートを3パターン作成してください。

【情報】
- 商品カテゴリ: ${category}
- 文体: ${style || '丁寧'}
- 含める項目: ${includeItems || '基本項目'}
- プラットフォーム: ${targetPlatform || 'メルカリ'}

【出力形式】
## 出品テンプレート 3パターン

### テンプレート1: シンプル型
\`\`\`
（コピペ可能な出品テンプレート）
\`\`\`

### テンプレート2: 詳細型
\`\`\`
（コピペ可能な出品テンプレート）
\`\`\`

### テンプレート3: 高級感型
\`\`\`
（コピペ可能な出品テンプレート）
\`\`\`

### テンプレートの使い方
（○○の部分を書き換えるだけ、というアドバイス）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00022 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
