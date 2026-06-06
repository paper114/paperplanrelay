import { useState } from 'react'

const reasons = [
  { value: 'spam', label: '垃圾广告' },
  { value: 'abuse', label: '辱骂攻击' },
  { value: 'porn', label: '色情低俗' },
  { value: 'politics', label: '政治敏感' },
  { value: 'illegal', label: '违法内容' },
  { value: 'other', label: '其他原因' },
]

interface ReportModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-4">举报纸飞机</h3>

        {done ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-gray-300">举报已提交，我们会尽快处理</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-4">请选择举报原因：</p>
            <div className="space-y-2 mb-6">
              {reasons.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selected === r.value
                      ? 'bg-blue-600/20 border border-blue-500/50'
                      : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={selected === r.value}
                    onChange={() => setSelected(r.value)}
                    className="accent-blue-500"
                  />
                  <span className="text-gray-200">{r.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selected || submitting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
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
