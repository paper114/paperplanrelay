import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/send', label: '投递' },
  { to: '/receive', label: '接收' },
  { to: '/favorites', label: '收藏' },
  { to: '/about', label: '关于' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          ✈️ 纸机驿站
        </Link>
        <div className="flex gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-sm transition-colors ${
                location.pathname === link.to
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
