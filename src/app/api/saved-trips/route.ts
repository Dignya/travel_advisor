import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import SavedTrip from '@/models/SavedTrip'
import { getServerSession } from 'next-auth'
import authConfig from '@/lib/auth'

export async function GET(request: NextRequest) {
  await connectDB()

  const session = await getServerSession(authConfig)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = (session.user as any).id || session.user?.email
    const trips = await SavedTrip.find({ userId }).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, savedTrips: trips.map(t => ({
      id: t._id.toString(),
      destinationId: t.destinationId,
      title: t.title,
      budget: t.budget,
      duration: t.duration.toString(),
      climate: t.climate,
      activities: t.activities,
      itinerary: t.itinerary,
      notes: t.notes,
      createdAt: t.createdAt.toISOString(),
    })) })
  } catch (error) {
    console.error('Error fetching saved trips:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch saved trips' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  await connectDB()

  const session = await getServerSession(authConfig)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const userId = (session.user as any).id || session.user?.email

    const trip = await SavedTrip.create({
      userId,
      destinationId: body.destinationId,
      title: body.title,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      budget: body.budget,
      duration: body.duration || 7,
      climate: body.climate,
      activities: body.activities || [],
      itinerary: body.itinerary || [],
      notes: body.notes,
    })

    return NextResponse.json({ success: true, savedTrip: { id: trip._id.toString() } }, { status: 201 })
  } catch (error) {
    console.error('Error creating saved trip:', error)
    return NextResponse.json({ success: false, error: 'Failed to create saved trip' }, { status: 500 })
  }
}