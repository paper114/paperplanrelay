import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../services/api'
import type { Stats } from '../services/api'

function PaperPlaneIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 50L85 15L55 50L85 85Z"
        fill="url(#planeGrad)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      <path d="M10 50L55 50" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <defs>
        <linearGradient id="planeGrad" x1="10" y1="50" x2="85" y2="15">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
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
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="animate-float mb-8">
        <PaperPlaneIcon className="w-28 h-28 sm:w-36 sm:h-36" />
      </div>

      <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 text-center">
        纸机驿站
      </h1>

      <p className="text-gray-400 text-lg sm:text-xl mb-10 text-center max-w-md">
        投出一架纸飞机，随机接住一个陌生人的世界
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link
          to="/send"
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-2xl text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 text-center"
        >
          ✈️ 投递纸飞机
        </Link>
        <Link
          to="/receive"
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-2xl text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 text-center"
        >
          📬 接收纸飞机
        </Link>
      </div>

      {stats && (
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-400">{stats.totalPlanes}</div>
            <div className="text-gray-500 text-sm mt-1">架纸飞机已投递</div>
          </div>
          <div className="w-px bg-gray-800" />
          <div>
            <div className="text-3xl font-bold text-purple-400">{stats.totalUsers}</div>
            <div className="text-gray-500 text-sm mt-1">位飞行者</div>
          </div>
          <div className="w-px bg-gray-800" />
          <div>
            <div className="text-3xl font-bold text-pink-400">{stats.todayPlanes}</div>
            <div className="text-gray-500 text-sm mt-1">今日投递</div>
          </div>
        </div>
      )}
    </div>
  )
}
