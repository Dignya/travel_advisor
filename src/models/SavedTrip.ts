import mongoose, { Document, Schema } from 'mongoose'

export interface ISavedTrip extends Document {
  userId: string
  destinationId: string
  title: string
  startDate?: Date
  endDate?: Date
  budget: 'low' | 'medium' | 'high'
  duration: number
  climate: 'hot' | 'moderate' | 'cold'
  activities: string[]
  itinerary: Array<{
    day: number
    activities: string[]
  }>
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const savedTripSchema = new Schema<ISavedTrip>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    destinationId: {
      type: String,
      required: true,
      ref: 'Destination',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
    },
    duration: {
      type: Number,
      required: true,
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
    itinerary: {
      type: [
        {
          day: { type: Number, required: true },
          activities: { type: [String], required: true },
        },
      ],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.SavedTrip || mongoose.model<ISavedTrip>('SavedTrip', savedTripSchema)