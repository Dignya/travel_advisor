'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { MapPin, DollarSign, Calendar, Thermometer, Activity, ArrowRight } from 'lucide-react'
import Navigation from '@/components/Navigation'

const Explore = () => {
  const [formData, setFormData] = useState({
    budget: '',
    duration: '',
    climate: '',
    activities: [] as string[],
  })

  const activities = [
    'Adventure',
    'Relax',
    'Culture',
    'Shopping',
    'Beaches',
    'Mountains',
    'City Life',
    'Food & Dining',
    'Nightlife',
    'Historical Sites',
    'Nature',
    'Wildlife',
  ]

  const handleActivityChange = (activity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      activities: checked
        ? [...prev.activities, activity]
        : prev.activities.filter(a => a !== activity)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save to localStorage for now
    localStorage.setItem('travelPreferences', JSON.stringify(formData))
    // Redirect to results page
    window.location.href = '/results'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4"
            >
              Plan Your Perfect Trip
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Tell us about your travel preferences and we'll find the perfect destinations for you.
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Budget */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span>Budget</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low ($500-$1000)</SelectItem>
                      <SelectItem value="medium">Medium ($1000-$3000)</SelectItem>
                      <SelectItem value="high">High ($3000+)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Duration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Duration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trip duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="10">10 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="21">21+ days</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Climate */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    <span>Preferred Climate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.climate} onValueChange={(value) => setFormData(prev => ({ ...prev, climate: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred climate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot">Hot & Sunny</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="cold">Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Activities Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Selected Activities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 min-h-[60px]">
                    {formData.activities.length > 0 ? (
                      formData.activities.map((activity) => (
                        <Badge key={activity} variant="secondary">
                          {activity}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No activities selected</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Preferred Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activities.map((activity) => (
                    <div key={activity} className="flex items-center space-x-2">
                      <Checkbox
                        id={activity}
                        checked={formData.activities.includes(activity)}
                        onCheckedChange={(checked) => handleActivityChange(activity, checked as boolean)}
                      />
                      <Label htmlFor={activity} className="text-sm font-medium cursor-pointer">
                        {activity}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto"
                disabled={!formData.budget || !formData.duration || !formData.climate || formData.activities.length === 0}
              >
                Find Destinations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}

export default Explore