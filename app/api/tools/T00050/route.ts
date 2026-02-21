import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentSetup, issues, budget, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!currentSetup) {
      return NextResponse.json({ error: '現在の作業環境は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けの健康・環境アドバイザーです。
以下の情報を分析し、具体的なアドバイスを提供してください。

【情報】
- 現在の作業環境: ${currentSetup}
- 困っていること: ${issues}
- 改善予算: ${budget}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00050 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
