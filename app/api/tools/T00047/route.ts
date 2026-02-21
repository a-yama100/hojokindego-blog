import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tasks, deadline, availableTime, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!tasks) {
      return NextResponse.json({ error: 'やることリストは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けのワークフロー・効率化アドバイザーです。
以下の情報を分析し、具体的なアドバイスを提供してください。

【情報】
- やることリスト: ${tasks}
- 締切がある作業: ${deadline}
- 今週の空き時間: ${availableTime}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00047 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
