"use client"

import { useEffect, useRef } from 'react'

interface HeroVideoProps {
  src: string
  children: React.ReactNode
  overlayOpacity?: number
}

export function HeroVideo({ src, children, overlayOpacity = 0.8 }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {})
    }
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[350px] md:min-h-[420px] flex items-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  )
}
