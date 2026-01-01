'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { WeatherDisplay } from '@/components/WeatherDisplay'
import { useWeather } from '@/hooks/useWeather'
import { useWikipedia } from '@/hooks/useWikipedia'
import {
  X,
  MapPin,
  Globe,
  Clock,
  ExternalLink,
  Plane,
  Heart,
  Share2,
  Cloud
} from 'lucide-react'

interface LandmarkDetailsProps {
  landmark: {
    id: string
    name: string
    location: string
    latitude: number
    longitude: number
    type: string
    description: string
    color: string
    icon: string
  }
  isOpen: boolean
  onClose: () => void
  onSaveTrip?: (landmark: any) => void
}

export function LandmarkDetails({
  landmark,
  isOpen,
  onClose,
  onSaveTrip
}: LandmarkDetailsProps) {
  const { weatherData, loading: weatherLoading, error: weatherError, getWeatherByCoordinates } = useWeather()
  const { wikipediaData, loading: wikiLoading, error: wikiError, searchWikipedia } = useWikipedia()

  const [activeTab, setActiveTab] = useState<'overview' | 'weather' | 'info'>('overview')

  useEffect(() => {
    if (isOpen) {
      // Fetch weather data
      getWeatherByCoordinates(landmark.latitude, landmark.longitude)

        // Fetch Wikipedia data
        ; (async () => {
          try {
            // We specifically DON'T want this effect to rerun just because the function identity changes
            // creating a stable wrapper locally or ignoring the lint rule is common here if the hook isn't stable,
            // but we fixed the hook stability in the previous step.
            await searchWikipedia(landmark.name)
          } catch (e) {
            // ignore - hook sets error state
          }
        })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, landmark.id]) // Only re-run if modal opens or landmark ID changes

  const handleSaveTrip = () => {
    if (onSaveTrip) {
      onSaveTrip({
        ...landmark,
        weather: weatherData,
        wikipedia: wikipediaData
      })
    }
    onClose()
  }

  const getTypeColor = (type: string) => {
    const colors = {
      temple: 'bg-purple-100 text-purple-800',
      monument: 'bg-blue-100 text-blue-800',
      historical: 'bg-amber-100 text-amber-800',
      modern: 'bg-green-100 text-green-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <span className="text-2xl">{landmark.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{landmark.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {landmark.location}
              </p>
            </div>
          </DialogTitle>
          <div className="sr-only">
            <p id="dialog-description">
              Details for {landmark.name}, located in {landmark.location}.
            </p>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex space-x-1 border-b">
          {[
            { key: 'overview', label: 'Overview', icon: Globe },
            { key: 'weather', label: 'Weather', icon: Cloud },
            { key: 'info', label: 'Details', icon: Clock }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(key as typeof activeTab)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Badge className={getTypeColor(landmark.type)}>
                        {landmark.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Coordinates: {landmark.latitude.toFixed(4)}°, {landmark.longitude.toFixed(4)}°
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {landmark.description}
                    </p>
                  </div>

                  {/* Wikipedia Summary */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Wikipedia Summary
                    </h3>
                    {wikiLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                      </div>
                    ) : wikiError ? (
                      <p className="text-sm text-muted-foreground">
                        Unable to load Wikipedia information.
                      </p>
                    ) : wikipediaData ? (
                      <div className="space-y-3">
                        <p className="text-muted-foreground leading-relaxed">
                          {wikipediaData.extract}
                        </p>
                        {wikipediaData.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(wikipediaData.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Read more on Wikipedia
                          </Button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {activeTab === 'weather' && (
                <div className="space-y-4">
                  <WeatherDisplay
                    latitude={landmark.latitude}
                    longitude={landmark.longitude}
                    city={landmark.location.split(',')[0]}
                  />

                  {weatherError && (
                    <div className="text-center text-sm text-muted-foreground">
                      Weather data unavailable for this location.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Travel Information */}
                  <div>
                    <h3 className="font-semibold mb-3">Travel Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Best Time to Visit</h4>
                        <p className="text-sm text-muted-foreground">
                          Year-round destination with peak season from October to March
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Average Stay</h4>
                        <p className="text-sm text-muted-foreground">
                          2-3 days recommended for full experience
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Accessibility</h4>
                        <p className="text-sm text-muted-foreground">
                          Good public transportation and tourist facilities
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Local Currency</h4>
                        <p className="text-sm text-muted-foreground">
                          Varies by location - check local currency
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <h3 className="font-semibold mb-3">Recommended Activities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        'Sightseeing', 'Photography', 'Cultural Tours',
                        'Local Cuisine', 'Shopping', 'Guided Tours'
                      ].map((activity) => (
                        <Badge key={activity} variant="outline" className="justify-center">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h3 className="font-semibold mb-3">Travel Tips</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        Book tickets in advance during peak season
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        Respect local customs and dress codes
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        Carry local currency for small purchases
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        Stay hydrated and wear comfortable shoes
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={async () => {
              const shareUrl = `${window.location.origin}/?landmark=${encodeURIComponent(landmark.id)}`
              if (navigator.share) {
                try {
                  await navigator.share({ title: landmark.name, text: landmark.description, url: shareUrl })
                } catch (e) {
                  // user cancelled or share failed
                }
              } else {
                try {
                  await navigator.clipboard.writeText(shareUrl)
                  alert('Link copied to clipboard')
                } catch (e) {
                  // fallback
                  window.open(shareUrl, '_blank')
                }
              }
            }}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <div className="flex space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={handleSaveTrip}>
              <Heart className="h-4 w-4 mr-2" />
              Save Trip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}