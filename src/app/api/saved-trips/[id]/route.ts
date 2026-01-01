import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import SavedTrip from '@/models/SavedTrip'
import { getServerSession } from 'next-auth'
import authConfig from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()

  const session = await getServerSession(authConfig)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const trip = await SavedTrip.findById(id)
    if (!trip) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    const userId = (session.user as any).id || session.user?.email
    if (trip.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    await trip.deleteOne()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting saved trip:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
  }
}