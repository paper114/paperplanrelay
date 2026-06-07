const contactEmail = import.meta.env.VITE_CONTACT_EMAIL as string | undefined

const sections = [
  {
    title: '我们收集的信息',
    items: [
      '你主动投递的纸飞机内容、昵称和颜色选择。',
      '点赞、收藏、举报等互动记录，以及用于区分本机用户的匿名用户 ID。',
      '用于体验控制的本地记录，例如启动页是否展示过、接收页当前查看的纸飞机。',
      '服务端和 Cloudflare 等基础设施可能产生必要的访问日志、安全日志和错误日志。',
    ],
  },
  {
    title: '我们如何使用信息',
    items: [
      '展示、随机分发、收藏和管理纸飞机内容。',
      '进行敏感词、AI 内容审核、举报处理、反滥用和限流。',
      '排查故障、维护服务稳定性，并在必要时处理安全事件。',
      '根据法律法规、主管部门要求或用户投诉进行必要处理。',
    ],
  },
  {
    title: '本地存储与 Cookie',
    items: [
      '匿名用户 ID 保存在浏览器本地，用来避免你收到自己投递的纸飞机，并记录点赞、收藏、举报状态。',
      '启动页展示状态保存在浏览器 Cookie 中，不用于跨站追踪。',
      '管理员密钥仅保存在当前浏览器会话中，关闭会话后需要重新输入。',
    ],
  },
  {
    title: '内容公开与删除',
    items: [
      '纸飞机内容会以随机接收的方式向其他访问者展示，请不要提交真实姓名、电话、住址、身份证号、账号密码等敏感个人信息。',
      '被多次举报或被管理员判定违规的内容可能被隐藏、删除或恢复。',
      '由于项目没有账号体系，我们可能需要你提供可识别目标内容的信息，才能协助处理删除或申诉请求。',
    ],
  },
  {
    title: 'AI 审核说明',
    items: [
      '当前审核在服务端使用本地模型和敏感词规则完成，不会为了审核把正文提交给第三方 AI API。',
      '自动审核可能出现误判，管理员会结合举报和人工判断处理明显错误的结果。',
    ],
  },
  {
    title: '未成年人',
    items: [
      '未成年人应在监护人指导下使用本站。',
      '请不要提交未成年人身份信息、联系方式、学校班级、精确位置等可识别信息。',
    ],
  },
  {
    title: '联系我们',
    items: [
      contactEmail ? `如需删除内容、申诉或咨询隐私问题，请联系：${contactEmail}` : '请在部署环境中配置 VITE_CONTACT_EMAIL，并在上线前补充有效联系方式。',
    ],
  },
]

export default function Privacy() {
  return (
    <div className="min-h-[calc(100vh-8.5rem)] max-w-4xl mx-auto px-4 py-10 page-enter">
      <div className="mb-8">
        <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>更新日期：2026-06-07</p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>隐私政策</h1>
      </div>

      <div className="space-y-5">
        {sections.map((section) => (
          <section key={section.title} className="glass-card p-5">
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{section.title}</h2>
            <ul className="space-y-2 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
              {section.items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
