import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { income, expenses, period, goal, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!income) {
      return NextResponse.json({ error: '収入の内訳は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向け副業アドバイザーです。
以下の情報を分析し、月間収支レポート生成を行ってください。

【情報】
- 収入の内訳: ${income}\n- 支出の内訳: ${expenses}\n- 期間: ${period}\n- 目標月収（任意）: ${goal}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00032 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
