import Link from 'next/link'

export function AuthorBio() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-start gap-4">
        <Link href="/about" className="flex-shrink-0">
          <img
            src="/images/about/avatar.png"
            alt="運営者"
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 hover:border-green-600 transition"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href="/about" className="text-lg font-bold text-gray-900 hover:text-green-700 transition">
            <img src="/images/about/name-jp.png" alt="運営者" width="290" height="35" />
          </Link>
          <p className="text-sm text-gray-600 mt-1">
            ITエンジニア歴 35年以上
          </p>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            AIエンジニア・データサイエンティスト・フルスタック開発者。55歳以上の方が「体力を使わず、知恵を使って」AIで副収入を得るための実践的なツールとノウハウを提供しています。
          </p>
          <div className="flex gap-3 mt-3">
            <Link
              href="/about"
              className="text-sm text-green-700 hover:text-green-800 font-medium transition"
            >
              プロフィールを見る →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
