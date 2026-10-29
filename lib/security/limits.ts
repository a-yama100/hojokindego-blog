// フォームの文字数の上限。画面の maxLength と、受け口（API）の確かめの両方でこの値を使う。
export const FIELD_LIMITS = {
  name: 100,
  email: 254,
  company: 200,
  phone: 30,
  category: 100,
  subject: 200,
  url: 2048,
  message: 5000,
  password: 128,
} as const

export type FieldName = keyof typeof FIELD_LIMITS

// 上限を超えた項目の名前を返す（無ければ null）。文字列以外の値（配列・オブジェクト）も弾く。
export function overLimit(values: Partial<Record<FieldName, unknown>>): FieldName | null {
  for (const key of Object.keys(values) as FieldName[]) {
    const v = values[key]
    if (v === undefined || v === null || v === "") continue
    if (typeof v !== "string") return key
    if (v.length > FIELD_LIMITS[key]) return key
  }
  return null
}
