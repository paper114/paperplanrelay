import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { getRandomPlane, likePlane, unlikePlane, favoritePlane, unfavoritePlane, reportPlane } from '../services/api'
import type { PaperPlane } from '../services/api'
import PlaneCard from '../components/PlaneCard'
import ReportModal from '../components/ReportModal'

const RECEIVE_PLANE_STORAGE_KEY = 'paperplanrelay:receive-plane'

function getStoredPlane(): PaperPlane | null {
  try {
    const stored = sessionStorage.getItem(RECEIVE_PLANE_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    sessionStorage.removeItem(RECEIVE_PLANE_STORAGE_KEY)
    return null
  }
}

function PlaneIconReceive() {
  return (
    <img src="/plane-icon.webp" alt="纸飞机" className="w-20 h-20" draggable={false} />
  )
}

function InboxIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

function RefreshIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}

function FrownIcon({ className = 'w-12 h-12', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
    </svg>
  )
}

export default function Receive() {
  const [plane, setPlane] = useState<PaperPlane | null>(() => getStoredPlane())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (plane) {
      sessionStorage.setItem(RECEIVE_PLANE_STORAGE_KEY, JSON.stringify(plane))
    } else {
      sessionStorage.removeItem(RECEIVE_PLANE_STORAGE_KEY)
    }
  }, [plane])

  const fetchPlane = async () => {
    const currentPlaneId = plane?.id
    setLoading(true)
    setError('')
    setPlane(null)
    setAnimating(true)
    try {
      const res = await getRandomPlane(currentPlaneId)
      setTimeout(() => {
        setPlane(res.data)
        setAnimating(false)
        setLoading(false)
      }, 600)
    } catch (err: any) {
      setError(err?.response?.data?.message || '暂时没有纸飞机了，稍后再来看看吧~')
      setAnimating(false)
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!plane) return
    try {
      if (plane.isLiked) {
        await unlikePlane(plane.id)
        setPlane({ ...plane, likeCount: plane.likeCount - 1, isLiked: false })
      } else {
        await likePlane(plane.id)
        setPlane({ ...plane, likeCount: plane.likeCount + 1, isLiked: true })
      }
    } catch {}
  }

  const handleFavorite = async () => {
    if (!plane) return
    try {
      if (plane.isFavorited) {
        await unfavoritePlane(plane.id)
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
    <div className="min-h-[calc(100vh-8.5rem)] flex flex-col items-center justify-center px-4 py-12 page-enter">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
        接收纸飞机
      </h1>

      {!plane && !loading && !error && (
        <div className="flex flex-col items-center">
          <button
            onClick={fetchPlane}
            className="btn-primary text-lg"
            style={{ height: 60, padding: '0 36px' }}
          >
            <InboxIcon className="w-6 h-6" />
            接收纸飞机
          </button>
          <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            点击按钮，随机接收一架来自陌生人的纸飞机
          </p>
        </div>
      )}

      {animating && (
        <div className="flex flex-col items-center">
          <div className="animate-plane-receive">
            <PlaneIconReceive />
          </div>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>正在接收纸飞机...</p>
        </div>
      )}

      {error && !animating && (
        <div className="text-center">
          <FrownIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button onClick={fetchPlane} className="btn-secondary">
            再试一次
          </button>
        </div>
      )}

      {plane && !animating && (
        <div className="w-full max-w-lg animate-card-reveal">
          <PlaneCard
            content={plane.content}
            nickname={plane.nickname}
            color={plane.color}
            likeCount={plane.likeCount}
            createdAt={plane.createdAt}
            isLiked={plane.isLiked}
            isFavorited={plane.isFavorited}
            onLike={handleLike}
            onFavorite={handleFavorite}
            onReport={() => setReportOpen(true)}
          />
          <button
            onClick={fetchPlane}
            className="btn-secondary w-full mt-5"
          >
            <RefreshIcon className="w-4 h-4" />
            再接收一架
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
