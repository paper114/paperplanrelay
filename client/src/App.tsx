import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Send from './pages/Send'
import Receive from './pages/Receive'
import Favorites from './pages/Favorites'
import About from './pages/About'
import Admin from './pages/Admin'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
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
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        <p>纸机驿站 ✈️ — 每一架纸飞机都承载着一段心情</p>
      </footer>
    </div>
  )
}
