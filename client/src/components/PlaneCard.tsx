import { formatTime } from '../utils/timeFormat'

interface PlaneCardProps {
  content: string
  nickname?: string
  color: string
  likes: number
  createdAt: string
  onLike?: () => void
  onFavorite?: () => void
  onReport?: () => void
  isFavorited?: boolean
  expanded?: boolean
  onClick?: () => void
}

const colorMap: Record<string, string> = {
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  red: 'from-red-500/20 to-red-600/10 border-red-500/30',
  green: 'from-green-500/20 to-green-600/10 border-green-500/30',
  yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
}

export default function PlaneCard({
  content,
  nickname,
  color,
  likes,
  createdAt,
  onLike,
  onFavorite,
  onReport,
  isFavorited,
  expanded = false,
  onClick,
}: PlaneCardProps) {
  const bgClass = colorMap[color] || colorMap.blue

  return (
    <div
      className={`bg-gradient-to-br ${bgClass} border rounded-2xl p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      } ${expanded ? 'ring-2 ring-blue-500/50' : ''}`}
      onClick={onClick}
    >
      <p className={`text-gray-200 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
        {content}
      </p>
      <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
        <div className="flex items-center gap-3">
          {nickname && <span className="text-gray-300">✍️ {nickname}</span>}
          <span>{formatTime(createdAt)}</span>
        </div>
        <span>❤️ {likes}</span>
      </div>
      {(onLike || onFavorite || onReport) && (
        <div className="flex gap-3 mt-4 pt-3 border-t border-gray-700/50">
          {onLike && (
            <button
              onClick={(e) => { e.stopPropagation(); onLike() }}
              className="px-3 py-1 rounded-lg bg-gray-800/50 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors text-sm"
            >
              ❤️ 点赞
            </button>
          )}
          {onFavorite && (
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite() }}
              className={`px-3 py-1 rounded-lg transition-colors text-sm ${
                isFavorited
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-gray-800/50 hover:bg-yellow-500/20 text-gray-300 hover:text-yellow-400'
              }`}
            >
              ⭐ {isFavorited ? '已收藏' : '收藏'}
            </button>
          )}
          {onReport && (
            <button
              onClick={(e) => { e.stopPropagation(); onReport() }}
              className="px-3 py-1 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              🚩 举报
            </button>
          )}
        </div>
      )}
    </div>
  )
}
