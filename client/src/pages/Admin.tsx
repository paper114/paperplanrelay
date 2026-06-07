import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  adminApprovePlane,
  adminDeletePlane,
  adminGetPlanes,
  adminGetSettings,
  adminGetStats,
  adminRejectPlane,
  adminRestorePlane,
  adminSetManualReview,
} from '../services/api'
import type { AdminPlaneItem, AdminStats } from '../services/api'

const ADMIN_KEY_KEY = 'paperplane_admin_key'

type AdminView = 'review' | 'published' | 'trash'
type SortOrder = 'asc' | 'desc'

const trashReasonLabels: Record<string, string> = {
  review_rejected: '审核拒绝',
  manual_delete: '手动删除',
  report_hidden: '举报移入',
}

function LockIcon({ className = 'w-5 h-5', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function formatDate(value?: string | null) {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [view, setView] = useState<AdminView>('review')

  const [planes, setPlanes] = useState<AdminPlaneItem[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [trashReason, setTrashReason] = useState('')
  const [sort, setSort] = useState<SortOrder>('asc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [manualReviewEnabled, setManualReviewEnabled] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)

  useEffect(() => {
    const savedKey = sessionStorage.getItem(ADMIN_KEY_KEY)
    if (savedKey) {
      setKeyInput(savedKey)
      verifyKey(savedKey)
    }
  }, [])

  const buildListParams = (targetPage = page) => ({
    page: targetPage,
    search: search || undefined,
    status: view === 'review' ? 'pending' : view === 'published' ? 'normal' : undefined,
    view: view === 'trash' ? 'trash' : undefined,
    trashReason: view === 'trash' ? trashReason || undefined : undefined,
    sort: view === 'review' ? 'asc' : sort,
  })

  const loadData = async (targetPage = page, key = adminKey) => {
    setLoading(true)
    try {
      const [planesRes, statsRes, settingsRes] = await Promise.all([
        adminGetPlanes(buildListParams(targetPage), key),
        adminGetStats(key),
        adminGetSettings(key),
      ])
      setPlanes(planesRes.data.items)
      setTotalPages(Math.max(1, planesRes.data.totalPages))
      setStats(statsRes.data)
      setManualReviewEnabled(settingsRes.data.manualReviewEnabled)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const verifyKey = async (key: string) => {
    try {
      await adminGetStats(key)
      setAuthenticated(true)
      setAdminKey(key)
      sessionStorage.setItem(ADMIN_KEY_KEY, key)
      loadData(1, key)
    } catch {
      setLoginError('密钥无效')
      setAuthenticated(false)
    }
  }

  useEffect(() => {
    if (authenticated) loadData(1)
  }, [view, trashReason, sort])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    verifyKey(keyInput)
  }

  const refreshAfterAction = async () => {
    await loadData(page)
  }

  const handleApprove = async (id: number) => {
    await adminApprovePlane(id, adminKey)
    refreshAfterAction()
  }

  const handleReject = async (id: number) => {
    await adminRejectPlane(id, adminKey)
    refreshAfterAction()
  }

  const handleDelete = async (id: number) => {
    await adminDeletePlane(id, adminKey)
    refreshAfterAction()
  }

  const handleRestore = async (id: number) => {
    await adminRestorePlane(id, adminKey)
    refreshAfterAction()
  }

  const handleManualReviewToggle = async () => {
    const next = !manualReviewEnabled
    setSavingSettings(true)
    try {
      const res = await adminSetManualReview(next, adminKey)
      setManualReviewEnabled(res.data.manualReviewEnabled)
      loadData(1)
    } catch {
      alert('更新审核模式失败，请稍后再试')
    } finally {
      setSavingSettings(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    loadData(1)
  }

  const changeView = (nextView: AdminView) => {
    setView(nextView)
    setPage(1)
    setSearch('')
    setTrashReason('')
    setSort(nextView === 'review' ? 'asc' : 'desc')
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
            <button type="submit" className="btn-primary w-full">登录</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8.5rem)] max-w-6xl mx-auto px-4 py-8 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>审核控制台</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            默认只处理待审核申请，垃圾桶里的内容不会打扰主工作区。
          </p>
        </div>
        <button
          onClick={handleManualReviewToggle}
          disabled={savingSettings}
          className={manualReviewEnabled ? 'btn-primary' : 'btn-secondary'}
          style={{ minWidth: 148, opacity: savingSettings ? 0.65 : 1 }}
        >
          强制审核：{manualReviewEnabled ? '开' : '关'}
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          {[
            { label: '待审核', value: stats.pendingPlanes },
            { label: '总纸飞机', value: stats.totalPlanes },
            { label: '今日投递', value: stats.todayPlanes },
            { label: '总点赞', value: stats.totalLikes },
            { label: '总举报', value: stats.totalReports },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: '#111111' }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'review', label: '审核窗口' },
          { key: 'published', label: '已发布' },
          { key: 'trash', label: '垃圾桶' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => changeView(item.key as AdminView)}
            className={view === item.key ? 'btn-primary' : 'btn-secondary'}
            style={{ height: 38 }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="搜索内容..."
          className="glass-input flex-1 p-3"
        />
        {view === 'trash' && (
          <>
            <select value={trashReason} onChange={(e) => { setTrashReason(e.target.value); setPage(1) }} className="glass-input p-3">
              <option value="">全部原因</option>
              <option value="review_rejected">审核拒绝</option>
              <option value="manual_delete">手动删除</option>
              <option value="report_hidden">举报移入</option>
            </select>
            <select value={sort} onChange={(e) => { setSort(e.target.value as SortOrder); setPage(1) }} className="glass-input p-3">
              <option value="desc">进入时间：新到旧</option>
              <option value="asc">进入时间：旧到新</option>
            </select>
          </>
        )}
        {view !== 'trash' && view !== 'review' && (
          <select value={sort} onChange={(e) => { setSort(e.target.value as SortOrder); setPage(1) }} className="glass-input p-3">
            <option value="desc">发布时间：新到旧</option>
            <option value="asc">发布时间：旧到新</option>
          </select>
        )}
        <button onClick={handleSearch} className="btn-primary text-sm">搜索</button>
      </div>

      {loading ? (
        <p className="text-center py-12" style={{ color: 'var(--text-muted)' }}>加载中...</p>
      ) : planes.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p style={{ color: 'var(--text-secondary)' }}>
            {view === 'review' ? '当前没有待审核申请。' : view === 'trash' ? '垃圾桶是空的。' : '当前没有已发布纸飞机。'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {planes.map((plane, index) => (
            <div key={plane.id} className="glass-card p-4">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>#{plane.id}</span>
                    {view === 'review' && <span>队列 {index + 1}</span>}
                    <span>{formatDate(plane.createdAt)}</span>
                    {view === 'trash' && (
                      <>
                        <span>{trashReasonLabels[plane.trashReason || ''] || '未知原因'}</span>
                        <span>进入：{formatDate(plane.trashedAt)}</span>
                      </>
                    )}
                  </div>
                  <p className="text-base leading-7 break-words" style={{ color: 'var(--text-primary)' }}>{plane.content}</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    {plane.nickname || '匿名飞行者'} · 点赞 {plane.likeCount} · 举报 {plane.reportCount}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {view === 'review' && (
                    <>
                      <button onClick={() => handleApprove(plane.id)} className="btn-icon" style={{ color: '#111111', borderColor: '#111111' }}>
                        <CheckIcon className="w-3.5 h-3.5" />
                        <span>通过</span>
                      </button>
                      <button onClick={() => handleReject(plane.id)} className="btn-icon" style={{ color: '#111111', borderColor: '#111111' }}>
                        <XIcon className="w-3.5 h-3.5" />
                        <span>拒绝</span>
                      </button>
                    </>
                  )}
                  {view === 'published' && (
                    <button onClick={() => handleDelete(plane.id)} className="btn-icon" style={{ color: '#111111', borderColor: '#111111' }}>
                      <TrashIcon className="w-3.5 h-3.5" />
                      <span>删除</span>
                    </button>
                  )}
                  {view === 'trash' && (
                    <button onClick={() => handleRestore(plane.id)} className="btn-icon" style={{ color: '#111111', borderColor: '#111111' }}>
                      <UndoIcon className="w-3.5 h-3.5" />
                      <span>恢复</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => { const next = Math.max(1, page - 1); setPage(next); loadData(next) }}
          disabled={page === 1}
          className="btn-secondary text-sm"
          style={{ height: 36, opacity: page === 1 ? 0.5 : 1 }}
        >
          上一页
        </button>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>第 {page} / {totalPages} 页</span>
        <button
          onClick={() => { const next = page + 1; setPage(next); loadData(next) }}
          disabled={page >= totalPages}
          className="btn-secondary text-sm"
          style={{ height: 36, opacity: page >= totalPages ? 0.5 : 1 }}
        >
          下一页
        </button>
      </div>
    </div>
  )
}
