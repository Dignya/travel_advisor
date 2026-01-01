 'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Menu, X, MapPin, Heart, Info, Home, Plane, Compass, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/saved-trips', label: 'Saved Trips', icon: Heart },
    { href: '/about', label: 'About', icon: Info },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="SmartTravel AI Advisor - Home">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Plane className="h-8 w-8 text-primary" aria-hidden="true" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" aria-hidden="true"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  SmartTravel
                </span>
                <span className="block text-xs text-muted-foreground -mt-1">AI Advisor</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Primary navigation">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                  aria-label={`Navigate to ${item.label}`}
                >
                  <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Theme Toggle & Auth Buttons */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Auth buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {status === 'loading' ? (
                <Button variant="ghost">Loading...</Button>
              ) : !session ? (
                <>
                  <Button variant="ghost" onClick={() => signIn()} aria-label="Sign in to your account">Sign In</Button>
                  <Button onClick={() => window.location.href = '/auth/signup'} aria-label="Create a new account">Sign Up</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => window.location.href = '/profile'}>{session.user?.name ?? session.user?.email}</Button>
                  <Button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</Button>
                </>
              )}
            </div>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Toggle mobile menu"
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]" id="mobile-menu">
                <div className="flex flex-col space-y-4 mt-8">
                  <nav aria-label="Mobile navigation">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 text-lg font-medium transition-colors hover:text-primary p-3 rounded-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        onClick={() => setIsOpen(false)}
                        aria-label={`Navigate to ${item.label}`}
                      >
                        <item.icon className="h-5 w-5" aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Sign in to your account"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                      <Button 
                        className="w-full justify-start focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Create a new account"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Theme</p>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation