import { useEffect, useState, useRef, useCallback } from 'react'

const SPLASH_COOKIE = 'paperplane_splash_shown'
const SPLASH_DURATION = 2200

function getCookie(name: string): boolean {
  return document.cookie.split(';').some((c) => c.trim().startsWith(name + '='))
}

function setCookie(name: string) {
  document.cookie = `${name}=1;max-age=${365 * 86400};path=/;SameSite=Lax`
}

export default function Splash({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'splash' | 'fading' | 'done'>(
    getCookie(SPLASH_COOKIE) ? 'done' : 'splash'
  )
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([])
  const trailId = useRef(0)
  const planeRef = useRef<HTMLDivElement>(null)
  const lastTrail = useRef(0)

  const addTrail = useCallback(() => {
    if (!planeRef.current) return
    const now = Date.now()
    if (now - lastTrail.current < 40) return
    lastTrail.current = now

    const rect = planeRef.current.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    trailId.current += 1
    setTrails((prev) => [...prev.slice(-20), { id: trailId.current, x, y }])
  }, [])

  useEffect(() => {
    if (phase !== 'splash') return

    const trailInterval = setInterval(addTrail, 50)

    const fadeTimer = setTimeout(() => {
      setPhase('fading')
      setCookie(SPLASH_COOKIE)
    }, SPLASH_DURATION)

    const doneTimer = setTimeout(() => {
      setPhase('done')
    }, SPLASH_DURATION + 600)

    return () => {
      clearInterval(trailInterval)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [phase, addTrail])

  if (phase === 'done') {
    return <>{children}</>
  }

  return (
    <>
      <div className={`splash-overlay ${phase === 'fading' ? 'fade-out' : ''}`}>
        <div ref={planeRef} className="splash-plane">
          <img src="/plane-icon.webp" alt="" className="w-28 h-28 sm:w-36 sm:h-36" draggable={false} />
        </div>
        {trails.map((t) => (
          <div
            key={t.id}
            className="splash-trail"
            style={{ left: t.x - 3, top: t.y - 3 }}
          />
        ))}
      </div>
      <div style={{ opacity: phase === 'splash' ? 0 : 1, transition: 'opacity 0.5s ease-out' }}>
        {children}
      </div>
    </>
  )
}
