import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, category, experience, rating, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!productName || !experience) {
      return NextResponse.json({ error: '商品名と体験内容は必須です' }, { status: 400 })
    }
    const prompt = `あなたはレビューライティングの専門家です。
以下の体験をもとに、信頼性の高いレビュー・口コミを作成してください。

【情報】
- 商品・サービス名: ${productName}
- カテゴリ: ${category || 'その他'}
- 体験内容: ${experience}
- 評価: ${rating || '未設定'}

【出力形式】
## レビュー 3パターン

### パターン1: 短文型（100文字程度）
（Amazonや楽天向けの簡潔なレビュー）

### パターン2: 詳細型（300文字程度）
（メリット・デメリットを含む詳細レビュー）

### パターン3: SNS共有型（200文字程度）
（友人におすすめするカジュアルなトーン）

### レビュー作成のコツ
（信頼されるレビューの書き方アドバイス）

全て日本語で、自然な口調で書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00016 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}