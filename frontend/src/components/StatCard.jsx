import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!target) return
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

export default function StatCard({ icon: Icon, label, value, color = '#10b981', delay = 0 }) {
  const animValue = useCountUp(typeof value === 'number' ? value : 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="card-hover rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: 'rgba(6,79,70,0.3)',
        border: '1px solid rgba(16,185,129,0.15)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Gradient blob */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-xl"
        style={{ background: color }} />

      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl" style={{ background: `${color}20` }}>
          <Icon size={22} style={{ color }} />
        </div>
      </div>

      <div className="text-3xl font-display font-bold mb-1" style={{ color }}>
        {typeof value === 'number' ? animValue.toLocaleString() : value}
      </div>
      <div className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </motion.div>
  )
}
