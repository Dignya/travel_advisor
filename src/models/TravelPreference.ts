import mongoose, { Document, Schema } from 'mongoose'

export interface ITravelPreference extends Document {
  userId: string
  budget: 'low' | 'medium' | 'high'
  duration: number
  climate: 'hot' | 'moderate' | 'cold'
  activities: string[]
  createdAt: Date
  updatedAt: Date
}

const travelPreferenceSchema = new Schema<ITravelPreference>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
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
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.TravelPreference || mongoose.model<ITravelPreference>('TravelPreference', travelPreferenceSchema)