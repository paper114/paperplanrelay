export default function About() {
  return (
    <div className="min-h-[calc(100vh-8rem)] max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">关于纸飞机驿站 ✈️</h1>

      <div className="space-y-8">
        <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-4">🌟 什么是纸机驿站？</h2>
          <p className="text-gray-300 leading-relaxed">
            纸机驿站是一个匿名纸飞机传递平台。你可以在这里写下一句话、一个故事、或者任何想说的话，
            折成一架纸飞机投出去，也可以随机接收一架来自陌生人的纸飞机。
            每一架纸飞机都承载着一段独特的心情，飞向未知的远方。
          </p>
        </section>

        <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">🎮 玩法说明</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 font-bold shrink-0">1</div>
              <div>
                <h3 className="text-white font-medium">投递纸飞机</h3>
                <p className="text-gray-400 text-sm">写下你想说的话，选择一种颜色，点击投递。你的纸飞机就会飞向某个陌生人。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center text-purple-400 font-bold shrink-0">2</div>
              <div>
                <h3 className="text-white font-medium">接收纸飞机</h3>
                <p className="text-gray-400 text-sm">点击接收按钮，随机获得一架来自陌生人的纸飞机。阅读ta写下的话。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-pink-600/20 rounded-lg flex items-center justify-center text-pink-400 font-bold shrink-0">3</div>
              <div>
                <h3 className="text-white font-medium">互动</h3>
                <p className="text-gray-400 text-sm">点赞表示你喜欢这架纸飞机，收藏可以保存到你的收藏夹，遇到不良内容可以举报。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">📜 核心规则</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              匿名传递，不需要注册账号，系统会自动分配一个匿名ID
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              每次投递最多500字，请珍惜每一架纸飞机
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              随机接收，你不知道会收到谁的纸飞机
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              友善互动，禁止发布违法违规内容
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              被举报过多的纸飞机将被管理员删除
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
