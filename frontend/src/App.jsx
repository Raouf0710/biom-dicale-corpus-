import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage.jsx'
import CorpusPage from './pages/CorpusPage.jsx'
import ParticleBg from './components/ParticleBg.jsx'
import Navbar from './components/Navbar.jsx'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--green-deep)' }}>
      <ParticleBg />
      <div className="grid-bg fixed inset-0 z-0 pointer-events-none" />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/corpus" element={<CorpusPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
