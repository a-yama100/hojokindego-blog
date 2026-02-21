import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dailyUsage, symptoms, breaks, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!dailyUsage) {
      return NextResponse.json({ error: '1日のPC作業時間は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けの健康・環境アドバイザーです。
以下の情報を分析し、具体的なアドバイスを提供してください。

【情報】
- 1日のPC作業時間: ${dailyUsage}
- 気になる症状: ${symptoms}
- 休憩の頻度: ${breaks}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00051 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
