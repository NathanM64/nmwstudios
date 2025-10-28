'use client'

import { useEffect, useState } from 'react'

export function LoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Play animation for 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    // Fade out animation
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false)
    }, 3300)

    return () => {
      clearTimeout(timer)
      clearTimeout(fadeOutTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-black transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative flex items-center justify-center">
        <video
          autoPlay
          muted
          playsInline
          loop
          className="h-48 w-48 object-contain md:h-64 md:w-64"
        >
          <source src="/logo_animated.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
