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
    <img src="/plane-icon.png" alt="纸飞机" className={className} draggable={false} />
  )
}

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="glass-nav sticky top-0 z-50" style={{ height: 64 }}>
      <div className="max-w-[1180px] mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          <PlaneIcon className="w-7 h-7" />
          <span style={{ color: 'var(--text-primary)' }}>
            纸机驿站
          </span>
        </Link>
        <div className="flex gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  color: active ? '#6C8CFF' : 'var(--text-secondary)',
                  background: active ? 'rgba(108, 140, 255, 0.12)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
