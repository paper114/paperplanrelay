import { useState } from 'react'

const reasons = [
  '垃圾广告',
  '辱骂攻击',
  '色情低俗',
  '政治敏感',
  '违法内容',
  '其他原因',
]

interface ReportModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

function CheckCircleIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#78E0B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function XIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function ReportModal({ open, onClose, onSubmit }: ReportModalProps) {
  const [selected, setSelected] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  if (!open) return null

  const handleSubmit = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await onSubmit(selected)
      setDone(true)
      setTimeout(() => {
        setDone(false)
        setSelected('')
        onClose()
      }, 1500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-mask" onClick={onClose}>
      <div
        className="glass-card-strong w-full max-w-md p-7 animate-page-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>举报纸飞机</h3>
          <button onClick={onClose} className="btn-icon" style={{ height: 32, width: 32, padding: 0 }} aria-label="关闭">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <div className="text-center py-8">
            <CheckCircleIcon className="w-14 h-14 mx-auto mb-3" />
            <p style={{ color: 'var(--text-secondary)' }}>举报已提交，我们会尽快处理</p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>请选择举报原因：</p>
            <div className="space-y-2 mb-6">
              {reasons.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-180"
                  style={{
                    background: selected === r ? 'rgba(108, 140, 255, 0.12)' : 'rgba(255,255,255,0.20)',
                    border: selected === r ? '1px solid rgba(108, 140, 255, 0.3)' : '1px solid transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={selected === r}
                    onChange={() => setSelected(r)}
                    className="accent-[#6C8CFF]"
                  />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{r}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="btn-secondary text-sm" style={{ height: 38 }}>
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selected || submitting}
                className="text-sm"
                style={{
                  height: 38,
                  padding: '0 18px',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: selected && !submitting
                    ? 'linear-gradient(135deg, #FF6B8A, #FF9ACB)'
                    : 'rgba(255,107,138,0.4)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: selected && !submitting ? 'pointer' : 'not-allowed',
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? '提交中...' : '提交举报'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
