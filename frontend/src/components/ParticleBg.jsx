import { useEffect, useRef } from 'react'

export default function ParticleBg() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = []
    const colors = ['#10b981', '#34d399', '#059669', '#d4a853', '#6ee7b7']

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div')
      const size = Math.random() * 6 + 2
      const color = colors[Math.floor(Math.random() * colors.length)]
      const duration = Math.random() * 20 + 15
      const delay = Math.random() * 20

      p.className = 'particle'
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${Math.random() * 100}%;
        animation-duration: ${duration}s;
        animation-delay: -${delay}s;
        box-shadow: 0 0 ${size * 2}px ${color};
      `
      container.appendChild(p)
      particles.push(p)
    }

    return () => particles.forEach(p => p.remove())
  }, [])

  return <div ref={containerRef} className="particle-bg" />
}
