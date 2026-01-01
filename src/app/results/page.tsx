'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Thermometer, DollarSign, Calendar, Heart, Share2, Cloud, BookOpen, Plane, X } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { WeatherDisplay } from '@/components/WeatherDisplay'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CurrencyConverter } from '@/components/CurrencyConverter'
import { TravelSuggestions } from '@/components/TravelSuggestions'
import { useCurrency, getCurrencyByCountry } from '@/hooks/useCurrency'
import { useToast, useApiErrorHandler } from '@/components/ui/toast-system'
import { 
  PageLoading, 
  ErrorState, 
  EmptyState, 
  DestinationCardSkeleton, 
  LoadingOverlay,
  ButtonLoading
} from '@/components/ui/loading-states'

interface Destination {
  id: string
  name: string
  country: string
  city: string
  description: string
  latitude: number
  longitude: number
  image: string
  climate: string
  activities: string[]
  budgetLevel: string
  bestSeason: string
}

interface WeatherData {
  temperature: number
  description: string
  humidity: number
  windSpeed: number
}

const Results = () => {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weatherData, setWeatherData] = useState<{ [key: string]: WeatherData }>({})
  const [wikipediaData, setWikipediaData] = useState<{ [key: string]: string }>({})
  const [userBudget, setUserBudget] = useState<number>(1000)
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [showTravelSuggestions, setShowTravelSuggestions] = useState<string | null>(null)
  const [savingTrip, setSavingTrip] = useState<string | null>(null)
  const [offersLoading, setOffersLoading] = useState(false)
  const [offers, setOffers] = useState<any | null>(null)
  const [offersDestination, setOffersDestination] = useState<Destination | null>(null)
  const [flightMaxPrice, setFlightMaxPrice] = useState<number | null>(null)
  const [hotelMaxPrice, setHotelMaxPrice] = useState<number | null>(null)
  const [hotelMinRating, setHotelMinRating] = useState<number>(0)
  const { convertCurrency } = useCurrency()
  const { showSuccess, showError } = useToast()
  const { handleApiError } = useApiErrorHandler()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const preferences = localStorage.getItem('travelPreferences')
        if (!preferences) {
          window.location.href = '/explore'
          return
        }

        const { budget, climate, activities, duration } = JSON.parse(preferences)
        
        // Set user budget based on preferences
        const budgetMap = {
          'low': 500,
          'medium': 1500,
          'high': 3000
        }
        setUserBudget(budgetMap[budget as keyof typeof budgetMap] || 1000)
        
        const response = await fetch('/api/destinations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ budget, climate, activities }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch destinations')
        }

        const data = await response.json()
        if (data.success) {
          setDestinations(data.destinations)
          
          // Fetch weather data for each destination
          await Promise.all(data.destinations.map(async (destination: Destination) => {
            await fetchWeatherData(destination)
            await fetchWikipediaData(destination)
          }))
        } else {
          throw new Error(data.message || 'Failed to load destinations')
        }
      } catch (error) {
        console.error('Error fetching results:', error)
        handleApiError(error, 'Failed to load destinations. Please try again.')
        setError('Failed to load destinations')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const fetchWeatherData = async (destination: Destination) => {
    try {
      const response = await fetch(`/api/weather?lat=${destination.latitude}&lon=${destination.longitude}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      
      const weatherData = await response.json()
      
      setWeatherData(prev => ({
        ...prev,
        [destination.id]: weatherData
      }))
    } catch (error) {
      console.error('Error fetching weather data:', error)
      // Fallback to mock data if API fails
      const mockWeather = {
        temperature: Math.floor(Math.random() * 30) + 10,
        description: 'Partly cloudy',
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
      }
      
      setWeatherData(prev => ({
        ...prev,
        [destination.id]: mockWeather
      }))
    }
  }

  const fetchWikipediaData = async (destination: Destination) => {
    try {
      const response = await fetch(`/api/wikipedia?query=${encodeURIComponent(destination.name)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch Wikipedia data')
      }
      
      const wikiData = await response.json()
      
      setWikipediaData(prev => ({
        ...prev,
        [destination.id]: wikiData.extract || destination.description
      }))
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error)
      // Fallback to destination description if API fails
      setWikipediaData(prev => ({
        ...prev,
        [destination.id]: destination.description
      }))
    }
  }

  const saveTrip = async (destination: Destination) => {
    try {
      setSavingTrip(destination.id)
      
      const preferences = JSON.parse(localStorage.getItem('travelPreferences') || '{}')
      
      const tripData = {
        destinationId: destination.id,
        title: `${destination.name} Adventure`,
        budget: preferences.budget,
        duration: parseInt(preferences.duration) || 7,
        climate: preferences.climate,
        activities: preferences.activities || [],
        itinerary: generateItinerary(destination, preferences),
      }

      const response = await fetch('/api/saved-trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      })

      const data = await response.json()
      
      if (data.success) {
        showSuccess('Trip saved successfully!')
      } else {
        throw new Error(data.error || 'Failed to save trip')
      }
    } catch (error) {
      console.error('Error saving trip:', error)
      handleApiError(error, 'Failed to save trip')
    } finally {
      setSavingTrip(null)
    }
  }

  const generateItinerary = (destination: Destination, preferences: any) => {
    const duration = parseInt(preferences.duration) || 7
    const activities = preferences.activities || []
    
    const itinerary = []
    for (let i = 1; i <= duration; i++) {
      itinerary.push({
        day: i,
        activities: [
          `Morning: Explore ${destination.name}'s ${activities[i % activities.length] || 'culture'}`,
          `Afternoon: Visit local attractions and enjoy ${destination.cuisine || 'local cuisine'}`,
          `Evening: Relax and experience the local atmosphere`
        ]
      })
    }
    
    return itinerary
  }

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getClimateColor = (climate: string) => {
    switch (climate) {
      case 'hot': return 'bg-red-100 text-red-800'
      case 'moderate': return 'bg-blue-100 text-blue-800'
      case 'cold': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCurrencyConversion = async (destination: Destination) => {
    setSelectedDestination(destination)
    setShowCurrencyConverter(true)
  }

  const getEstimatedCost = (destination: Destination) => {
    // Simple cost estimation based on budget level and destination
    const budgetMultiplier = {
      'low': 0.7,
      'medium': 1.0,
      'high': 1.5
    }
    return userBudget * (budgetMultiplier[destination.budgetLevel as keyof typeof budgetMultiplier] || 1.0)
  }

  const handleTravelSuggestions = (destinationId: string) => {
    setShowTravelSuggestions(showTravelSuggestions === destinationId ? null : destinationId)
  }

  const handleViewOffers = async (destination: Destination) => {
    try {
      setOffersLoading(true)
      setOffers(null)
      setOffersDestination(destination)

      const preferences = JSON.parse(localStorage.getItem('travelPreferences') || '{}')

      const response = await fetch('/api/travel/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationId: destination.id, startDate: preferences.startDate, endDate: preferences.endDate })
      })

      if (!response.ok) throw new Error('Failed to fetch offers')

      const data = await response.json()
      if (data.success) {
        setOffers(data)
        setFlightMaxPrice(null)
        setHotelMaxPrice(null)
        setHotelMinRating(0)
      } else {
        throw new Error(data.error || 'Failed to load offers')
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
      setOffers({ success: false, error: 'Failed to load offers' })
    } finally {
      setOffersLoading(false)
    }
  }

  const closeOffers = () => {
    setOffers(null)
    setOffersDestination(null)
    setOffersLoading(false)
  }

  const filteredFlights = () => {
    if (!offers?.flights) return []
    return offers.flights.filter((f: any) => {
      if (flightMaxPrice && f.price > flightMaxPrice) return false
      return true
    })
  }

  const filteredHotels = () => {
    if (!offers?.hotels) return []
    return offers.hotels.filter((h: any) => {
      if (hotelMaxPrice && h.pricePerNight > hotelMaxPrice) return false
      if (hotelMinRating && h.rating < hotelMinRating) return false
      return true
    })
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load destinations"
        message="We couldn't load your travel recommendations. Please check your connection and try again."
        onRetry={() => window.location.reload()}
        retryLabel="Retry"
      />
    )
  }

  if (loading) {
    return (
      <PageLoading message="Finding your perfect destinations..." />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4"
            >
              Your Perfect Destinations
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Based on your preferences, we found {destinations.length} amazing destinations for you.
            </motion.p>
            
            {/* Currency Converter Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <Button
                variant="outline"
                onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
                className="mb-4"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                {showCurrencyConverter ? 'Hide' : 'Show'} Currency Converter
              </Button>
            </motion.div>
          </div>

          {/* Currency Converter */}
          {showCurrencyConverter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <CurrencyConverter
                amount={userBudget}
                fromCurrency="USD"
                toCurrency={selectedDestination ? getCurrencyByCountry(selectedDestination.country) : 'EUR'}
                country={selectedDestination?.country}
                className="max-w-md mx-auto"
              />
            </motion.div>
          )}

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className={getBudgetColor(destination.budgetLevel)}>
                        <DollarSign className="h-3 w-3 mr-1" />
                        {destination.budgetLevel}
                      </Badge>
                      <Badge className={getClimateColor(destination.climate)}>
                        <Thermometer className="h-3 w-3 mr-1" />
                        {destination.climate}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{destination.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {destination.city}, {destination.country}
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>

                    {/* Weather Info */}
                    <div className="mb-4">
                      <WeatherDisplay 
                        latitude={destination.latitude}
                        longitude={destination.longitude}
                        city={destination.city}
                        className="text-sm"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleViewOffers(destination)}>
                        <Plane className="h-4 w-4 mr-2" /> View Offers
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => saveTrip(destination)} disabled={!!savingTrip}>
                        <Heart className="h-4 w-4 mr-2" /> {savingTrip === destination.id ? 'Saving...' : 'Save Trip'}
                      </Button>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {wikipediaData[destination.id] || destination.description}
                    </p>

                    {/* Activities */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Popular Activities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {destination.activities.slice(0, 3).map((activity) => (
                          <Badge key={activity} variant="outline" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                        {destination.activities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{destination.activities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Best Season */}
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Best time to visit: {destination.bestSeason}
                      </p>
                    </div>

                    {/* Estimated Cost */}
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        Estimated cost: ${getEstimatedCost(destination).toLocaleString()} USD
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCurrencyConversion(destination)}
                        className="text-xs p-0 h-auto"
                      >
                        Convert to local currency
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <ButtonLoading
                        isLoading={savingTrip === destination.id}
                        onClick={() => saveTrip(destination)}
                        className="flex-1"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Save Trip
                      </ButtonLoading>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTravelSuggestions(destination.id)}
                      >
                        <Plane className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Suggestions */}
                {showTravelSuggestions === destination.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <TravelSuggestions
                      destination={destination}
                      budget={userBudget}
                      duration={7}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

            {/* Offers Modal */}
            {(offersDestination || offersLoading || offers) && (
              <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
                <div className="absolute inset-0 bg-black/40" onClick={closeOffers} />
                <div className="relative bg-background w-full max-w-4xl rounded-lg shadow-lg overflow-y-auto max-h-[80vh] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Offers for {offersDestination?.name}</h3>
                    <button onClick={closeOffers} className="p-2 rounded hover:bg-muted">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {offersLoading && (
                    <div className="p-8 text-center">Loading offers...</div>
                  )}

                  {offers && !offersLoading && !offers.success && (
                    <div className="p-4 text-red-600">{offers.error || 'Failed to load offers'}</div>
                  )}

                  {offers && offers.success && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Flights</h4>
                        <div className="flex gap-2 mb-4">
                          <input type="number" placeholder="Max price" className="input w-32" value={flightMaxPrice ?? ''} onChange={e => setFlightMaxPrice(e.target.value ? Number(e.target.value) : null)} />
                          <Button variant="outline" size="sm" onClick={() => { setFlightMaxPrice(null) }}>Clear</Button>
                        </div>
                        <div className="space-y-3">
                          {filteredFlights().map((f: any) => (
                            <div key={f.id} className="border rounded p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{f.airline} — {f.flightNumber}</div>
                                  <div className="text-sm text-muted-foreground">{f.from.city} ({f.from.code}) → {f.to.city} ({f.to.code})</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">${f.price}</div>
                                  <div className="text-sm text-muted-foreground">{Math.round(f.durationMinutes/60)}h {f.stops} stops</div>
                                </div>
                              </div>
                              <div className="mt-2 text-sm text-muted-foreground">Depart: {new Date(f.departAt).toLocaleString()} — Arrive: {new Date(f.arriveAt).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Hotels</h4>
                        <div className="flex gap-2 mb-4">
                          <input type="number" placeholder="Max price/night" className="input w-36" value={hotelMaxPrice ?? ''} onChange={e => setHotelMaxPrice(e.target.value ? Number(e.target.value) : null)} />
                          <input type="number" placeholder="Min rating" step="0.1" className="input w-28" value={hotelMinRating} onChange={e => setHotelMinRating(Number(e.target.value) || 0)} />
                          <Button variant="outline" size="sm" onClick={() => { setHotelMaxPrice(null); setHotelMinRating(0) }}>Clear</Button>
                        </div>
                        <div className="space-y-3">
                          {filteredHotels().map((h: any) => (
                            <div key={h.id} className="border rounded p-3">
                              <div className="flex justify-between">
                                <div>
                                  <div className="font-medium">{h.name}</div>
                                  <div className="text-sm text-muted-foreground">{h.location.address}</div>
                                  <div className="text-sm text-muted-foreground">Amenities: {h.amenities.join(', ')}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">${h.pricePerNight}/night</div>
                                  <div className="text-sm text-muted-foreground">Rating: {h.rating}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {destinations.length === 0 && (
            <EmptyState 
              title="No destinations found"
              message="Try adjusting your preferences to see more results."
              action={() => window.location.href = '/explore'}
              actionLabel="Modify Preferences"
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Results