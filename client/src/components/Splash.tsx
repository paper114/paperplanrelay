import { useEffect, useState } from 'react'

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

  useEffect(() => {
    if (phase !== 'splash') return

    const fadeTimer = setTimeout(() => {
      setPhase('fading')
      setCookie(SPLASH_COOKIE)
    }, SPLASH_DURATION)

    const doneTimer = setTimeout(() => {
      setPhase('done')
    }, SPLASH_DURATION + 600)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [phase])

  if (phase === 'done') {
    return <>{children}</>
  }

  return (
    <>
      <div className={`splash-overlay ${phase === 'fading' ? 'fade-out' : ''}`}>
        <div className="splash-plane">
          <img src="/plane-icon.webp" alt="" className="w-28 h-28 sm:w-36 sm:h-36" draggable={false} />
        </div>
      </div>
      <div style={{ opacity: phase === 'splash' ? 0 : 1, transition: 'opacity 0.5s ease-out' }}>
        {children}
      </div>
    </>
  )
}
