import { NextRequest, NextResponse } from 'next/server'

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Mock weather data for fallback
const getMockWeatherData = (lat: number, lon: number, city?: string) => {
  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain']
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
  
  // Base temperature on latitude (colder = higher latitude)
  const baseTemp = 25 - Math.abs(lat) * 0.5
  const temperature = Math.round(baseTemp + (Math.random() - 0.5) * 10)
  
  return {
    location: {
      name: city || 'Unknown',
      country: 'Unknown',
      coordinates: {
        lat: lat,
        lon: lon
      }
    },
    current: {
      temperature: temperature,
      feels_like: temperature + Math.round((Math.random() - 0.5) * 4),
      humidity: Math.floor(Math.random() * 40) + 40,
      pressure: Math.floor(Math.random() * 20) + 1010,
      visibility: Math.floor(Math.random() * 5) + 8,
      uv_index: Math.floor(Math.random() * 10) + 1
    },
    conditions: {
      main: randomCondition,
      description: randomCondition.toLowerCase(),
      icon: '01d',
      id: 800
    },
    wind: {
      speed: Math.round((Math.random() * 15 + 5) * 10) / 10,
      direction: Math.floor(Math.random() * 360),
      gust: Math.round((Math.random() * 20 + 5) * 10) / 10
    },
    clouds: {
      coverage: Math.floor(Math.random() * 100)
    },
    sun: {
      sunrise: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sunset: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
    },
    timestamp: new Date().toISOString(),
    mock: true // Flag to indicate this is mock data
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const city = searchParams.get('city')

    // If no API key, return mock data
    if (!OPENWEATHER_API_KEY) {
      console.log('OpenWeather API key not configured, using mock data')
      const mockData = getMockWeatherData(
        lat ? parseFloat(lat) : 0,
        lon ? parseFloat(lon) : 0,
        city || undefined
      )
      return NextResponse.json(mockData)
    }

    let url: string

    if (lat && lon) {
      // Get weather by coordinates
      url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    } else if (city) {
      // Get weather by city name
      url = `${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    } else {
      return NextResponse.json(
        { error: 'Missing required parameters: lat/lon or city' },
        { status: 400 }
      )
    }

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Transform the response to a cleaner format
    const weatherData = {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      },
      current: {
        temperature: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        uv_index: null // UV index requires separate API call
      },
      conditions: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        id: data.weather[0].id
      },
      wind: {
        speed: data.wind.speed,
        direction: data.wind.deg,
        gust: data.wind.gust
      },
      clouds: {
        coverage: data.clouds.all
      },
      sun: {
        sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
        sunset: new Date(data.sys.sunset * 1000).toISOString()
      },
      timestamp: new Date().toISOString(),
      mock: false // Flag to indicate this is real data
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Weather API error:', error)
    // Fallback to mock data if API fails
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const city = searchParams.get('city')
    
    console.log('Weather API failed, using mock data as fallback')
    const mockData = getMockWeatherData(
      lat ? parseFloat(lat) : 0,
      lon ? parseFloat(lon) : 0,
      city || undefined
    )
    return NextResponse.json(mockData)
  }
}