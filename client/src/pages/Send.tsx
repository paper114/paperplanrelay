import { useState } from 'react'
import { createPlane } from '../services/api'

const colors = [
  { value: 'blue', label: '蓝', bg: 'bg-blue-500', ring: 'ring-blue-300' },
  { value: 'red', label: '红', bg: 'bg-red-500', ring: 'ring-red-300' },
  { value: 'green', label: '绿', bg: 'bg-green-500', ring: 'ring-green-300' },
  { value: 'yellow', label: '黄', bg: 'bg-yellow-500', ring: 'ring-yellow-300' },
  { value: 'purple', label: '紫', bg: 'bg-purple-500', ring: 'ring-purple-300' },
  { value: 'pink', label: '粉', bg: 'bg-pink-500', ring: 'ring-pink-300' },
]

export default function Send() {
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('')
  const [color, setColor] = useState('blue')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

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
      setShowAnimation(true)
      setTimeout(() => {
        setSuccess(true)
        setShowAnimation(false)
      }, 1500)
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
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-6">✈️</div>
        <h2 className="text-2xl font-bold text-white mb-3">投递成功！</h2>
        <p className="text-gray-400 mb-8 text-center">你的纸飞机已经飞向了某个陌生人~</p>
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition-colors"
          >
            再投一架
          </button>
          <a
            href="/receive"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-xl text-white transition-all"
          >
            去接收
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {showAnimation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="animate-fly-away">
              <svg viewBox="0 0 100 100" className="w-24 h-24" fill="none">
                <path d="M10 50L85 15L55 50L85 85Z" fill="#60a5fa" />
              </svg>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-white mb-8 text-center">投递纸飞机 ✈️</h1>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">写点什么吧...</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, maxContent))}
              placeholder="在这里写下你想说的话..."
              rows={6}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
            />
            <div className={`text-right text-sm mt-1 ${remaining < 50 ? 'text-red-400' : 'text-gray-500'}`}>
              剩余 {remaining} 字
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">昵称（可选）</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, maxNickname))}
              placeholder="匿名飞行者"
              maxLength={maxNickname}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-3">选择纸飞机颜色</label>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-10 h-10 rounded-full ${c.bg} transition-all ${
                    color === c.value ? `ring-2 ${c.ring} scale-110` : 'hover:scale-105 opacity-60 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold text-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
          >
            {submitting ? '投递中...' : '✈️ 投递纸飞机'}
          </button>
        </div>
      </div>
    </div>
  )
}
