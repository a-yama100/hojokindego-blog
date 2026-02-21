import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skills, works, targetClient, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!skills) {
      return NextResponse.json({ error: 'スキル・できることは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けの履歴書・スキルアドバイザーです。
以下の情報を分析し、具体的なアドバイスを提供してください。

【情報】
- スキル・できること: ${skills}
- 実績・作品（任意）: ${works}
- ターゲット（任意）: ${targetClient}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00043 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
