import { useState } from 'react'
import { createPlane } from '../services/api'

const colors = [
  { value: 'blue', label: '天蓝', hex: '#6C8CFF' },
  { value: 'purple', label: '紫罗兰', hex: '#B18CFF' },
  { value: 'pink', label: '粉红', hex: '#FF9ACB' },
  { value: 'green', label: '薄荷', hex: '#78E0B6' },
  { value: 'yellow', label: '暖黄', hex: '#FFE08A' },
  { value: 'red', label: '珊瑚', hex: '#FF8A8A' },
]

function PlaneIconSmall() {
  return (
    <img src="/plane-icon.png" alt="纸飞机" className="w-20 h-20" draggable={false} />
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

function RefreshIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}

function CheckCircleIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#78E0B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export default function Send() {
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('')
  const [color, setColor] = useState('blue')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formFading, setFormFading] = useState(false)
  const [planeFlying, setPlaneFlying] = useState(false)

  const maxContent = 500
  const maxNickname = 20
  const remaining = maxContent - content.length

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return
    setSubmitting(true)
    try {
      await createPlane({
        content: content.trim(),
        nickname: nickname.trim() || undefined,
        color,
      })
      setFormFading(true)
      setTimeout(() => {
        setFormFading(false)
        setPlaneFlying(true)
      }, 400)
      setTimeout(() => {
        setPlaneFlying(false)
        setSuccess(true)
      }, 1600)
    } catch {
      alert('投递失败，请稍后再试')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setContent('')
    setNickname('')
    setColor('blue')
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 page-enter">
        <div className="glass-card p-8 sm:p-12 text-center max-w-md">
          <div className="relative z-10">
            <CheckCircleIcon className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>投递成功！</h2>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>你的纸飞机已经飞向了某个陌生人~</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleReset} className="btn-secondary">
                <RefreshIcon className="w-4 h-4" />
                再投一架
              </button>
              <a href="/receive" className="btn-primary">
                去接收
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (planeFlying) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="animate-plane-send">
          <PlaneIconSmall />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 page-enter">
      <div
        className="w-full max-w-lg"
        style={{
          transition: 'opacity 350ms ease-out, transform 350ms ease-out, filter 350ms ease-out',
          opacity: formFading ? 0 : 1,
          transform: formFading ? 'scale(0.96)' : 'scale(1)',
          filter: formFading ? 'blur(6px)' : 'blur(0)',
        }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
          投递纸飞机
        </h1>

        <div className="glass-card p-6 sm:p-8">
          <div className="relative z-10 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                写点什么吧...
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, maxContent))}
                placeholder="在这里写下你想说的话..."
                rows={6}
                className="glass-input w-full p-4 resize-none text-base"
                style={{
                  minHeight: 180,
                  borderRadius: 22,
                  lineHeight: 1.7,
                  borderColor: remaining < 50 ? 'rgba(255, 107, 138, 0.5)' : undefined,
                }}
              />
              <div className="flex justify-end mt-1">
                <span
                  className="text-sm"
                  style={{ color: remaining < 50 ? '#FF6B8A' : 'var(--text-muted)' }}
                >
                  剩余 {remaining} 字
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                昵称（可选）
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, maxNickname))}
                placeholder="匿名飞行者"
                maxLength={maxNickname}
                className="glass-input w-full p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                选择纸飞机颜色
              </label>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className="w-10 h-10 rounded-full transition-all duration-180"
                    style={{
                      background: c.hex,
                      opacity: color === c.value ? 1 : 0.45,
                      transform: color === c.value ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: color === c.value ? `0 4px 14px ${c.hex}44` : 'none',
                      border: color === c.value ? `2px solid ${c.hex}` : '2px solid transparent',
                    }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!content.trim() || submitting}
              className="w-full text-base font-semibold cursor-pointer text-white inline-flex items-center justify-center gap-2"
              style={{
                height: 52,
                padding: '0 22px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.42)',
                background: submitting ? 'rgba(120, 224, 182, 0.4)' : 'linear-gradient(135deg, #78E0B6, #68D8FF)',
                boxShadow: '0 10px 24px rgba(120, 224, 182, 0.28)',
                opacity: !content.trim() ? 0.5 : 1,
                transition: 'transform 180ms ease-out, box-shadow 180ms ease-out, opacity 180ms ease-out',
                pointerEvents: !content.trim() ? 'none' : 'auto',
              }}
            >
              <SendIcon className="w-5 h-5" />
              {submitting ? '投递中...' : '投递纸飞机'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
