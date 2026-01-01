import { NextRequest, NextResponse } from 'next/server'
import destinations from '@/data/destinations.json'

function mockFlights(destination: any, startDate?: string, endDate?: string) {
  // Simple realistic mock flights
  const airlines = ['Delta', 'United', 'American', 'Emirates', 'Qatar Airways', 'KLM']
  const airports = [
    { code: 'JFK', city: 'New York' },
    { code: 'LAX', city: 'Los Angeles' },
    { code: 'SFO', city: 'San Francisco' },
    { code: 'ORD', city: 'Chicago' },
    { code: 'ATL', city: 'Atlanta' },
  ]

  const destAirport = destination.airportCode || 'LAX'

  return Array.from({ length: 6 }).map((_, i) => {
    const depart = new Date()
    depart.setDate(depart.getDate() + (i + 1))
    const arrive = new Date(depart.getTime() + (6 + i) * 60 * 60 * 1000)
    const price = Math.round(300 + Math.random() * 700)
    const airline = airlines[i % airlines.length]
    const from = airports[i % airports.length]

    return {
      id: `FL-${destination.id}-${i}`,
      airline,
      flightNumber: `${airline.slice(0,2).toUpperCase()}${300 + i}`,
      from: { code: from.code, city: from.city },
      to: { code: destAirport, city: destination.name },
      departAt: depart.toISOString(),
      arriveAt: arrive.toISOString(),
      durationMinutes: Math.round((arrive.getTime() - depart.getTime()) / 60000),
      price: price,
      currency: 'USD',
      stops: Math.random() > 0.7 ? 1 : 0,
    }
  })
}

function mockHotels(destination: any) {
  const hotelNames = ['Grand', 'Plaza', 'Sunset', 'Harbor', 'Skyline', 'Riverside']
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `HT-${destination.id}-${i}`,
    name: `${destination.name} ${hotelNames[i % hotelNames.length]}`,
    pricePerNight: Math.round(80 + Math.random() * 320),
    rating: +(3 + Math.random() * 2).toFixed(1),
    location: {
      lat: destination.lat || 0,
      lng: destination.lng || 0,
      address: destination.address || `${destination.name} city center`
    },
    amenities: ['Free WiFi', 'Breakfast', 'Pool', 'Gym'].slice(0, 2 + (i % 3)),
  }))
}

export async function POST(request: NextRequest) {
  try {
    const { destinationId, startDate, endDate } = await request.json()

    const destination = destinations.find((d: any) => d.id === destinationId || d.slug === destinationId)
    if (!destination) {
      return NextResponse.json({ success: false, error: 'Destination not found' }, { status: 404 })
    }

    const flights = mockFlights(destination, startDate, endDate)
    const hotels = mockHotels(destination)

    return NextResponse.json({ success: true, destination, flights, hotels })
  } catch (error) {
    console.error('Error generating travel offers:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate offers' }, { status: 500 })
  }
}
