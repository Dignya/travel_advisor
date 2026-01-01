'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Plane, 
  Hotel, 
  ExternalLink, 
  Star, 
  DollarSign, 
  Users, 
  Calendar,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  Heart,
  Clock,
  MapPin
} from 'lucide-react'

interface TravelSuggestionsProps {
  destination: {
    name: string
    country: string
    city: string
  }
  budget?: number
  duration?: number
  className?: string
}

interface FlightOption {
  id: string
  airline: string
  price: number
  stops: number
  duration: string
  aircraft: string
  departure: string
  arrival: string
  passengers: number
  bookingClass: string
  refundable: boolean
  baggageIncluded: boolean
}

interface HotelOption {
  id: string
  name: string
  rating: number
  price: number
  pricePerNight: number
  totalPrice: number
  amenities: string[]
  location: string
  images: string[]
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  available: boolean
  freeCancellation: boolean
  breakfastIncluded: boolean
  wifiIncluded: boolean
  parking: boolean
  pool: boolean
  spa: boolean
  restaurant: boolean
  fitnessCenter: boolean
  bookingUrl: string
}

export function TravelSuggestions({ 
  destination, 
  budget = 1000, 
  duration = 7, 
  className = '' 
}: TravelSuggestionsProps) {
  const [flights, setFlights] = useState<FlightOption[]>([])
  const [hotels, setHotels] = useState<HotelOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTravelSuggestions()
  }, [destination])

  const loadTravelSuggestions = async () => {
    setLoading(true)
    setError(null)

    try {
      // Load flight suggestions
      const flightResponse = await fetch(
        `/api/flights?from=New York&to=${destination.city}&passengers=1`
      )
      
      if (flightResponse.ok) {
        const flightData = await flightResponse.json()
        setFlights(flightData.flightOptions || [])
      }

      // Load hotel suggestions
      const hotelResponse = await fetch(
        `/api/hotels?city=${destination.city}&guests=2&rooms=1`
      )
      
      if (hotelResponse.ok) {
        const hotelData = await hotelResponse.json()
        setHotels(hotelData.hotels || [])
      }
    } catch (error) {
      console.error('Error loading travel suggestions:', error)
      setError('Failed to load travel suggestions')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`
  }

  const formatDuration = (duration: string) => {
    return duration
  }

  const getStopText = (stops: number) => {
    if (stops === 0) return 'Direct'
    if (stops === 1) return '1 Stop'
    return `${stops} Stops`
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    )
  }

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Free WiFi': <Wifi className="h-4 w-4" />,
      'Parking': <Car className="h-4 w-4" />,
      'Restaurant': <Utensils className="h-4 w-4" />,
      'Fitness Center': <Dumbbell className="h-4 w-4" />,
      'Pool': <Waves className="h-4 w-4" />,
      'Spa': <Waves className="h-4 w-4" />
    }
    return iconMap[amenity] || <div className="h-4 w-4" />
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Travel Suggestions for {destination.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Unable to load travel suggestions</p>
            <Button variant="outline" size="sm" onClick={loadTravelSuggestions} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plane className="h-5 w-5" />
          <span>Travel Suggestions for {destination.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="flights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flights" className="flex items-center space-x-2">
              <Plane className="h-4 w-4" />
              <span>Flights</span>
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center space-x-2">
              <Hotel className="h-4 w-4" />
              <span>Hotels</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flights" className="space-y-4">
            {flights.length > 0 ? (
              <div className="space-y-3">
                {flights.slice(0, 3).map((flight) => (
                  <Card key={flight.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-semibold">{flight.airline}</p>
                            <p className="text-sm text-muted-foreground">{flight.aircraft}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-medium">{formatDuration(flight.duration)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Stops</p>
                            <Badge variant="outline">{getStopText(flight.stops)}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {formatPrice(flight.price)}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{flight.departure}</span>
                        </div>
                        <Button size="sm" className="mt-2">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" className="w-full">
                  View All Flight Options
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No flight options available for this destination</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hotels" className="space-y-4">
            {hotels.length > 0 ? (
              <div className="space-y-3">
                {hotels.slice(0, 3).map((hotel) => (
                  <Card key={hotel.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0">
                        <img
                          src={hotel.images[0]}
                          alt={hotel.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{hotel.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              {renderStars(hotel.rating)}
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                {hotel.location}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {hotel.amenities.slice(0, 4).map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="text-xs">
                                  {getAmenityIcon(amenity)}
                                  <span className="ml-1">{amenity}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              {formatPrice(hotel.pricePerNight)}
                              <span className="text-sm font-normal text-muted-foreground">/night</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(hotel.totalPrice)} total
                            </p>
                            <Button size="sm" className="mt-2">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Book
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" className="w-full">
                  View All Hotel Options
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Hotel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hotel options available for this destination</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}