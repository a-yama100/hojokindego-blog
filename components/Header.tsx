"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Container } from './Container'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/auth'
import { SearchModal } from './SearchModal'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    setIsUserMenuOpen(false)
    await signOut()
    window.location.href = '/'
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Ctrl+K / Cmd+K to open search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navLinkClass = "px-3 py-1 bg-emerald-700 text-white text-sm font-medium rounded hover:bg-emerald-800 transition-colors"
  const mobileLinkClass = "block px-3 py-1.5 bg-emerald-700 text-white text-sm font-medium rounded hover:bg-emerald-800 transition-colors"

  const renderAuthDesktop = () => {
    if (user) {
      return (
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1 p-1.5 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="ユーザーメニュー"
          >
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg className={"w-3 h-3 text-gray-400 transition-transform " + (isUserMenuOpen ? "rotate-180" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>Dashboard</Link>
              <Link href="/mypage" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                マイページ
              </Link>
              <Link href="/mypage" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                プロフィール設定
              </Link>
              <div className="border-t border-gray-100 my-1" />
              <button onClick={handleSignOut} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                ログアウト
              </button>
            </div>
          )}
        </div>
      )
    }
    return (
      <Link href={"/login?redirect=" + encodeURIComponent(pathname)} className="flex items-center gap-1.5 px-4 py-1.5 text-white border border-white text-sm rounded hover:bg-white hover:text-gray-950 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        ログイン
      </Link>
    )
  }

  const renderAuthMobile = () => {
    if (user) {
      return (
        <>
          <Link href="/mypage" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>マイページ</Link>
          <Link href="/mypage" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>プロフィール設定</Link>
          <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="text-left px-3 py-1.5 text-red-400 text-sm hover:text-red-300 cursor-pointer">
            ログアウト
          </button>
        </>
      )
    }
    return (
      <Link href={"/login?redirect=" + encodeURIComponent(pathname)} className="px-3 py-1.5 text-white text-sm border border-white rounded hover:bg-white hover:text-gray-950 text-center" onClick={() => setIsMenuOpen(false)}>
        ログイン
      </Link>
    )
  }

  return (
    <>
      <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/about/avatar.png" alt="運営者" width={100} height={100} className="rounded-full w-[60px] h-[60px] md:w-[72px] md:h-[72px]" />
              <span className="text-lg font-bold text-white">補助金でゴー！</span>
            </Link>
            <nav className="hidden nav:flex items-center space-x-3">
              {/* Search button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="検索"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <Link href="/subsidies" className={navLinkClass}>ツール</Link>
              <Link href="/blog" className={navLinkClass}>ブログ</Link>
              <Link href="/support" className={navLinkClass}>サポート</Link>
              {renderAuthDesktop()}
            </nav>
            <div className="flex items-center gap-2 nav:hidden">
              {/* Mobile search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-white"
                aria-label="検索"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                className="cursor-pointer p-2 text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <nav className="nav:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-2">
                <Link href="/subsidies" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>ツール</Link>
                <Link href="/blog" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>ブログ</Link>
                <Link href="/support" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>サポート</Link>
                {renderAuthMobile()}
              </div>
            </nav>
          )}
        </Container>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
