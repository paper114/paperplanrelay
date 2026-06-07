import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../services/api'
import type { Stats } from '../services/api'

function PlaneIconLarge({ className = '' }: { className?: string }) {
  return (
    <img src="/plane-icon.png" alt="纸飞机" className={className} draggable={false} />
  )
}

function SendIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function InboxIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12 page-enter">
      <div className="animate-float mb-8">
        <PlaneIconLarge className="w-28 h-28 sm:w-36 sm:h-36" />
      </div>

      <h1
        className="text-4xl sm:text-5xl font-bold mb-4 text-center"
        style={{ color: 'var(--text-primary)' }}
      >
        纸机驿站
      </h1>

      <p className="text-lg sm:text-xl mb-10 text-center max-w-md" style={{ color: 'var(--text-secondary)' }}>
        投出一架纸飞机，随机接住一个陌生人的世界
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link
          to="/send"
          className="text-base font-semibold text-white inline-flex items-center justify-center gap-2"
          style={{
            height: 52,
            padding: '0 32px',
            fontSize: '16px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.42)',
            background: 'linear-gradient(135deg, #78E0B6, #68D8FF)',
            boxShadow: '0 10px 24px rgba(120, 224, 182, 0.28)',
            transition: 'transform 180ms ease-out, box-shadow 180ms ease-out',
          }}
        >
          <SendIcon className="w-5 h-5" />
          投递纸飞机
        </Link>
        <Link
          to="/receive"
          className="btn-secondary text-base"
          style={{ height: 52, padding: '0 32px', fontSize: '16px' }}
        >
          <InboxIcon className="w-5 h-5" />
          接收纸飞机
        </Link>
      </div>

      {stats && (
        <div className="glass-card flex items-center gap-8 px-8 py-5">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#6C8CFF' }}>{stats.totalCount}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>架纸飞机已投递</div>
          </div>
          <div className="w-px h-8" style={{ background: 'var(--border-soft)' }} />
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#B18CFF' }}>—</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>等待你的纸飞机</div>
          </div>
        </div>
      )}
    </div>
  )
}
