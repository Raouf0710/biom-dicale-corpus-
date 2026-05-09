import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts'
import {
  Search, Filter, ChevronLeft, ChevronRight, ExternalLink,
  Database, FileText, Calendar, Tag, BookOpen, Award, X, TrendingUp
} from 'lucide-react'
import { useStats, useArticles, useDomains, useYears } from '../hooks/useApi'
import StatCard from '../components/StatCard'

const COLORS = ['#10b981','#34d399','#059669','#d4a853','#6ee7b7','#f0c97a','#047857','#065f46','#a7f3d0','#fbbf24']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-4 py-3 text-sm shadow-lg"
      style={{ background: '#064e3b', border: '1px solid rgba(16,185,129,0.3)', color: '#ecfdf5' }}>
      <p className="font-semibold mb-1" style={{ color: '#34d399' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value?.toLocaleString()}</strong></p>
      ))}
    </div>
  )
}

export default function CorpusPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 15, search: '', domain: '', year: '', source: '' })
  const [searchInput, setSearchInput] = useState('')
  const [expandedRow, setExpandedRow] = useState(null)

  const { data: stats, loading: statsLoading } = useStats()
  const { data: articlesData, loading: articlesLoading } = useArticles(filters)
  const domains = useDomains()
  const years = useYears()

  const applySearch = () => setFilters(f => ({ ...f, search: searchInput, page: 1 }))
  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }))
  const clearFilters = () => { setFilters({ page: 1, limit: 15, search: '', domain: '', year: '', source: '' }); setSearchInput('') }

  const hasFilters = filters.search || filters.domain || filters.year || filters.source

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Tableau de Bord <span style={{ color: 'var(--green-bright)' }}>Biomédical</span>
        </h1>
        <p className="text-base" style={{ color: 'rgba(167,243,208,0.7)' }}>
          Exploration et visualisation du corpus — statistiques en temps réel
        </p>
      </motion.div>

      {/* ── STAT CARDS ── */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl h-32 shimmer" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={FileText} label="Articles Total" value={stats.total} color="#10b981" delay={0} />
          <StatCard icon={Tag} label="Domaines" value={stats.by_domain?.length || 0} color="#34d399" delay={0.1} />
          <StatCard icon={Database} label="Avec DOI" value={stats.with_doi || 0} color="#d4a853" delay={0.2} />
          <StatCard icon={BookOpen} label="Journaux" value={stats.top_journals?.length || 0} color="#6ee7b7" delay={0.3} />
        </div>
      ) : null}

      {/* ── CHARTS ROW 1 ── */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Articles par Année */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-6" style={{ background: 'rgba(6,79,70,0.3)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} style={{ color: '#10b981' }} />
              <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Articles par Année</h2>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats.by_year?.slice(-15)}>
                <defs>
                  <linearGradient id="colorYear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.08)" />
                <XAxis dataKey="year" tick={{ fill: '#86efac', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#86efac', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" name="Articles" stroke="#10b981" strokeWidth={2}
                  fill="url(#colorYear)" dot={{ fill: '#10b981', r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Par Domaine - Pie */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl p-6" style={{ background: 'rgba(6,79,70,0.3)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="flex items-center gap-2 mb-5">
              <Tag size={18} style={{ color: '#34d399' }} />
              <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Répartition par Domaine</h2>
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie data={stats.by_domain?.slice(0, 8)} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                    dataKey="count" paddingAngle={2}>
                    {stats.by_domain?.slice(0, 8).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} formatter={(v, n, p) => [v, p.payload.domain]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5 overflow-hidden">
                {stats.by_domain?.slice(0, 7).map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="truncate" style={{ color: 'rgba(167,243,208,0.8)' }}>{d.domain}</span>
                    <span className="ml-auto font-mono text-xs flex-shrink-0" style={{ color: '#34d399' }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── CHARTS ROW 2 ── */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* Top Journaux */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl p-6" style={{ background: 'rgba(6,79,70,0.3)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="flex items-center gap-2 mb-5">
              <Award size={18} style={{ color: '#d4a853' }} />
              <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Top Journaux</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.top_journals?.slice(0, 8)} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.08)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#86efac', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="journal" tick={{ fill: '#86efac', fontSize: 9 }} tickLine={false}
                  axisLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Articles" radius={[0, 4, 4, 0]}>
                  {stats.top_journals?.slice(0, 8).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Sources */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="rounded-2xl p-6" style={{ background: 'rgba(6,79,70,0.3)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="flex items-center gap-2 mb-5">
              <Database size={18} style={{ color: '#6ee7b7' }} />
              <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Par Source</h2>
            </div>
            <div className="space-y-4 mt-6">
              {stats.by_source?.map((s, i) => {
                const pct = stats.total ? Math.round((s.count / stats.total) * 100) : 0
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span style={{ color: 'var(--text-primary)' }}>{s.source}</span>
                      <span style={{ color: COLORS[i] }}>{s.count.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(6,79,70,0.5)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[(i + 1) % COLORS.length]})` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* DOI stats */}
            <div className="mt-8 pt-5" style={{ borderTop: '1px solid rgba(16,185,129,0.1)' }}>
              <p className="text-xs font-medium mb-3" style={{ color: '#86efac' }}>Couverture DOI</p>
              <div className="flex gap-4">
                <div className="flex-1 text-center py-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <div className="text-xl font-bold font-display" style={{ color: '#10b981' }}>{stats.with_doi?.toLocaleString()}</div>
                  <div className="text-xs mt-1" style={{ color: '#86efac' }}>Avec DOI</div>
                </div>
                <div className="flex-1 text-center py-3 rounded-xl" style={{ background: 'rgba(212,168,83,0.1)' }}>
                  <div className="text-xl font-bold font-display" style={{ color: '#d4a853' }}>{stats.without_doi?.toLocaleString()}</div>
                  <div className="text-xs mt-1" style={{ color: '#86efac' }}>Sans DOI</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── ARTICLE TABLE ── */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(16,185,129,0.15)' }}>

        {/* Table Header */}
        <div className="p-6" style={{ background: 'rgba(6,79,70,0.4)', borderBottom: '1px solid rgba(16,185,129,0.12)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={18} style={{ color: '#10b981' }} />
              <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                Articles du Corpus
              </h2>
              {articlesData.total > 0 && (
                <span className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                  {articlesData.total.toLocaleString()} résultats
                </span>
              )}
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'rgba(212,168,83,0.15)', color: '#d4a853', border: '1px solid rgba(212,168,83,0.3)' }}>
                <X size={12} /> Effacer les filtres
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="flex-1 min-w-48 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#86efac' }} />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applySearch()}
                placeholder="Rechercher titre, auteur, résumé…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'rgba(6,79,70,0.5)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(16,185,129,0.2)'}
              />
            </div>
            <button onClick={applySearch}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
              style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
              Rechercher
            </button>

            {/* Domain filter */}
            <select value={filters.domain} onChange={e => setFilter('domain', e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
              style={{ background: 'rgba(6,79,70,0.5)', border: '1px solid rgba(16,185,129,0.2)', color: filters.domain ? 'var(--text-primary)' : '#86efac', minWidth: 160 }}>
              <option value="">Tous les domaines</option>
              {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Year filter */}
            <select value={filters.year} onChange={e => setFilter('year', e.target.value ? Number(e.target.value) : '')}
              className="px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
              style={{ background: 'rgba(6,79,70,0.5)', border: '1px solid rgba(16,185,129,0.2)', color: filters.year ? 'var(--text-primary)' : '#86efac', minWidth: 110 }}>
              <option value="">Toutes années</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {/* Source filter */}
            <select value={filters.source} onChange={e => setFilter('source', e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
              style={{ background: 'rgba(6,79,70,0.5)', border: '1px solid rgba(16,185,129,0.2)', color: filters.source ? 'var(--text-primary)' : '#86efac', minWidth: 150 }}>
              <option value="">Toutes sources</option>
              <option value="PubMed">PubMed</option>
              <option value="Semantic Scholar">Semantic Scholar</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div style={{ background: 'rgba(2,44,34,0.6)' }}>
          {articlesLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl shimmer" />
              ))}
            </div>
          ) : articlesData.articles?.length === 0 ? (
            <div className="p-16 text-center" style={{ color: '#86efac' }}>
              <FileText size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium opacity-50">Aucun article trouvé</p>
              <p className="text-sm mt-2 opacity-40">Modifiez vos filtres ou lancez la collecte de données</p>
            </div>
          ) : (
            <>
              {/* Column headers */}
              <div className="grid grid-cols-12 gap-3 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#86efac', borderBottom: '1px solid rgba(16,185,129,0.08)' }}>
                <div className="col-span-5">Titre</div>
                <div className="col-span-2">Auteurs</div>
                <div className="col-span-2">Journal</div>
                <div className="col-span-1">Année</div>
                <div className="col-span-1">Source</div>
                <div className="col-span-1">DOI</div>
              </div>

              <AnimatePresence>
                {articlesData.articles.map((article, i) => (
                  <motion.div key={article.id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}>

                    <div
                      className="grid grid-cols-12 gap-3 px-6 py-4 cursor-pointer table-row-hover"
                      onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                    >
                      <div className="col-span-5">
                        <p className="text-sm font-medium line-clamp-2 leading-snug" style={{ color: 'var(--text-primary)' }}>
                          {article.title}
                        </p>
                        {article.domain && (
                          <span className="badge mt-1 text-xs" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                            {article.domain}
                          </span>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center">
                        <p className="text-xs line-clamp-2" style={{ color: 'rgba(167,243,208,0.7)' }}>
                          {article.authors || '—'}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <p className="text-xs line-clamp-2" style={{ color: 'rgba(167,243,208,0.65)' }}>
                          {article.journal || '—'}
                        </p>
                      </div>
                      <div className="col-span-1 flex items-center">
                        {article.year ? (
                          <span className="badge" style={{ background: 'rgba(212,168,83,0.12)', color: '#d4a853' }}>
                            {article.year}
                          </span>
                        ) : <span style={{ color: 'rgba(167,243,208,0.3)' }}>—</span>}
                      </div>
                      <div className="col-span-1 flex items-center">
                        <span className="badge text-xs" style={{
                          background: article.source === 'PubMed' ? 'rgba(16,185,129,0.12)' : 'rgba(110,231,183,0.1)',
                          color: article.source === 'PubMed' ? '#10b981' : '#6ee7b7'
                        }}>
                          {article.source === 'Semantic Scholar' ? 'S2' : 'PM'}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center">
                        {article.doi ? (
                          <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="hover:opacity-70 transition-opacity"
                            style={{ color: '#34d399' }}>
                            <ExternalLink size={14} />
                          </a>
                        ) : <span style={{ color: 'rgba(167,243,208,0.2)', fontSize: 12 }}>—</span>}
                      </div>
                    </div>

                    {/* Expanded row */}
                    <AnimatePresence>
                      {expandedRow === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-5 mx-4 mb-3 rounded-xl"
                            style={{ background: 'rgba(6,79,70,0.35)', border: '1px solid rgba(16,185,129,0.12)' }}>
                            <p className="text-sm font-semibold mb-2" style={{ color: '#34d399' }}>Résumé</p>
                            <p className="text-sm leading-relaxed" style={{ color: 'rgba(167,243,208,0.8)' }}>
                              {article.abstract || 'Aucun résumé disponible.'}
                            </p>
                            {article.url && (
                              <a href={article.url} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                                <ExternalLink size={12} /> Voir l'article complet
                              </a>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Pagination */}
        {articlesData.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4"
            style={{ background: 'rgba(6,79,70,0.3)', borderTop: '1px solid rgba(16,185,129,0.1)' }}>
            <p className="text-sm" style={{ color: '#86efac' }}>
              Page {filters.page} / {articlesData.pages} · {articlesData.total.toLocaleString()} articles
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                className="p-2 rounded-lg transition-all disabled:opacity-30"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                <ChevronLeft size={16} />
              </button>
              {[...Array(Math.min(5, articlesData.pages))].map((_, i) => {
                const p = Math.max(1, Math.min(filters.page - 2, articlesData.pages - 4)) + i
                return (
                  <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: p === filters.page ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.08)',
                      color: p === filters.page ? '#34d399' : '#86efac',
                      border: p === filters.page ? '1px solid rgba(16,185,129,0.4)' : '1px solid transparent'
                    }}>
                    {p}
                  </button>
                )
              })}
              <button
                disabled={filters.page >= articlesData.pages}
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                className="p-2 rounded-lg transition-all disabled:opacity-30"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
