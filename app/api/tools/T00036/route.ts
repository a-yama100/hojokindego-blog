import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sideJob, investment, riskConcern, details, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!sideJob) {
      return NextResponse.json({ error: '始めたい・やっている副業は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向け副業アドバイザーです。
以下の情報を分析し、副業リスク診断を行ってください。

【情報】
- 始めたい・やっている副業: ${sideJob}\n- 初期投資額: ${investment}\n- 気になるリスク: ${riskConcern}\n- 詳細（任意）: ${details}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00036 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
