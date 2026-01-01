'use client'

import { useState, useEffect, useCallback } from 'react'

interface WeatherData {
  location: {
    name: string
    country: string
    coordinates: {
      lat: number
      lon: number
    }
  }
  current: {
    temperature: number
    feels_like: number
    humidity: number
    pressure: number
    visibility: number
    uv_index: number | null
  }
  conditions: {
    main: string
    description: string
    icon: string
    id: number
  }
  wind: {
    speed: number
    direction: number
    gust: number
  }
  clouds: {
    coverage: number
  }
  sun: {
    sunrise: string
    sunset: string
  }
  timestamp: string
}

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWeather = useCallback(async (params: { lat?: number; lon?: number; city?: string }) => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      
      if (params.lat && params.lon) {
        searchParams.append('lat', params.lat.toString())
        searchParams.append('lon', params.lon.toString())
      } else if (params.city) {
        searchParams.append('city', params.city)
      } else {
        throw new Error('Either lat/lon or city must be provided')
      }

      const response = await fetch(`/api/weather?${searchParams.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch weather data')
      }

      const data: WeatherData = await response.json()
      setWeatherData(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getWeatherByCoordinates = useCallback(async (lat: number, lon: number) => {
    return getWeather({ lat, lon })
  }, [getWeather])

  const getWeatherByCity = useCallback(async (city: string) => {
    return getWeather({ city })
  }, [getWeather])

  return {
    weatherData,
    loading,
    error,
    getWeatherByCoordinates,
    getWeatherByCity,
    getWeather
  }
}