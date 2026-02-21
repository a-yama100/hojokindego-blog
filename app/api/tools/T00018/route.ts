import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/aiProvider'
import type { AIProvider } from '@/lib/aiProvider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, career, skills, hobbies, purpose, tone, aiProvider = 'chatgpt', autonomyLevel = 3 } = body
    if (!career && !skills) {
      return NextResponse.json({ error: '経歴またはスキルのどちらかは必須です' }, { status: 400 })
    }
    const prompt = `あなたはプロのプロフィールライターです。
以下の情報から、目的に合った自己紹介文を5パターン作成してください。

【情報】
- 名前: ${name || '未設定'}
- 経歴: ${career || '未設定'}
- スキル: ${skills || '未設定'}
- 趣味: ${hobbies || '未設定'}
- 使用目的: ${purpose || '一般'}
- トーン: ${tone || '普通'}

【出力形式】
## 自己紹介文 5パターン

### 1. 短文型（50文字）
（SNSプロフィール向け）

### 2. 標準型（150文字）
（名刺やプロフィールページ向け）

### 3. 詳細型（300文字）
（ブログやLP向け）

### 4. ビジネス型（200文字）
（仕事の実績を強調）

### 5. カジュアル型（150文字）
（親しみやすいトーン）

全て日本語で書いてください。`

    const result = await callAI(aiProvider as AIProvider, prompt, autonomyLevel)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('T00018 error:', error)
    return NextResponse.json({ error: 'AI処理中にエラーが発生しました' }, { status: 500 })
  }
}