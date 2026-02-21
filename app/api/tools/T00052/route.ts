import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { siteUrl, currentIssue, targetMetric, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!siteUrl) {
      return NextResponse.json({ error: 'サイトURL・サイト概要は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向けの運営者向けアドバイザーです。
以下の情報を分析し、具体的なアドバイスを提供してください。

【情報】
- サイトURL・サイト概要: ${siteUrl}
- 課題・悩み: ${currentIssue}
- 改善したい指標: ${targetMetric}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00052 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
