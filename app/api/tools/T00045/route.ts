import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, currentProfile, targetJobs, experience, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!platform) {
      return NextResponse.json({ error: 'プラットフォームは必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けの履歴書・スキルアドバイザーです。
以下の情報を分析し、具体的なアドバイスを提供してください。

【情報】
- プラットフォーム: ${platform}
- 現在のプロフィール: ${currentProfile}
- 受けたい仕事: ${targetJobs}
- 実績・経験: ${experience}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00045 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
