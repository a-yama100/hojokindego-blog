import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tasks, weeklyHours, improvePriority, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!tasks) {
      return NextResponse.json({ error: '作業内容と報酬は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向け副業アドバイザーです。
以下の情報を分析し、時給換算・効率分析を行ってください。

【情報】
- 作業内容と報酬: ${tasks}\n- 週の総作業時間: ${weeklyHours}\n- 改善したいこと: ${improvePriority}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00034 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
