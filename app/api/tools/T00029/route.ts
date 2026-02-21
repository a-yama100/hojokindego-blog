import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, imageStyle, purpose, aiTool, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!description) {
      return NextResponse.json({ error: '画像の説明は必須です' }, { status: 400 })
    }
    const prompt = `あなたはAI画像生成のプロンプトエンジニアです。
以下の情報から、AI画像生成ツールで使える高品質なプロンプトを作成してください。

【情報】
- 作りたい画像: ${description}
- スタイル: ${imageStyle || '指定なし'}
- 用途: ${purpose || '一般'}
- 使用ツール: ${aiTool || '汎用'}

【出力形式】
## AI画像プロンプト

### 英語プロンプト（推奨）
\`\`\`
（英語のプロンプト）
\`\`\`

### 日本語プロンプト
\`\`\`
（日本語のプロンプト）
\`\`\`

### ネガティブプロンプト
\`\`\`
（避けたい要素）
\`\`\`

### パラメータ設定のおすすめ
（アスペクト比、品質設定などのアドバイス）

### プロンプトのコツ
（より良い画像を生成するためのポイント）

全て日本語で説明してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00029 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
