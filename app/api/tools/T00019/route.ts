import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, condition, details, price, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!productName) {
      return NextResponse.json({ error: '商品名は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けメルカリ出品アドバイザーです。
以下の商品情報から、メルカリで売れる出品文を作成してください。

【情報】
- 商品名: ${productName}
- 状態: ${condition || '未設定'}
- 詳細: ${details || '未設定'}
- 希望価格: ${price || '未設定'}

【出力形式】
## メルカリ出品文

### タイトル（40文字以内）
（商品タイトル）

### 商品説明文
（購入者の心をつかむ説明文。状態・特徴・付属品を明記）

### おすすめハッシュタグ（5個）
#タグ1 #タグ2 ...

### 価格アドバイス
（相場感と価格設定のアドバイス）

### 売れるコツ
（写真の撮り方、出品タイミングなど）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00019 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
