import { Routes, Route } from 'react-router-dom'
import Splash from './components/Splash'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Send from './pages/Send'
import Receive from './pages/Receive'
import Favorites from './pages/Favorites'
import About from './pages/About'
import Admin from './pages/Admin'

export default function App() {
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
          </Routes>
        </main>
        <footer className="py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          <p>纸机驿站 PaperPlane Relay — 每一架纸飞机都承载着一段心情</p>
        </footer>
      </div>
    </Splash>
  )
}
