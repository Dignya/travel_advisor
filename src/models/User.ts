import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  name?: string
  image?: string
  password?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User
export { User }