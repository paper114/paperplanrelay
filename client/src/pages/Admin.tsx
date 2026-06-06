import { useEffect, useState } from 'react'
import api, { adminGetPlanes, adminDeletePlane, adminRestorePlane, adminGetStats, adminLogin } from '../services/api'
import type { PaperPlane } from '../services/api'

const ADMIN_KEY_KEY = 'paperplane_admin_key'

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [loginError, setLoginError] = useState('')

  const [planes, setPlanes] = useState<PaperPlane[]>([])
  const [stats, setStats] = useState<{ totalPlanes: number; reportedPlanes: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const savedKey = localStorage.getItem(ADMIN_KEY_KEY)
    if (savedKey) {
      setKeyInput(savedKey)
      verifyKey(savedKey)
    }
  }, [])

  const verifyKey = async (key: string) => {
    try {
      await adminLogin(key)
      setAuthenticated(true)
      localStorage.setItem(ADMIN_KEY_KEY, key)
      loadData(key)
    } catch {
      setLoginError('密钥无效')
      setAuthenticated(false)
    }
  }

  const loadData = async (adminKey?: string) => {
    setLoading(true)
    const k = adminKey || localStorage.getItem(ADMIN_KEY_KEY) || ''
    try {
      api.defaults.headers.common['X-Admin-Key'] = k
      const [planesRes, statsRes] = await Promise.all([
        adminGetPlanes({ status: statusFilter || undefined, search: search || undefined, page }),
        adminGetStats(),
      ])
      setPlanes(planesRes.data.planes)
      setStats(statsRes.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authenticated) loadData()
  }, [page, statusFilter])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    verifyKey(keyInput)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该纸飞机？')) return
    try {
      await adminDeletePlane(id)
      loadData()
    } catch {}
  }

  const handleRestore = async (id: string) => {
    try {
      await adminRestorePlane(id)
      loadData()
    } catch {}
  }

  const handleSearch = () => {
    setPage(1)
    loadData()
  }

  if (!authenticated) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
          <h2 className="text-xl font-bold text-white mb-6 text-center">🔐 管理员登录</h2>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="请输入管理员密钥"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-4"
          />
          {loginError && <p className="text-red-400 text-sm mb-4">{loginError}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            登录
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">管理员后台 🛡️</h1>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.totalPlanes}</div>
            <div className="text-gray-500 text-sm">总纸飞机</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.reportedPlanes}</div>
            <div className="text-gray-500 text-sm">被举报</div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="搜索内容..."
          className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="">全部状态</option>
          <option value="active">正常</option>
          <option value="deleted">已删除</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition-colors"
        >
          搜索
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-12">加载中...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="text-left py-3 px-2">ID</th>
                  <th className="text-left py-3 px-2">内容摘要</th>
                  <th className="text-left py-3 px-2">状态</th>
                  <th className="text-left py-3 px-2">点赞</th>
                  <th className="text-left py-3 px-2">举报</th>
                  <th className="text-left py-3 px-2">时间</th>
                  <th className="text-left py-3 px-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {planes.map((plane) => (
                  <tr key={plane.id} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                    <td className="py-3 px-2 text-gray-500 font-mono text-xs">{plane.id.slice(0, 8)}</td>
                    <td className="py-3 px-2 text-gray-300 max-w-[200px] truncate">{plane.content}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        plane.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {plane.status === 'active' ? '正常' : '已删除'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-400">{plane.likes}</td>
                    <td className="py-3 px-2 text-gray-400">{plane.reports}</td>
                    <td className="py-3 px-2 text-gray-500 text-xs">{new Date(plane.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2">
                      {plane.status === 'active' ? (
                        <button
                          onClick={() => handleDelete(plane.id)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          删除
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(plane.id)}
                          className="text-green-400 hover:text-green-300 text-xs"
                        >
                          恢复
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 disabled:opacity-50 hover:bg-gray-700"
            >
              上一页
            </button>
            <span className="px-4 py-2 text-gray-400">第 {page} 页</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={planes.length < 20}
              className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 disabled:opacity-50 hover:bg-gray-700"
            >
              下一页
            </button>
          </div>
        </>
      )}
    </div>
  )
}
