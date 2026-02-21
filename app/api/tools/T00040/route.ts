import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentSkills, targetJob, learningStyle, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!currentSkills) {
      return NextResponse.json({ error: '今のスキルは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けの学習・進捗管理アドバイザーです。
以下の情報を分析し、具体的なアドバイスを提供してください。

【情報】
- 今のスキル: ${currentSkills}
- 目指す副業・仕事: ${targetJob}
- 学習スタイル: ${learningStyle}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00040 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
