import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { salesData, period, platform, goal, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!salesData) {
      return NextResponse.json({ error: '売上データは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向け物販コンサルタントです。
以下の売上データを分析し、改善アドバイスを提供してください。

【情報】
- 売上データ: ${salesData}
- 期間: ${period || '未設定'}
- プラットフォーム: ${platform || '未設定'}
- 目標: ${goal || '未設定'}

【出力形式】
## 売上・利益分析レポート

### 売上サマリー
（入力データを整理した表形式）

### 利益計算
- 総売上: ○○円
- 手数料合計: ○○円
- 送料合計: ○○円
- 仕入れ合計: ○○円
- 純利益: ○○円
- 平均利益率: ○%

### 好調な商品・カテゴリ
（売れ筋の分析）

### 改善ポイント
（利益を上げるための具体的なアドバイス3つ）

### 来月のアクションプラン
（具体的にやること3つ）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00024 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
