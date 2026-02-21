import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobDescription, myExperience, price, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!jobDescription) {
      return NextResponse.json({ error: '案件の内容は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けの履歴書・スキルアドバイザーです。
以下の情報を分析し、具体的なアドバイスを提供してください。

【情報】
- 案件の内容: ${jobDescription}
- 自分の経験・強み: ${myExperience}
- 希望単価（任意）: ${price}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00044 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
