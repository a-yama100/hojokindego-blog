import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, mode, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!text || !mode) {
      return NextResponse.json({ error: '文章とモードは必須です' }, { status: 400 })
    }
    const modePrompts: Record<string, string> = {
      '要約': '以下の文章を要約し、重要なポイントを抽出してください。',
      'ファクトチェック': '以下の文章に含まれる事実関係を検証し、正確性を評価してください。',
      '信頼性評価': '以下の情報の信頼性を評価し、注意すべき点を指摘してください。',
    }
    const modeOutputs: Record<string, string> = {
      '要約': `## 要約結果

### 3行まとめ
（3行で要点をまとめる）

### 詳細な要約
（200文字程度の要約）

### キーワード
（重要なキーワード5つ）`,
      'ファクトチェック': `## ファクトチェック結果

### 検証結果
（各主張の正確性を評価）

### 信頼度: ○○%
（全体的な信頼度）

### 注意点
（誤りや誇張がある場合の指摘）`,
      '信頼性評価': `## 信頼性評価結果

### 信頼度: ○○%

### 良い点
（信頼できる要素）

### 注意点
（疑わしい要素や確認が必要な点）

### アドバイス
（この情報をどう扱うべきか）`,
    }
    const prompt = `あなたは55歳以上の方向け情報分析の専門家です。
${modePrompts[mode] || '以下の文章を分析してください。'}

【元の文章】
${text}

【出力形式】
${modeOutputs[mode] || '分析結果を出力してください。'}

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00028 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
