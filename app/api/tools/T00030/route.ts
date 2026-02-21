import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, platform, targetAudience, mood, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!title) {
      return NextResponse.json({ error: 'タイトル・テーマは必須です' }, { status: 400 })
    }
    const prompt = `あなたはサムネイルデザインの専門家です。
以下の情報から、クリックされるサムネイルの構成をアドバイスしてください。

【情報】
- タイトル・テーマ: ${title}
- プラットフォーム: ${platform || 'YouTube'}
- ターゲット: ${targetAudience || '一般'}
- 雰囲気: ${mood || '指定なし'}

【出力形式】
## サムネイル構成アドバイス

### おすすめ構成 3パターン

#### パターン1: インパクト型
- レイアウト:（配置の説明）
- テキスト:（入れるべき文字）
- 背景色:（おすすめカラー）
- ポイント:（なぜクリックされるか）

#### パターン2: 信頼感型
- レイアウト:
- テキスト:
- 背景色:
- ポイント:

#### パターン3: 好奇心型
- レイアウト:
- テキスト:
- 背景色:
- ポイント:

### 使えるフリー素材サイト
（おすすめのサイト3つ）

### やってはいけないNG例
（よくある失敗3つ）

全て日本語で、55歳以上の方にもわかりやすく書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00030 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
