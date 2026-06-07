const contactEmail = import.meta.env.VITE_CONTACT_EMAIL as string | undefined

const sections = [
  {
    title: '服务说明',
    items: [
      '纸机驿站 PaperPlane Relay 是一个匿名纸飞机投递与随机接收服务。',
      '你可以发送短文本、接收其他访问者的纸飞机、点赞、收藏或举报内容。',
      '本站不提供账号注册、实名认证、支付或私信功能。',
    ],
  },
  {
    title: '内容规则',
    items: [
      '不得发布违法违规、暴力恐怖、色情低俗、赌博诈骗、侵权盗版、仇恨歧视、骚扰辱骂、诱导自伤或危害公共安全的内容。',
      '不得发布他人或自己的身份证号、手机号、住址、精确定位、账号密码、银行卡号等敏感个人信息。',
      '不得通过脚本、批量请求、绕过审核、伪造请求头等方式干扰服务或消耗资源。',
      '请确保你提交的内容不侵犯他人的著作权、名誉权、隐私权或其他合法权益。',
    ],
  },
  {
    title: '审核与处置',
    items: [
      '本站会通过敏感词、AI 审核、举报和人工管理处理明显违规内容。',
      '违规内容可能被拒绝发布、隐藏、删除或限制展示，严重滥用行为可能被进一步封禁或移交处理。',
      '自动审核可能存在误判，如需申诉，请提供纸飞机内容、时间、截图等必要信息。',
    ],
  },
  {
    title: '用户责任',
    items: [
      '你应对自己提交的内容负责，并自行承担因提交内容产生的相关责任。',
      '请不要把本站作为紧急求助、医疗、法律、金融建议或重要通知渠道。',
      '未成年人应在监护人指导下使用本站。',
    ],
  },
  {
    title: '服务变更',
    items: [
      '本站可能因维护、故障、部署调整、合规要求或安全事件临时中断、调整或下线部分功能。',
      '我们会尽量保持服务可用，但不承诺纸飞机一定被展示、送达或永久保存。',
    ],
  },
  {
    title: '联系与投诉',
    items: [
      contactEmail ? `如需投诉、举报、删除或申诉，请联系：${contactEmail}` : '请在部署环境中配置 VITE_CONTACT_EMAIL，并在上线前补充有效投诉联系方式。',
    ],
  },
]

export default function Terms() {
  return (
    <div className="min-h-[calc(100vh-8.5rem)] max-w-4xl mx-auto px-4 py-10 page-enter">
      <div className="mb-8">
        <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>更新日期：2026-06-07</p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>用户协议</h1>
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
