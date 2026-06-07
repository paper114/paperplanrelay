import { Link, Routes, Route } from 'react-router-dom'
import Splash from './components/Splash'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Send from './pages/Send'
import Receive from './pages/Receive'
import Favorites from './pages/Favorites'
import About from './pages/About'
import Admin from './pages/Admin'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

export default function App() {
  const icpBeian = import.meta.env.VITE_ICP_BEIAN as string | undefined
  const publicSecurityBeian = import.meta.env.VITE_PUBLIC_SECURITY_BEIAN as string | undefined

  return (
    <Splash>
      <div className="min-h-screen flex flex-col" style={{ color: 'var(--text-primary)' }}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/send" element={<Send />} />
            <Route path="/receive" element={<Receive />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <footer className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          <p>纸机驿站 PaperPlane Relay — 每一架纸飞机都承载着一段心情</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/terms" className="nav-text">用户协议</Link>
            <Link to="/privacy" className="nav-text">隐私政策</Link>
            {icpBeian && <span>{icpBeian}</span>}
            {publicSecurityBeian && <span>{publicSecurityBeian}</span>}
          </div>
        </footer>
      </div>
    </Splash>
  )
}
