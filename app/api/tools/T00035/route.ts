import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentSituation, goal, availableTime, interests, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!currentSituation) {
      return NextResponse.json({ error: '現在の状況は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向け副業アドバイザーです。
以下の情報を分析し、AI副業ロードマップ生成を行ってください。

【情報】
- 現在の状況: ${currentSituation}\n- 目標: ${goal}\n- 週の作業時間: ${availableTime}\n- 興味のある分野（任意）: ${interests}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00035 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
