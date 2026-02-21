import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scene, target, myBackground, concerns, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!scene) {
      return NextResponse.json({ error: 'シーンは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けの履歴書・スキルアドバイザーです。
以下の情報を分析し、具体的なアドバイスを提供してください。

【情報】
- シーン: ${scene}
- 相手・応募先: ${target}
- 自分の経歴: ${myBackground}
- 不安なこと: ${concerns}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00046 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
