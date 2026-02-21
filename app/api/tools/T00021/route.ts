import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, buyPrice, sellPrice, platform, notes, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!productName || !buyPrice) {
      return NextResponse.json({ error: '商品名と仕入れ価格は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向け物販アドバイザーです。
以下の仕入れ候補について、利益が出るか判定してください。

【情報】
- 商品名: ${productName}
- 仕入れ価格: ${buyPrice}
- 想定販売価格: ${sellPrice || '未設定'}
- 販売先: ${platform || '未設定'}
- 備考: ${notes || 'なし'}

【出力形式】
## 仕入れ判定結果

### 判定:（仕入れOK / 要検討 / 見送り推奨）

### 利益シミュレーション
- 仕入れ価格: ○○円
- 想定販売価格: ○○円
- 手数料（10%）: ○○円
- 送料（推定）: ○○円
- 純利益: ○○円（利益率○%）

### リスク分析
（価格下落リスク、在庫リスクなど）

### アドバイス
（仕入れ判断のポイント）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00021 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
