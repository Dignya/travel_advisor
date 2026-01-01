import mongoose from 'mongoose'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-travel-advisor'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Export a MongoClient promise for adapters (NextAuth expects a MongoClient)
const mongoUri = MONGODB_URI

declare global {
  // allow global to hold the MongoClient promise during hot-reloads in dev
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!globalThis._mongoClientPromise) {
  const client = new MongoClient(mongoUri)
  globalThis._mongoClientPromise = client.connect()
}

export const clientPromise: Promise<MongoClient> = globalThis._mongoClientPromise as Promise<MongoClient>

export default connectDB