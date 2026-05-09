import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const BASE =
    import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'

export function useStats() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        axios.get(`${BASE}/stats`)
            .then(r => setData(r.data))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    return { data, loading, error }
}

export function useArticles(filters) {
    const [data, setData] = useState({ articles: [], total: 0, pages: 1 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetch = useCallback(() => {
        setLoading(true)
        const params = {}
        if (filters.page) params.page = filters.page
        if (filters.limit) params.limit = filters.limit
        if (filters.search) params.search = filters.search
        if (filters.domain) params.domain = filters.domain
        if (filters.year) params.year = filters.year
        if (filters.source) params.source = filters.source

        axios.get(`${BASE}/articles`, { params })
            .then(r => setData(r.data))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [filters.page, filters.limit, filters.search, filters.domain, filters.year, filters.source])

    useEffect(() => { fetch() }, [fetch])

    return { data, loading, error, refetch: fetch }
}

export function useDomains() {
    const [domains, setDomains] = useState([])
    useEffect(() => {
        axios.get(`${BASE}/domains`).then(r => setDomains(r.data.domains)).catch(() => {})
    }, [])
    return domains
}

export function useYears() {
    const [years, setYears] = useState([])
    useEffect(() => {
        axios.get(`${BASE}/years`).then(r => setYears(r.data.years)).catch(() => {})
    }, [])
    return years
}