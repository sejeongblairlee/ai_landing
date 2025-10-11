'use client'

import { useEffect, useRef, useState } from 'react'
import { Globe } from '@/components/ui/globe'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMounted(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative flex h-[600px] w-full items-center justify-center overflow-hidden bg-white dark:bg-background text-gray-900 dark:text-white z-0"
    >
      {mounted && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ willChange: 'transform, opacity' }}
        >
          <Globe 
            className="absolute inset-0 opacity-40 dark:opacity-25"
            config={{
              width: 800,
              height: 800,
              devicePixelRatio: 2,
              phi: 0,
              theta: 0.3,
              dark: 0,
              diffuse: 0.4,
              mapSamples: 16000,
              mapBrightness: 1.2,
              baseColor: [1, 1, 1],
              markerColor: [176 / 255, 255 / 255, 1 / 255], // B0FF01
              glowColor: [1, 1, 1],
              markers: [
                { location: [14.5995, 120.9842], size: 0.03 },
                { location: [19.076, 72.8777], size: 0.1 },
                { location: [23.8103, 90.4125], size: 0.05 },
                { location: [30.0444, 31.2357], size: 0.07 },
                { location: [39.9042, 116.4074], size: 0.08 },
                { location: [-23.5505, -46.6333], size: 0.1 },
                { location: [19.4326, -99.1332], size: 0.1 },
                { location: [40.7128, -74.006], size: 0.1 },
                { location: [34.6937, 135.5022], size: 0.05 },
                { location: [41.0082, 28.9784], size: 0.06 },
              ],
            }}
          />
          {/* 하단 그라데이션 마스크 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 dark:via-background/30 to-white dark:to-background"></div>
        </div>
      )}

    </section>
  )
}
