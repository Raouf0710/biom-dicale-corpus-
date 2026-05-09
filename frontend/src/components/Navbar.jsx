import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dna, BarChart3 } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(2, 44, 34, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(16,185,129,0.15)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
              <Dna size={18} className="text-white" />
            </div>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ boxShadow: '0 0 20px rgba(16,185,129,0.6)' }} />
          </div>
          <span className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            Bio<span style={{ color: 'var(--green-bright)' }}>Corpus</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {[
            { path: '/', label: 'Accueil' },
            { path: '/corpus', label: 'Explorer', icon: BarChart3 }
          ].map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <div className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${pathname === path
                  ? 'text-white'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
                }
              `}
                style={pathname === path ? {
                  background: 'rgba(16,185,129,0.2)',
                  border: '1px solid rgba(16,185,129,0.3)'
                } : {}}>
                {Icon && <Icon size={15} />}
                {label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
