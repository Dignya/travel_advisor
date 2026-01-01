'use client'

import { useState, useEffect, useCallback } from 'react'

interface WikipediaData {
  title: string
  displayTitle: string
  extract: string
  extractHtml: string | null
  thumbnail: {
    source: string
    width: number
    height: number
  } | null
  originalImage: {
    source: string
    width: number
    height: number
  } | null
  url: string
  lang: string
  timestamp: string
}

export function useWikipedia() {
  const [wikipediaData, setWikipediaData] = useState<WikipediaData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWikipediaData = async (params: { query?: string; title?: string }) => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()

      if (params.query) {
        searchParams.append('query', params.query)
      } else if (params.title) {
        searchParams.append('title', params.title)
      } else {
        throw new Error('Either query or title must be provided')
      }

      const response = await fetch(`/api/wikipedia?${searchParams.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch Wikipedia data')
      }

      const data: WikipediaData = await response.json()
      setWikipediaData(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchWikipedia = useCallback(async (query: string) => {
    return getWikipediaData({ query })
  }, [])

  const getWikipediaByTitle = useCallback(async (title: string) => {
    return getWikipediaData({ title })
  }, [])

  return {
    wikipediaData,
    loading,
    error,
    searchWikipedia,
    getWikipediaByTitle,
    getWikipediaData
  }
}