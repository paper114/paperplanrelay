import { formatTime } from '../utils/timeFormat'

interface PlaneCardProps {
  content: string
  nickname?: string
  color: string
  likeCount: number
  createdAt: string
  onLike?: () => void
  onFavorite?: () => void
  onReport?: () => void
  isLiked?: boolean
  isFavorited?: boolean
  expanded?: boolean
  onClick?: () => void
}

const colorStyles: Record<string, { bg: string; border: string }> = {
  blue: { bg: 'rgba(108, 140, 255, 0.08)', border: 'rgba(108, 140, 255, 0.18)' },
  red: { bg: 'rgba(255, 138, 138, 0.08)', border: 'rgba(255, 138, 138, 0.18)' },
  green: { bg: 'rgba(120, 224, 182, 0.08)', border: 'rgba(120, 224, 182, 0.18)' },
  yellow: { bg: 'rgba(255, 224, 138, 0.08)', border: 'rgba(255, 224, 138, 0.18)' },
  purple: { bg: 'rgba(177, 140, 255, 0.08)', border: 'rgba(177, 140, 255, 0.18)' },
  pink: { bg: 'rgba(255, 154, 203, 0.08)', border: 'rgba(255, 154, 203, 0.18)' },
}

function HeartIcon({ filled, className = 'w-4 h-4' }: { filled?: boolean; className?: string }) {
  return filled ? (
    <svg viewBox="0 0 24 24" className={className} fill="#FF6B8A" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function StarIcon({ filled, className = 'w-4 h-4' }: { filled?: boolean; className?: string }) {
  return filled ? (
    <svg viewBox="0 0 24 24" className={className} fill="#FFE08A" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function FlagIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#FF8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function UserIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function PlaneCard({
  content,
  nickname,
  color,
  likeCount,
  createdAt,
  onLike,
  onFavorite,
  onReport,
  isLiked,
  isFavorited,
  expanded = false,
  onClick,
}: PlaneCardProps) {
  const cs = colorStyles[color] || colorStyles.blue

  return (
    <div
      className="glass-card relative"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        background: `var(--bg-glass)`,
        borderColor: cs.border,
      }}
      onClick={onClick}
    >
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: cs.border.replace('0.18', '0.6') }}
          />
          {nickname && (
            <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <UserIcon className="w-3.5 h-3.5" />
              {nickname}
            </span>
          )}
          <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
            {formatTime(createdAt)}
          </span>
        </div>

        <p
          className={`leading-relaxed text-base ${expanded ? '' : 'line-clamp-3'}`}
          style={{ color: 'var(--text-primary)' }}
        >
          {content}
        </p>

        {(onLike || onFavorite || onReport) && (
          <div className="flex items-center gap-2 mt-5 pt-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
            {onLike && (
              <button
                onClick={(e) => { e.stopPropagation(); onLike() }}
                className="btn-icon"
                style={isLiked ? { background: 'rgba(255, 107, 138, 0.15)', borderColor: 'rgba(255, 107, 138, 0.3)', color: '#FF6B8A' } : {}}
                aria-label={isLiked ? '取消点赞' : '点赞'}
              >
                <HeartIcon filled={isLiked} className="w-4 h-4" />
                <span>{likeCount}</span>
              </button>
            )}
            {onFavorite && (
              <button
                onClick={(e) => { e.stopPropagation(); onFavorite() }}
                className="btn-icon"
                style={isFavorited ? { background: 'rgba(255, 224, 138, 0.18)', borderColor: 'rgba(255, 224, 138, 0.3)' } : {}}
                aria-label={isFavorited ? '取消收藏' : '收藏'}
              >
                <StarIcon filled={isFavorited} className="w-4 h-4" />
                <span>{isFavorited ? '已收藏' : '收藏'}</span>
              </button>
            )}
            {onReport && (
              <button
                onClick={(e) => { e.stopPropagation(); onReport() }}
                className="btn-icon ml-auto"
                aria-label="举报"
              >
                <FlagIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
