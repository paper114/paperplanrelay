import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { getFavorites, unfavoritePlane } from '../services/api'
import type { PaperPlane } from '../services/api'
import PlaneCard from '../components/PlaneCard'

function BookmarkIcon({ className = 'w-16 h-16', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<PaperPlane[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const res = await getFavorites()
      setFavorites(res.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  const handleUnfavorite = async (id: number) => {
    try {
      await unfavoritePlane(id)
      setFavorites((prev) => prev.filter((p) => p.id !== id))
      if (expandedId === id) setExpandedId(null)
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8.5rem)] flex items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8.5rem)] max-w-3xl mx-auto px-4 py-12 page-enter">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
        我的收藏
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <BookmarkIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>你还没有收藏过纸飞机哦~</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            去<a href="/receive" style={{ color: '#111111', textDecoration: 'underline' }}>接收页面</a>看看吧
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((plane) => (
            <PlaneCard
              key={plane.id}
              content={plane.content}
              nickname={plane.nickname}
              color={plane.color}
              likeCount={plane.likeCount}
              createdAt={plane.createdAt}
              isFavorited={true}
              expanded={expandedId === plane.id}
              onClick={() => setExpandedId(expandedId === plane.id ? null : plane.id)}
              onFavorite={() => handleUnfavorite(plane.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
