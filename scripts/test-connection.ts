import mongoose from 'mongoose'
import connectDB from '../src/lib/mongodb'
import Destination from '../src/models/Destination'

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...')
    
    // Test connection
    await connectDB()
    console.log('✅ MongoDB connection successful!')
    
    // Test database operations
    console.log('🔄 Testing database operations...')
    
    // Count destinations
    const destinationCount = await Destination.countDocuments()
    console.log(`📊 Found ${destinationCount} destinations in the database`)
    
    // Sample query
    const sampleDestinations = await Destination.find({}).limit(3).lean()
    console.log('📝 Sample destinations:')
    sampleDestinations.forEach((dest, index) => {
      console.log(`  ${index + 1}. ${dest.name}, ${dest.country} (${dest.climate}, ${dest.budgetLevel})`)
    })
    
    // Test query with filters
    const filteredDestinations = await Destination.find({
      climate: 'moderate',
      budgetLevel: 'medium'
    }).lean()
    
    console.log(`🔍 Found ${filteredDestinations.length} moderate climate, medium budget destinations`)
    
    console.log('✅ All database operations completed successfully!')
    console.log('🎉 Your Smart Travel Advisor MongoDB setup is working perfectly!')
    
    // Close connection
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
    
  } catch (error) {
    console.error('❌ Error testing connection:', error)
    console.log('\n🔧 Troubleshooting tips:')
    console.log('1. Make sure MongoDB is running (local or Atlas)')
    console.log('2. Check your MONGODB_URI in .env file')
    console.log('3. Verify network connectivity')
    console.log('4. Check MongoDB credentials (for Atlas)')
    
    process.exit(1)
  }
}

// Run the test
testConnection()