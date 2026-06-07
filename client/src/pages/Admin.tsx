import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { adminGetPlanes, adminDeletePlane, adminRestorePlane, adminGetStats } from '../services/api'
import type { AdminPlaneItem, AdminStats } from '../services/api'

const ADMIN_KEY_KEY = 'paperplane_admin_key'

function LockIcon({ className = 'w-5 h-5', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function SearchIcon({ className = 'w-4 h-4', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function TrashIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function UndoIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  )
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [adminKey, setAdminKey] = useState('')

  const [planes, setPlanes] = useState<AdminPlaneItem[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const savedKey = sessionStorage.getItem(ADMIN_KEY_KEY)
    if (savedKey) {
      setKeyInput(savedKey)
      verifyKey(savedKey)
    }
  }, [])

  const verifyKey = async (key: string) => {
    try {
      await adminGetStats(key)
      setAuthenticated(true)
      setAdminKey(key)
      sessionStorage.setItem(ADMIN_KEY_KEY, key)
      loadData(1, '', '', key)
    } catch {
      setLoginError('密钥无效')
      setAuthenticated(false)
    }
  }

  const loadData = async (p?: number, s?: string, status?: string, key?: string) => {
    setLoading(true)
    const k = key || adminKey
    try {
      const [planesRes, statsRes] = await Promise.all([
        adminGetPlanes({
          page: p ?? page,
          search: s ?? (search || undefined),
          status: status ?? (statusFilter || undefined),
        }, k),
        adminGetStats(k),
      ])
      setPlanes(planesRes.data.items)
      setTotalPages(planesRes.data.totalPages)
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

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该纸飞机？')) return
    try {
      await adminDeletePlane(id, adminKey)
      loadData()
    } catch {}
  }

  const handleRestore = async (id: number) => {
    try {
      await adminRestorePlane(id, adminKey)
      loadData()
    } catch {}
  }

  const handleSearch = () => {
    setPage(1)
    loadData(1)
  }

  if (!authenticated) {
    return (
      <div className="min-h-[calc(100vh-8.5rem)] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="glass-card p-8 w-full max-w-sm">
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <LockIcon className="w-5 h-5" style={{ color: '#111111' }} />
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>管理员登录</h2>
            </div>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="请输入管理员密钥"
              className="glass-input w-full p-3 mb-4"
            />
            {loginError && <p className="text-sm mb-4" style={{ color: '#FF6B8A' }}>{loginError}</p>}
            <button
              type="submit"
              className="btn-primary w-full"
            >
              登录
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8.5rem)] max-w-6xl mx-auto px-4 py-8 page-enter">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>管理员后台</h1>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: '总纸飞机', value: stats.totalPlanes, color: '#111111' },
            { label: '总点赞', value: stats.totalLikes, color: '#111111' },
            { label: '总举报', value: stats.totalReports, color: '#111111' },
            { label: '今日投递', value: stats.todayPlanes, color: '#111111' },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="搜索内容..."
            className="glass-input w-full p-3 pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="glass-input p-3"
        >
          <option value="">全部状态</option>
          <option value="normal">正常</option>
          <option value="hidden">已隐藏</option>
          <option value="deleted">已删除</option>
        </select>
        <button onClick={handleSearch} className="btn-primary text-sm">
          搜索
        </button>
      </div>

      {loading ? (
        <p className="text-center py-12" style={{ color: 'var(--text-muted)' }}>加载中...</p>
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    {['ID', '内容摘要', '状态', '点赞', '举报', '时间', '操作'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {planes.map((plane) => (
                    <tr key={plane.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                      <td className="py-3 px-4 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{plane.id}</td>
                      <td className="py-3 px-4 max-w-[200px] truncate" style={{ color: 'var(--text-primary)' }}>{plane.content}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{
                            background: '#ffffff',
                            color: '#111111',
                            border: '1px solid #111111',
                          }}
                        >
                          {plane.status === 'normal' ? '正常' : plane.status === 'hidden' ? '已隐藏' : '已删除'}
                        </span>
                      </td>
                      <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{plane.likeCount}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{plane.reportCount}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(plane.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {plane.status === 'normal' ? (
                          <button
                            onClick={() => handleDelete(plane.id)}
                            className="btn-icon"
                            style={{ color: '#111111', borderColor: '#111111' }}
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                            <span>删除</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(plane.id)}
                            className="btn-icon"
                            style={{ color: '#111111', borderColor: '#111111' }}
                          >
                            <UndoIcon className="w-3.5 h-3.5" />
                            <span>恢复</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary text-sm"
              style={{ height: 36, opacity: page === 1 ? 0.5 : 1 }}
            >
              上一页
            </button>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              第 {page} / {totalPages} 页
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="btn-secondary text-sm"
              style={{ height: 36, opacity: page >= totalPages ? 0.5 : 1 }}
            >
              下一页
            </button>
          </div>
        </>
      )}
    </div>
  )
}
