import type { CSSProperties } from 'react'

function InfoIcon({ className = 'w-5 h-5', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function CompassIcon({ className = 'w-5 h-5', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

function ShieldIcon({ className = 'w-5 h-5', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export default function About() {
  return (
    <div className="min-h-[calc(100vh-8.5rem)] max-w-3xl mx-auto px-4 py-12 page-enter">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
        关于纸机驿站
      </h1>

      <div className="space-y-6">
        <section className="glass-card p-6 sm:p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <InfoIcon className="w-5 h-5" style={{ color: '#111111' }} />
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>什么是纸机驿站？</h2>
            </div>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              纸机驿站是一个匿名纸飞机传递平台。你可以在这里写下一句话、一个故事、或者任何想说的话，
              折成一架纸飞机投出去，也可以随机接收一架来自陌生人的纸飞机。
              每一架纸飞机都承载着一段独特的心情，飞向未知的远方。
            </p>
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <CompassIcon className="w-5 h-5" style={{ color: '#111111' }} />
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>玩法说明</h2>
            </div>
            <div className="space-y-4">
              {[
                { step: '1', title: '投递纸飞机', desc: '写下你想说的话，选择一种颜色，点击投递。你的纸飞机就会飞向某个陌生人。', color: '#111111' },
                { step: '2', title: '接收纸飞机', desc: '点击接收按钮，随机获得一架来自陌生人的纸飞机。阅读ta写下的话。', color: '#111111' },
                { step: '3', title: '互动', desc: '点赞表示你喜欢这架纸飞机，收藏可以保存到你的收藏夹，遇到不良内容可以举报。', color: '#111111' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: item.color }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-card p-6 sm:p-8">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <ShieldIcon className="w-5 h-5" style={{ color: '#111111' }} />
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>核心规则</h2>
            </div>
            <ul className="space-y-2">
              {[
                '匿名传递，不需要注册账号，系统会自动分配一个匿名ID',
                '每次投递最多500字，请珍惜每一架纸飞机',
                '随机接收，你不知道会收到谁的纸飞机',
                '友善互动，禁止发布违法违规内容',
                '被举报过多的纸飞机将被管理员删除',
              ].map((rule) => (
                <li key={rule} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="mt-1 shrink-0" style={{ color: '#111111' }}>&bull;</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
