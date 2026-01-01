'use client'

import { motion } from 'framer-motion'
import { Loader2, AlertCircle, RefreshCw, MapPin } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent } from './card'

// Loading spinner component
export function LoadingSpinner({ size = 'default', className = '' }: { size?: 'sm' | 'default' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  )
}

// Skeleton loaders for different content types
export function DestinationCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-muted animate-pulse" />
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          <div className="h-16 bg-muted rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-12 bg-muted rounded-full animate-pulse" />
            <div className="h-6 w-12 bg-muted rounded-full animate-pulse" />
            <div className="h-6 w-12 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="h-12 bg-muted rounded animate-pulse w-48 mx-auto" />
    </div>
  )
}

export function WeatherSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
      <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse w-20" />
        <div className="h-3 bg-muted rounded animate-pulse w-16" />
      </div>
    </div>
  )
}

// Page-level loading component
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <LoadingSpinner size="lg" className="mx-auto mb-4 text-primary" />
        <p className="text-lg text-muted-foreground">{message}</p>
      </motion.div>
    </div>
  )
}

// Error state component
export function ErrorState({ 
  title = 'Something went wrong',
  message = 'An error occurred while loading the content.',
  onRetry,
  retryLabel = 'Try again'
}: { 
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="flex items-center mx-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryLabel}
          </Button>
        )}
      </motion.div>
    </div>
  )
}

// Empty state component
export function EmptyState({ 
  title = 'No results found',
  message = 'Try adjusting your filters or search criteria.',
  action,
  actionLabel
}: { 
  title?: string
  message?: string
  action?: () => void
  actionLabel?: string
}) {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        {action && actionLabel && (
          <Button onClick={action}>{actionLabel}</Button>
        )}
      </motion.div>
    </div>
  )
}

// Inline loading component for buttons
export function ButtonLoading({ children, isLoading = false }: { children: React.ReactNode, isLoading?: boolean }) {
  return (
    <Button disabled={isLoading} className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className={isLoading ? 'invisible' : 'visible'}>{children}</span>
    </Button>
  )
}

// Progress indicator for async operations
export function ProgressIndicator({ 
  progress = 0, 
  message = 'Loading...' 
}: { 
  progress?: number
  message?: string 
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{message}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className="bg-primary h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

// Loading overlay for modals and cards
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}