import { useEffect, useState } from 'react'
import { getFavorites, unfavoritePlane } from '../services/api'
import type { PaperPlane } from '../services/api'
import PlaneCard from '../components/PlaneCard'

export default function Favorites() {
  const [favorites, setFavorites] = useState<PaperPlane[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

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

  const handleUnfavorite = async (id: string) => {
    try {
      await unfavoritePlane(id)
      setFavorites((prev) => prev.filter((p) => p.id !== id))
      if (expandedId === id) setExpandedId(null)
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <p className="text-gray-400">加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">我的收藏 ⭐</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-400 text-lg mb-2">你还没有收藏过纸飞机哦~</p>
          <p className="text-gray-500 text-sm">去<a href="/receive" className="text-blue-400 hover:text-blue-300">接收页面</a>看看吧</p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((plane) => (
            <div key={plane.id}>
              <PlaneCard
                content={plane.content}
                nickname={plane.nickname}
                color={plane.color}
                likes={plane.likes}
                createdAt={plane.createdAt}
                isFavorited={true}
                expanded={expandedId === plane.id}
                onClick={() => setExpandedId(expandedId === plane.id ? null : plane.id)}
                onFavorite={() => handleUnfavorite(plane.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
