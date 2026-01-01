import mongoose from 'mongoose'
import connectDB from '../src/lib/mongodb'
import Destination from '../src/models/Destination'
import destinations from '../src/data/destinations.json'

async function seedDestinations() {
  try {
    await connectDB()
    
    // Clear existing destinations
    await Destination.deleteMany({})
    
    // Insert new destinations
    const insertedDestinations = await Destination.insertMany(destinations)
    
    console.log(`Successfully seeded ${insertedDestinations.length} destinations`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding destinations:', error)
    process.exit(1)
  }
}

seedDestinations()