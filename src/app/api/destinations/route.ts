import { NextRequest, NextResponse } from 'next/server'
import destinations from '@/data/destinations.json'

export async function POST(request: NextRequest) {
  try {
    const { budget, climate, activities } = await request.json()

    // Filter destinations based on criteria
    let filteredDestinations = destinations

    if (budget) {
      filteredDestinations = filteredDestinations.filter(dest => dest.budgetLevel === budget)
    }
    
    if (climate) {
      filteredDestinations = filteredDestinations.filter(dest => dest.climate === climate)
    }
    
    if (activities && activities.length > 0) {
      filteredDestinations = filteredDestinations.filter(dest => 
        activities.some((activity: string) => dest.activities.includes(activity))
      )
    }

    // Sort by number of matching activities
    const sortedDestinations = filteredDestinations.sort((a, b) => {
      const aMatches = activities ? activities.filter((act: string) => a.activities.includes(act)).length : 0
      const bMatches = activities ? activities.filter((act: string) => b.activities.includes(act)).length : 0
      return bMatches - aMatches
    })

    return NextResponse.json({
      success: true,
      destinations: sortedDestinations.slice(0, 6) // Return top 6 matches
    })
  } catch (error) {
    console.error('Error filtering destinations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to filter destinations' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return all destinations
    return NextResponse.json({
      success: true,
      destinations: destinations.slice(0, 12) // Return first 12 for general browsing
    })
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch destinations' },
      { status: 500 }
    )
  }
}