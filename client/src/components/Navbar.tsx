import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/send', label: '投递' },
  { to: '/receive', label: '接收' },
  { to: '/favorites', label: '收藏' },
  { to: '/about', label: '关于' },
]

function PlaneIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <img src="/plane-icon.webp" alt="纸飞机" className={className} draggable={false} />
  )
}

export default function Navbar() {
  const location = useLocation()
  const tabsRef = useRef<HTMLDivElement | null>(null)
  const activeTabRef = useRef<HTMLAnchorElement | null>(null)
  const [indicator, setIndicator] = useState({ x: 0, width: 0, ready: false })

  const updateIndicator = () => {
    const tabs = tabsRef.current
    const activeTab = activeTabRef.current
    if (!tabs || !activeTab) return

    setIndicator({
      x: activeTab.offsetLeft,
      width: activeTab.offsetWidth,
      ready: true,
    })
  }

  useLayoutEffect(() => {
    updateIndicator()
  }, [location.pathname])

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })

    const frame = requestAnimationFrame(updateIndicator)
    window.addEventListener('resize', updateIndicator)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', updateIndicator)
    }
  }, [location.pathname])

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="nav-shell w-full px-4 sm:px-8">
        <Link to="/" className="nav-brand flex items-center gap-2 font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          <PlaneIcon className="w-7 h-7" />
          <span style={{ color: 'var(--text-primary)' }}>
            纸机驿站
          </span>
        </Link>
        <div className="nav-tabs-wrap" aria-label="主要导航">
          <div className="nav-tabs" ref={tabsRef}>
            <span
              className="nav-active-indicator"
              style={{
                opacity: indicator.ready ? 1 : 0,
                transform: `translateX(${indicator.x}px)`,
                width: indicator.width,
              }}
            />
          {navLinks.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                ref={active ? activeTabRef : undefined}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                className="nav-tab text-sm font-medium transition-all duration-200"
                style={{
                  color: active ? '#111111' : 'var(--text-secondary)',
                }}
              >
                {link.label}
              </Link>
            )
          })}
          </div>
        </div>
      </div>
    </nav>
  )
}
