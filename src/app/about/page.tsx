'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Target } from 'lucide-react'
import Navigation from '@/components/Navigation'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6"
          >
            About Smart Travel Advisor
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Your intelligent travel companion that leverages cutting-edge technology
            to create personalized travel experiences. We combine AI-powered
            recommendations with real-time data to help you discover the perfect
            destinations for your next adventure.
          </motion.p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                To make travel planning effortless, enjoyable, and personalized
                for everyone. We believe that technology can enhance the travel
                experience by providing intelligent recommendations, reducing
                planning stress, and helping travelers discover destinations that
                perfectly match their preferences and budget.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardContent className="p-8">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Start Your Journey Today
              </h2>

              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Ready to discover your perfect destination? Let our AI-powered
                travel advisor help you plan the trip of your dreams.
              </p>

              <button
                onClick={() => (window.location.href = '/explore')}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Plan Your Trip
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default About
