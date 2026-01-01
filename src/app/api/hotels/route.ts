import { NextRequest, NextResponse } from 'next/server'

// Mock hotel data for demonstration
// In a real application, you would integrate with hotel APIs like:
// - Booking.com
// - Expedia
// - Hotels.com
// - Agoda

const MOCK_HOTEL_DATA = {
  'Paris': {
    hotels: [
      {
        name: 'Le Meurice',
        rating: 5,
        priceRange: { min: 800, max: 2000 },
        amenities: ['Spa', 'Restaurant', 'Fitness Center', 'Concierge'],
        location: '1st Arrondissement'
      },
      {
        name: 'The Ritz Paris',
        rating: 5,
        priceRange: { min: 1000, max: 2500 },
        amenities: ['Spa', 'Restaurant', 'Bar', 'Room Service'],
        location: 'Place Vendôme'
      },
      {
        name: 'Hotel Lutetia',
        rating: 5,
        priceRange: { min: 700, max: 1800 },
        amenities: ['Spa', 'Restaurant', 'Fitness Center'],
        location: 'Saint-Germain-des-Prés'
      }
    ]
  },
  'Tokyo': {
    hotels: [
      {
        name: 'Aman Tokyo',
        rating: 5,
        priceRange: { min: 1000, max: 3000 },
        amenities: ['Spa', 'Restaurant', 'Fitness Center', 'Pool'],
        location: 'Otemachi'
      },
      {
        name: 'Imperial Hotel Tokyo',
        rating: 5,
        priceRange: { min: 600, max: 1500 },
        amenities: ['Spa', 'Restaurant', 'Fitness Center'],
        location: 'Hibiya'
      },
      {
        name: 'Park Hyatt Tokyo',
        rating: 5,
        priceRange: { min: 800, max: 2000 },
        amenities: ['Spa', 'Restaurant', 'Pool', 'Fitness Center'],
        location: 'Shinjuku'
      }
    ]
  },
  'New York': {
    hotels: [
      {
        name: 'The Plaza Hotel',
        rating: 5,
        priceRange: { min: 800, max: 2500 },
        amenities: ['Spa', 'Restaurant', 'Fitness Center', 'Concierge'],
        location: 'Fifth Avenue'
      },
      {
        name: 'The St. Regis New York',
        rating: 5,
        priceRange: { min: 900, max: 2200 },
        amenities: ['Spa', 'Restaurant', 'Bar', 'Room Service'],
        location: 'Midtown East'
      },
      {
        name: 'Four Seasons Hotel New York',
        rating: 5,
        priceRange: { min: 1000, max: 2800 },
        amenities: ['Spa', 'Restaurant', 'Pool', 'Fitness Center'],
        location: 'Midtown'
      }
    ]
  },
  'Dubai': {
    hotels: [
      {
        name: 'Burj Al Arab',
        rating: 7,
        priceRange: { min: 1500, max: 5000 },
        amenities: ['Spa', 'Restaurant', 'Pool', 'Private Beach', 'Helicopter'],
        location: 'Jumeirah'
      },
      {
        name: 'Atlantis The Palm',
        rating: 5,
        priceRange: { min: 400, max: 1200 },
        amenities: ['Spa', 'Restaurant', 'Pool', 'Water Park', 'Beach'],
        location: 'Palm Jumeirah'
      },
      {
        name: 'Armani Hotel Dubai',
        rating: 5,
        priceRange: { min: 600, max: 1800 },
        amenities: ['Spa', 'Restaurant', 'Pool', 'Fitness Center'],
        location: 'Burj Khalifa'
      }
    ]
  },
  'Singapore': {
    hotels: [
      {
        name: 'Marina Bay Sands',
        rating: 5,
        priceRange: { min: 500, max: 1500 },
        amenities: ['Spa', 'Restaurant', 'Pool', 'Casino', 'Shopping'],
        location: 'Marina Bay'
      },
      {
        name: 'Raffles Hotel Singapore',
        rating: 5,
        priceRange: { min: 800, max: 2000 },
        amenities: ['Spa', 'Restaurant', 'Bar', 'Butler Service'],
        location: 'Colonial District'
      },
      {
        name: 'Fullerton Bay Hotel',
        rating: 5,
        priceRange: { min: 600, max: 1600 },
        amenities: ['Spa', 'Restaurant', 'Pool', 'Fitness Center'],
        location: 'Marina Bay'
      }
    ]
  },
  'Sydney': {
    hotels: [
      {
        name: 'Park Hyatt Sydney',
        rating: 5,
        priceRange: { min: 600, max: 1800 },
        amenities: ['Spa', 'Restaurant', 'Pool', 'Fitness Center'],
        location: 'The Rocks'
      },
      {
        name: 'Four Seasons Hotel Sydney',
        rating: 5,
        priceRange: { min: 700, max: 2000 },
        amenities: ['Spa', 'Restaurant', 'Pool', 'Fitness Center'],
        location: 'Circular Quay'
      },
      {
        name: 'Shangri-La Hotel Sydney',
        rating: 5,
        priceRange: { min: 500, max: 1500 },
        amenities: ['Spa', 'Restaurant', 'Pool', 'Fitness Center'],
        location: 'The Rocks'
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')
    const guests = searchParams.get('guests') || '2'
    const rooms = searchParams.get('rooms') || '1'

    if (!city) {
      return NextResponse.json(
        { error: 'Missing required parameter: city' },
        { status: 400 }
      )
    }

    // Get hotel data for the city
    const cityData = MOCK_HOTEL_DATA[city as keyof typeof MOCK_HOTEL_DATA]
    
    if (!cityData) {
      // Generate generic hotel data if city not found
      const genericHotels = generateGenericHotels(city)
      return NextResponse.json({
        success: true,
        city,
        hotels: genericHotels,
        metadata: {
          totalHotels: genericHotels.length,
          averagePrice: Math.floor(genericHotels.reduce((sum, hotel) => sum + hotel.price, 0) / genericHotels.length),
          searchTime: new Date().toISOString()
        }
      })
    }

    // Generate hotel options with real-time pricing
    const hotelOptions = cityData.hotels.map((hotel, index) => {
      const price = Math.floor(Math.random() * (hotel.priceRange.max - hotel.priceRange.min) + hotel.priceRange.min)
      const rating = hotel.rating + (Math.random() - 0.5) * 0.2 // Add some variation to rating
      
      return {
        id: `hotel-${index + 1}`,
        name: hotel.name,
        rating: Math.max(1, Math.min(5, rating)), // Ensure rating is between 1-5
        price,
        pricePerNight: price,
        totalPrice: price * calculateNights(checkIn, checkOut),
        amenities: hotel.amenities,
        location: hotel.location,
        images: [
          `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop`,
          `https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop`,
          `https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop`
        ],
        checkIn: checkIn || generateRandomDate(),
        checkOut: checkOut || generateRandomCheckOut(checkIn || generateRandomDate()),
        guests: parseInt(guests),
        rooms: parseInt(rooms),
        available: Math.random() > 0.1, // 90% availability
        freeCancellation: Math.random() > 0.3,
        breakfastIncluded: Math.random() > 0.5,
        wifiIncluded: true,
        parking: Math.random() > 0.6,
        pool: hotel.amenities.includes('Pool'),
        spa: hotel.amenities.includes('Spa'),
        restaurant: hotel.amenities.includes('Restaurant'),
        fitnessCenter: hotel.amenities.includes('Fitness Center'),
        bookingUrl: `https://booking.com/hotel/${city.toLowerCase()}/${hotel.name.toLowerCase().replace(/\s+/g, '-')}`
      }
    })

    // Sort by price
    hotelOptions.sort((a, b) => a.price - b.price)

    return NextResponse.json({
      success: true,
      city,
      hotels: hotelOptions,
      metadata: {
        totalHotels: hotelOptions.length,
        cheapestPrice: hotelOptions[0].price,
        averagePrice: Math.floor(hotelOptions.reduce((sum, hotel) => sum + hotel.price, 0) / hotelOptions.length),
        highestRating: Math.max(...hotelOptions.map(h => h.rating)),
        searchTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Hotel search error:', error)
    return NextResponse.json(
      { error: 'Failed to search hotels' },
      { status: 500 }
    )
  }
}

function generateGenericHotels(city: string) {
  const hotelNames = [
    `${city} Grand Hotel`,
    `${city} Plaza Hotel`,
    `${city} Marriott`,
    `${city} Hilton`,
    `${city} Sheraton`,
    `${city} Intercontinental`,
    `${city} Westin`,
    `${city} Hyatt`
  ]

  return hotelNames.map((name, index) => ({
    id: `hotel-${index + 1}`,
    name,
    rating: 3 + Math.random() * 2, // 3-5 star rating
    price: Math.floor(Math.random() * 1000) + 100, // $100-1100 per night
    pricePerNight: Math.floor(Math.random() * 1000) + 100,
    totalPrice: Math.floor(Math.random() * 1000) + 100,
    amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Private Bathroom'],
    location: `City Center, ${city}`,
    images: [
      `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop`,
      `https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop`
    ],
    checkIn: generateRandomDate(),
    checkOut: generateRandomCheckOut(generateRandomDate()),
    guests: 2,
    rooms: 1,
    available: Math.random() > 0.1,
    freeCancellation: Math.random() > 0.3,
    breakfastIncluded: Math.random() > 0.5,
    wifiIncluded: true,
    parking: Math.random() > 0.6,
    pool: Math.random() > 0.4,
    spa: Math.random() > 0.3,
    restaurant: Math.random() > 0.5,
    fitnessCenter: Math.random() > 0.4,
    bookingUrl: `https://booking.com/hotel/${city.toLowerCase()}/${name.toLowerCase().replace(/\s+/g, '-')}`
  }))
}

function generateRandomDate() {
  const today = new Date()
  const futureDate = new Date(today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
  return futureDate.toISOString().split('T')[0]
}

function generateRandomCheckOut(checkIn: string) {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkInDate.getTime() + (1 + Math.floor(Math.random() * 6)) * 24 * 60 * 60 * 1000) // 1-7 nights
  return checkOutDate.toISOString().split('T')[0]
}

function calculateNights(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return 3 // Default 3 nights
  
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.max(1, diffDays)
}