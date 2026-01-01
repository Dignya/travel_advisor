'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { MapPin, Calendar, DollarSign, Heart, Trash2, Edit, Eye, Clock, Thermometer } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'

interface SavedTrip {
  id: string
  destinationId: string
  title: string
  budget: string
  duration: string
  climate: string
  activities: string[]
  itinerary: Array<{
    day: number
    activities: string[]
  }>
  notes?: string
  createdAt: string
}

const SavedTrips = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState<SavedTrip | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      loadSavedTrips()
    }
  }, [status, router])

  const loadSavedTrips = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/saved-trips')
      const data = await response.json()
      
      if (data.success) {
        setSavedTrips(data.savedTrips)
      }
    } catch (error) {
      console.error('Error loading saved trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTrip = async (tripId: string) => {
    try {
      const response = await fetch(`/api/saved-trips/${tripId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSavedTrips(prev => prev.filter(trip => trip.id !== tripId))
      } else {
        alert('Failed to delete trip')
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
      alert('Failed to delete trip')
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Your Saved Trips
            </h1>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
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
              Your Saved Trips
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Manage and review your saved travel plans.
            </motion.p>
          </div>

          {savedTrips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center py-12"
            >
              <div className="mb-6">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              </div>
              <h2 className="text-2xl font-bold mb-4">No saved trips yet</h2>
              <p className="text-muted-foreground mb-6">
                Start planning your adventure and save your favorite destinations!
              </p>
              <Button onClick={() => window.location.href = '/explore'}>
                Plan Your First Trip
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{trip.title}</CardTitle>
                        <div className="flex gap-1">
                          <Badge className={getBudgetColor(trip.budget)}>
                            <DollarSign className="h-3 w-3 mr-1" />
                            {trip.budget}
                          </Badge>
                          <Badge className={getClimateColor(trip.climate)}>
                            <Thermometer className="h-3 w-3 mr-1" />
                            {trip.climate}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Saved on {formatDate(trip.createdAt)}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Trip Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{trip.duration} days</span>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Activities:</p>
                          <div className="flex flex-wrap gap-1">
                            {trip.activities.slice(0, 3).map((activity) => (
                              <Badge key={activity} variant="outline" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                            {trip.activities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{trip.activities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{trip.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium">Duration</p>
                                  <p className="text-muted-foreground">{trip.duration} days</p>
                                </div>
                                <div>
                                  <p className="font-medium">Budget</p>
                                  <p className="text-muted-foreground capitalize">{trip.budget}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Climate</p>
                                  <p className="text-muted-foreground capitalize">{trip.climate}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Saved</p>
                                  <p className="text-muted-foreground">{formatDate(trip.createdAt)}</p>
                                </div>
                              </div>
                              
                              <div>
                                <p className="font-medium mb-2">Activities</p>
                                <div className="flex flex-wrap gap-1">
                                  {trip.activities.map((activity) => (
                                    <Badge key={activity} variant="secondary">
                                      {activity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="font-medium mb-2">Itinerary</p>
                                <div className="space-y-3">
                                  {trip.itinerary.map((day) => (
                                    <div key={day.day} className="border rounded-lg p-3">
                                      <p className="font-medium mb-2">Day {day.day}</p>
                                      <ul className="text-sm text-muted-foreground space-y-1">
                                        {day.activities.map((activity, idx) => (
                                          <li key={idx} className="flex items-start">
                                            <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                                            {activity}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {trip.notes && (
                                <div>
                                  <p className="font-medium mb-2">Notes</p>
                                  <p className="text-muted-foreground">{trip.notes}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Trip</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{trip.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteTrip(trip.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default SavedTrips