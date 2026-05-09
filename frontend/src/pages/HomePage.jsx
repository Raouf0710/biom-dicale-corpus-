import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Dna, Database, BookOpen, TrendingUp, ArrowRight, Microscope, Brain, FlaskConical } from 'lucide-react'
import { useStats } from '../hooks/useApi'

const features = [
  {
    icon: Database,
    title: 'Multi-Sources',
    desc: 'Articles collectés depuis PubMed, PubMed Central et Semantic Scholar automatiquement.',
    color: '#10b981'
  },
  {
    icon: Brain,
    title: 'Intelligence Artificielle',
    desc: 'Classification automatique par domaine biomédical via analyse sémantique.',
    color: '#34d399'
  },
  {
    icon: TrendingUp,
    title: 'Visualisation',
    desc: 'Tableaux de bord interactifs avec statistiques par année, domaine et journal.',
    color: '#d4a853'
  },
  {
    icon: FlaskConical,
    title: 'Données Structurées',
    desc: 'Titre, auteurs, résumé, DOI, journal et date de publication pour chaque article.',
    color: '#6ee7b7'
  }
]

export default function HomePage() {
  const navigate = useNavigate()
  const { data: stats } = useStats()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 min-h-screen"
    >
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          {/* <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              color: '#34d399'
            }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Faculté d'Informatique · USTHB · Mars 2026
          </div> */}
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-center max-w-4xl mb-6"
        >
          <h1 className="font-display text-6xl md:text-7xl font-bold leading-tight mb-4"
            style={{ color: 'var(--text-primary)' }}>
            Corpus{' '}
            <span className="relative inline-block">
              <span className="glow-text" style={{ color: 'var(--green-bright)' }}>
                Biomédical
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
                <path d="M0 2 Q25 0 50 2 Q75 4 100 2" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.6"/>
              </svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-display italic"
            style={{ color: 'var(--gold-light)', opacity: 0.85 }}>
            Exploration & Visualisation
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center max-w-2xl text-lg leading-relaxed mb-10"
          style={{ color: 'rgba(167,243,208,0.8)' }}
        >
          Une plateforme de collecte et d'analyse d'articles scientifiques biomédicaux
          issus de <strong style={{ color: '#34d399' }}>PubMed</strong>,{' '}
          <strong style={{ color: '#34d399' }}>PubMed Central</strong> et{' '}
          <strong style={{ color: '#34d399' }}>Semantic Scholar</strong>,
          stockés dans MongoDB et visualisés via des tableaux de bord interactifs.
        </motion.p>

        {/* Quick stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap gap-6 justify-center mb-12"
          >
            {[
              { label: 'Articles', value: stats.total?.toLocaleString() || '0' },
              { label: 'Domaines', value: stats.by_domain?.length || '0' },
              { label: 'Sources', value: stats.by_source?.length || '3' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center px-6 py-3 rounded-xl"
                style={{ background: 'rgba(6,79,70,0.4)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div className="text-2xl font-bold font-display" style={{ color: '#34d399' }}>{value}</div>
                <div className="text-xs font-medium mt-1" style={{ color: '#86efac' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-16"
        >
          <button
            onClick={() => navigate('/corpus')}
            className="group relative px-10 py-5 rounded-2xl text-lg font-semibold overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              boxShadow: '0 0 30px rgba(16,185,129,0.3)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 50px rgba(16,185,129,0.5), 0 0 80px rgba(16,185,129,0.2)'
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(16,185,129,0.3)'
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
            }}
          >
            <span className="flex items-center gap-3">
              <Microscope size={22} />
              Visualiser le Corpus
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </span>
            {/* Shimmer overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                transform: 'skewX(-20deg)',
              }} />
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2"
          style={{ color: 'rgba(134,239,172,0.4)' }}
        >
          <span className="text-xs tracking-widest uppercase">Défiler</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(16,185,129,0.4), transparent)' }} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Fonctionnalités
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ background: 'var(--green-light)' }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card-hover rounded-2xl p-7 flex gap-5"
              style={{
                background: 'rgba(6,79,70,0.25)',
                border: '1px solid rgba(16,185,129,0.12)',
              }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18` }}>
                <Icon size={24} style={{ color }} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(167,243,208,0.7)' }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sources Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Sources de Données
            </h2>
            <p className="text-base mb-12" style={{ color: 'rgba(167,243,208,0.7)' }}>
              Les articles sont collectés automatiquement via les APIs officielles
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {[
              { name: 'PubMed', desc: 'National Library of Medicine — base de référence mondiale', badge: 'NCBI', color: '#10b981' },
              { name: 'Semantic Scholar', desc: 'Allen Institute for AI — papers avec citations et sémantique', badge: 'AI2', color: '#d4a853' },
            ].map(({ name, desc, badge, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="card-hover flex-1 rounded-2xl p-6 text-left"
                style={{
                  background: 'rgba(6,79,70,0.3)',
                  border: `1px solid ${color}30`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen size={20} style={{ color }} />
                  <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{name}</span>
                  <span className="badge text-xs ml-auto" style={{ background: `${color}20`, color }}>
                    {badge}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'rgba(167,243,208,0.65)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 px-6"
        style={{ borderTop: '1px solid rgba(16,185,129,0.1)', color: 'rgba(134,239,172,0.4)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Dna size={16} />
          <span className="font-display font-semibold">BioCorpus</span>
        </div>
        <p className="text-xs">Projet 6 · Déploiement sur le cloud · Faculté d'Informatique USTHB</p>
      </footer>
    </motion.div>
  )
}
