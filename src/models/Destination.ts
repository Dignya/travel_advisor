import mongoose, { Document, Schema } from 'mongoose'

export interface IDestination extends Document {
  name: string
  country: string
  city?: string
  description?: string
  latitude: number
  longitude: number
  image?: string
  climate: 'hot' | 'moderate' | 'cold'
  activities: string[]
  budgetLevel: 'low' | 'medium' | 'high'
  bestSeason?: string
  createdAt: Date
  updatedAt: Date
}

const destinationSchema = new Schema<IDestination>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    climate: {
      type: String,
      required: true,
      enum: ['hot', 'moderate', 'cold'],
    },
    activities: {
      type: [String],
      required: true,
    },
    budgetLevel: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
    },
    bestSeason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Destination || mongoose.model<IDestination>('Destination', destinationSchema)