'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Compass, Calendar, DollarSign, Sparkles, Globe, Target, Zap } from 'lucide-react'
import Link from 'next/link'
import WorldLandmarks from './WorldLandmarks'
import { LandmarkDetails } from './LandmarkDetails'
import { useState } from 'react'

const HeroSection = () => {
  const [selectedLandmark, setSelectedLandmark] = useState<any>(null)
  const [isLandmarkModalOpen, setIsLandmarkModalOpen] = useState(false)

  const handleLandmarkSelect = (landmark: any) => {
    setSelectedLandmark(landmark)
    setIsLandmarkModalOpen(true)
  }

  const handleSaveTrip = (landmarkData: any) => {
    // Implement trip saving logic
    console.log('Saving trip for:', landmarkData.name)
    // Could integrate with existing save trip functionality
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Hero section">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" aria-hidden="true">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-200/20 to-green-200/20 dark:from-blue-800/20 dark:to-green-800/20"
              style={{
                width: Math.random() * 400 + 100,
                height: Math.random() * 400 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
              role="status"
              aria-live="polite"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>AI-Powered Travel Planning</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Discover Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                Perfect Journey
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              Personalized destination recommendations powered by AI, with real-time insights and custom itineraries tailored just for you.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              role="group"
              aria-label="Call to action buttons"
            >
              <Link href="/explore">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Start planning your trip"
                >
                  <span className="relative z-10 flex items-center">
                    <Compass className="mr-2 h-5 w-5" />
                    Start Planning
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Learn more about SmartTravel"
                >
                  <span className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Learn More
                  </span>
                </Button>
              </Link>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              role="list"
              aria-label="Key features"
            >
              {[
                { 
                  icon: Globe, 
                  title: '195+ Destinations', 
                  desc: 'Global coverage with local insights',
                  color: 'text-blue-600'
                },
                { 
                  icon: Zap, 
                  title: 'AI Matching', 
                  desc: 'Smart recommendations based on your preferences',
                  color: 'text-purple-600'
                },
                { 
                  icon: MapPin, 
                  title: 'Real-time Data', 
                  desc: 'Weather, events, and local information',
                  color: 'text-green-600'
                },
              ].map((feature, index) => (
                <Card key={index} className="text-center border-0 shadow-lg bg-background/80 backdrop-blur-sm hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" role="listitem">
                  <CardContent className="p-6">
                    <feature.icon className={`h-8 w-8 mx-auto mb-3 ${feature.color}`} aria-hidden="true" />
                    <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Globe */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative flex items-center justify-center"
            role="complementary"
            aria-label="Interactive world landmarks"
          >
            <div className="relative w-full max-w-lg mx-auto h-96">
              <WorldLandmarks onLandmarkSelect={handleLandmarkSelect} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Landmark Details Modal */}
      {selectedLandmark && (
        <LandmarkDetails
          landmark={selectedLandmark}
          isOpen={isLandmarkModalOpen}
          onClose={() => setIsLandmarkModalOpen(false)}
          onSaveTrip={handleSaveTrip}
        />
      )}
    </section>
  )
}

export default HeroSection