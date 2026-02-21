import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { totalIncome, totalExpenses, employmentType, concerns, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!totalIncome) {
      return NextResponse.json({ error: '副業の年間収入（見込み）は必須です' }, { status: 400 })
    }
    const prompt = `あなたは55歳以上の方向け副業アドバイザーです。
以下の情報を分析し、確定申告かんたんチェックを行ってください。

【情報】
- 副業の年間収入（見込み）: ${totalIncome}\n- 経費の合計: ${totalExpenses}\n- 本業の雇用形態: ${employmentType}\n- 気になること（任意）: ${concerns}

全て日本語で、55歳以上の方にもわかりやすく、具体的なアドバイスを含めて出力してください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00033 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}
