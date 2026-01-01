import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import { User } from '@/models/User'

export async function POST(request: NextRequest) {
  await connectDB()

  try {
    const { name, email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      name: name?.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
    })

    return NextResponse.json({ success: true, user: { id: user._id.toString(), email: user.email, name: user.name } }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 })
  }
}