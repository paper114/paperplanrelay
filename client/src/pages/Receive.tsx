import { useState } from 'react'
import { getRandomPlane, likePlane, favoritePlane } from '../services/api'
import type { PaperPlane } from '../services/api'
import PlaneCard from '../components/PlaneCard'
import ReportModal from '../components/ReportModal'
import { reportPlane } from '../services/api'

export default function Receive() {
  const [plane, setPlane] = useState<PaperPlane | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reportOpen, setReportOpen] = useState(false)

  const fetchPlane = async () => {
    setLoading(true)
    setError('')
    setPlane(null)
    try {
      const res = await getRandomPlane()
      setPlane(res.data)
    } catch {
      setError('暂时没有纸飞机了，稍后再来看看吧~')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!plane) return
    try {
      await likePlane(plane.id)
      setPlane({ ...plane, likes: plane.likes + 1 })
    } catch {}
  }

  const handleFavorite = async () => {
    if (!plane) return
    try {
      if (plane.isFavorited) {
        setPlane({ ...plane, isFavorited: false })
      } else {
        await favoritePlane(plane.id)
        setPlane({ ...plane, isFavorited: true })
      }
    } catch {}
  }

  const handleReport = async (reason: string) => {
    if (!plane) return
    await reportPlane(plane.id, reason)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">接收纸飞机 📬</h1>

      {!plane && !loading && !error && (
        <div className="flex flex-col items-center">
          <button
            onClick={fetchPlane}
            className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl text-white font-semibold text-xl transition-all hover:scale-105 animate-pulse-glow"
          >
            <span className="relative z-10">✈️ 接收纸飞机</span>
          </button>
          <p className="text-gray-500 mt-4 text-sm">点击按钮，随机接收一架来自陌生人的纸飞机</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center">
          <div className="animate-fly-in">
            <svg viewBox="0 0 100 100" className="w-20 h-20" fill="none">
              <path d="M10 50L85 15L55 50L85 85Z" fill="#a78bfa" />
            </svg>
          </div>
          <p className="text-gray-400 mt-4">正在接收纸飞机...</p>
        </div>
      )}

      {error && (
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchPlane}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition-colors"
          >
            再试一次
          </button>
        </div>
      )}

      {plane && !loading && (
        <div className="w-full max-w-lg">
          <PlaneCard
            content={plane.content}
            nickname={plane.nickname}
            color={plane.color}
            likes={plane.likes}
            createdAt={plane.createdAt}
            isFavorited={plane.isFavorited}
            onLike={handleLike}
            onFavorite={handleFavorite}
            onReport={() => setReportOpen(true)}
          />
          <button
            onClick={fetchPlane}
            className="w-full mt-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-xl text-gray-300 hover:text-white transition-colors"
          >
            🔄 再接收一架
          </button>
        </div>
      )}

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReport}
      />
    </div>
  )
}
