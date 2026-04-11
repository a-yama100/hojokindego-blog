'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { ProfileData } from '@/lib/profileHelper'

interface ProfileActionButtonsProps {
  hasInput: boolean
  onClear: () => void
  onLoadProfile: (profile: ProfileData) => void
  onLoadExample: () => void
}

export function ProfileActionButtons({
  hasInput,
  onClear,
  onLoadProfile,
  onLoadExample
}: ProfileActionButtonsProps) {
  const { session } = useAuth()
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [sampleLoaded, setSampleLoaded] = useState(false)

  const handleLoadProfile = async () => {
    if (!session?.access_token) {
      alert('プロフィールを読み込むにはログインが必要です')
      return
    }
    setProfileLoading(true)
    try {
      const res = await fetch('/api/profile/load', {
        
      })
      if (res.ok) {
        const data = await res.json()
        if (data.profile && Object.values(data.profile).some((v: unknown) => v)) {
          onClear()
          onLoadProfile(data.profile)
          setProfileLoaded(true)
          setSampleLoaded(false)
        } else {
          alert('プロフィールが未設定です。マイページで設定してください。')
        }
      }
    } catch {
      alert('プロフィールの読み込みに失敗しました')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleLoadExample = () => {
    onLoadExample()
    setSampleLoaded(true)
    setProfileLoaded(false)
  }

  const handleClear = () => {
    onClear()
    setProfileLoaded(false)
    setSampleLoaded(false)
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center">
      <button
        type="button"
        onClick={handleLoadProfile}
        disabled={profileLoading || profileLoaded}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${
          profileLoaded
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-green-700 hover:bg-green-800 text-white'
        }`}
      >
        {profileLoading ? '読み込み中...' : profileLoaded ? '✓ プロフィール反映済み' : 'プロフィールを反映'}
      </button>
      <button
        type="button"
        onClick={handleLoadExample}
        disabled={sampleLoaded}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${
          sampleLoaded
            ? 'bg-slate-100 text-slate-700 border border-slate-300'
            : 'bg-slate-600 hover:bg-slate-700 text-white'
        }`}
      >
        {sampleLoaded ? '✓ サンプル入力済み' : 'サンプルを入力'}
      </button>
      {(hasInput || profileLoaded || sampleLoaded) && (
        <button
          type="button"
          onClick={handleClear}
          className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {'クリア'}
        </button>
      )}
    </div>
  )
}