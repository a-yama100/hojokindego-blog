import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentType, situation, tone, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!documentType) {
      return NextResponse.json({ error: '文書の種類は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けのワークフロー・効率化アドバイザーです。
以下の情報を分析し、具体的なアドバイスを提供してください。

【情報】
- 文書の種類: ${documentType}
- 状況の詳細: ${situation}
- トーン: ${tone}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00048 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
