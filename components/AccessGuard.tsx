"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import type { PlanType } from '@/lib/supabase/types'
import { hasAccess } from '@/lib/supabase/types'

interface AccessGuardProps {
  toolId: string
  requiredPlan?: PlanType
  children: React.ReactNode
}

const PLAN_LABELS: Record<PlanType, string> = {
  free: 'Free',
  light: 'Light',
  standard: 'Standard',
  premium: 'Premium',
}

export function AccessGuard({ toolId, requiredPlan = 'free', children }: AccessGuardProps) {
  const { user, loading } = useAuth()
  const [showMessage, setShowMessage] = useState(false)
  const [messageType, setMessageType] = useState<'login' | 'upgrade' | null>(null)

  const checkAccess = (): boolean => {
    if (loading) return false

    if (!user) {
      setMessageType('login')
      setShowMessage(true)
      return false
    }

    const userPlan = (user.plan_type || 'free') as PlanType
    if (!hasAccess(userPlan, requiredPlan)) {
      setMessageType('upgrade')
      setShowMessage(true)
      return false
    }

    setShowMessage(false)
    setMessageType(null)
    return true
  }

  const dismiss = () => {
    setShowMessage(false)
    setMessageType(null)
  }

  return (
    <>
      {typeof children === 'function'
        ? (children as (checkAccess: () => boolean) => React.ReactNode)(checkAccess)
        : children}

      {showMessage && messageType === 'login' && (
        <div className="mt-4 p-5 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364l-1.414 1.414A2 2 0 0116 12H8a2 2 0 01-1.95-1.95l-1.414-1.414M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-800 text-sm">ログインが必要です</h4>
              <p className="text-amber-700 text-sm mt-1">
                このツールを使用するには、会員登録またはログインが必要です。登録は無料で、1分で完了します。
              </p>
              <div className="flex gap-3 mt-4">
                <Link
                  href={"/signup?redirect=/tools/" + toolId}
                  className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  無料会員登録
                </Link>
                <Link
                  href={"/login?redirect=/tools/" + toolId}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  ログイン
                </Link>
                <button
                  onClick={dismiss}
                  className="cursor-pointer ml-auto text-amber-500 hover:text-amber-700 text-sm"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMessage && messageType === 'upgrade' && (
        <div className="mt-4 p-5 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-blue-800 text-sm">Plan Upgrade Required</h4>
              <p className="text-blue-700 text-sm mt-1">
                このツールのご利用には<strong>{PLAN_LABELS[requiredPlan]}</strong>プラン以上が必要です。
                現在のプラン: <strong>{PLAN_LABELS[(user?.plan_type || 'free') as PlanType]}</strong>.
                アップグレードして、このツールや他の高度なツールをご利用ください。
              </p>
              <div className="flex gap-3 mt-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View Plans
                </Link>
                <button
                  onClick={dismiss}
                  className="cursor-pointer ml-auto text-blue-500 hover:text-blue-700 text-sm"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function useAccessCheck(toolId: string, requiredPlan: PlanType = 'free') {
  const { user, loading } = useAuth()
  const [showMessage, setShowMessage] = useState(false)
  const [messageType, setMessageType] = useState<'login' | 'upgrade' | null>(null)

  const checkAccess = (): boolean => {
    if (loading) return false

    if (!user) {
      setMessageType('login')
      setShowMessage(true)
      return false
    }

    const userPlan = (user.plan_type || 'free') as PlanType
    if (!hasAccess(userPlan, requiredPlan)) {
      setMessageType('upgrade')
      setShowMessage(true)
      return false
    }

    setShowMessage(false)
    setMessageType(null)
    return true
  }

  const dismiss = () => {
    setShowMessage(false)
    setMessageType(null)
  }

  return { checkAccess, showMessage, messageType, dismiss, user, loading }
}

export function AccessMessage({
  toolId,
  requiredPlan = 'free',
  showMessage,
  messageType,
  dismiss,
  user,
}: {
  toolId: string
  requiredPlan?: PlanType
  showMessage: boolean
  messageType: 'login' | 'upgrade' | null
  dismiss: () => void
  user: { plan_type: string } | null
}) {
  if (!showMessage || !messageType) return null

  if (messageType === 'login') {
    return (
      <div className="mt-4 p-5 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-800 text-sm">ログインが必要です</h4>
            <p className="text-amber-700 text-sm mt-1">
              このツールを使用するには、会員登録またはログインが必要です。登録は無料で、1分で完了します。
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link
                href={"/signup?redirect=/tools/" + toolId}
                className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                無料会員登録
              </Link>
              <Link
                href={"/login?redirect=/tools/" + toolId}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                ログイン
              </Link>
              <button
                onClick={dismiss}
                className="cursor-pointer text-amber-500 hover:text-amber-700 text-sm"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 p-5 bg-blue-50 border border-blue-200 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-blue-800 text-sm">Plan Upgrade Required</h4>
          <p className="text-blue-700 text-sm mt-1">
            このツールのご利用には<strong>{PLAN_LABELS[requiredPlan]}</strong>プラン以上が必要です。
            現在のプラン: <strong>{PLAN_LABELS[(user?.plan_type || 'free') as PlanType]}</strong>.
            アップグレードして、このツールや他の高度なツールをご利用ください。
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              View Plans
            </Link>
            <button
              onClick={dismiss}
              className="cursor-pointer text-blue-500 hover:text-blue-700 text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
