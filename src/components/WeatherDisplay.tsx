'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  Cloud,
  MapPin
} from 'lucide-react'

interface WeatherDisplayProps {
  latitude?: number
  longitude?: number
  city?: string
  className?: string
}

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
  mock?: boolean
}

export function WeatherDisplay({ latitude, longitude, city, className = '' }: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!latitude || !longitude) return

      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        searchParams.append('lat', latitude.toString())
        searchParams.append('lon', longitude.toString())
        if (city) {
          searchParams.append('city', city)
        }

        const response = await fetch(`/api/weather?${searchParams.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }

        const data: WeatherData = await response.json()
        setWeatherData(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [latitude, longitude, city])

  const getWeatherIcon = (iconCode: string) => {
    // Map OpenWeather icon codes to emoji or custom icons
    const iconMap: Record<string, string> = {
      '01d': '☀️', // Clear sky (day)
      '01n': '🌙', // Clear sky (night)
      '02d': '⛅', // Few clouds (day)
      '02n': '☁️', // Few clouds (night)
      '03d': '☁️', // Scattered clouds
      '03n': '☁️', // Scattered clouds
      '04d': '☁️', // Broken clouds
      '04n': '☁️', // Broken clouds
      '09d': '🌧️', // Shower rain
      '09n': '🌧️', // Shower rain
      '10d': '🌦️', // Rain (day)
      '10n': '🌧️', // Rain (night)
      '11d': '⛈️', // Thunderstorm
      '11n': '⛈️', // Thunderstorm
      '13d': '❄️', // Snow
      '13n': '❄️', // Snow
      '50d': '🌫️', // Mist
      '50n': '🌫️', // Mist
    }
    return iconMap[iconCode] || '🌤️'
  }

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return directions[Math.round(degrees / 22.5) % 16]
  }

  // Compact view for results page
  if (loading) {
    return (
      <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
        <div className="h-4 w-4 bg-muted-foreground/20 rounded-full animate-pulse" />
        <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-16" />
        <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-12" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-xs text-muted-foreground p-2">
        Weather unavailable
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="text-xs text-muted-foreground p-2">
        No weather data
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">
            {getWeatherIcon(weatherData.conditions.icon)}
          </span>
          <div>
            <div className="text-sm font-semibold">
              {weatherData.current.temperature}°C
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {weatherData.conditions.description}
            </div>
          </div>
        </div>
        <div className="text-right text-xs">
          <div className="text-muted-foreground">Feels like</div>
          <div className="font-semibold">
            {weatherData.current.feels_like}°C
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <Droplets className="h-3 w-3 text-blue-500" />
          <span className="text-muted-foreground">Humidity:</span>
          <span className="font-medium">{weatherData.current.humidity}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <Wind className="h-3 w-3 text-green-500" />
          <span className="text-muted-foreground">Wind:</span>
          <span className="font-medium">
            {weatherData.wind.speed} m/s
          </span>
        </div>
      </div>
      
      {weatherData.mock && (
        <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
          Mock data
        </div>
      )}
    </div>
  )
}