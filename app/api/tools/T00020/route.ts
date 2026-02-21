import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, condition, platform, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!productName) {
      return NextResponse.json({ error: '商品名は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向け物販アドバイザーです。
以下の商品の適正価格帯を分析してください。

【情報】
- 商品名: ${productName}
- 状態: ${condition || '未設定'}
- 販売先: ${platform || '未設定'}

【出力形式】
## 価格リサーチ結果

### 推定相場
- 新品: ○○円〜○○円
- 中古美品: ○○円〜○○円
- 中古並品: ○○円〜○○円

### プラットフォーム別の特徴
（各プラットフォームでの売れやすさと価格傾向）

### おすすめ価格設定
（具体的な価格と理由）

### 売れやすくするポイント
（出品時のアドバイス）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00020 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
