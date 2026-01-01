'use client'

import { useEffect } from 'react'
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

// Toast configuration interface
interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Custom toast hook
export function useToast() {
  const showToast = ({ message, type = 'info', duration = 4000, action }: ToastOptions) => {
    const iconMap = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      error: <XCircle className="h-5 w-5 text-red-500" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      info: <Info className="h-5 w-5 text-blue-500" />
    }

    sonnerToast(message, {
      icon: iconMap[type],
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined,
      className: type === 'error' ? 'destructive' : '',
    })
  }

  const showSuccess = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    showToast({ ...options, message, type: 'success' })
  }

  const showError = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    showToast({ ...options, message, type: 'error' })
  }

  const showWarning = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    showToast({ ...options, message, type: 'warning' })
  }

  const showInfo = (message: string, options?: Omit<ToastOptions, 'type'>) => {
    showToast({ ...options, message, type: 'info' })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showToast
  }
}

// Toast provider component
export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      visibleToasts={5}
      toastOptions={{
        style: {
          background: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
        },
      }}
    />
  )
}

// Hook for API error handling
export function useApiErrorHandler() {
  const { showError } = useToast()

  const handleApiError = (error: any, defaultMessage = 'An error occurred') => {
    console.error('API Error:', error)
    
    let message = defaultMessage
    if (error?.response?.data?.message) {
      message = error.response.data.message
    } else if (error?.message) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }

    showError(message)
  }

  return { handleApiError }
}

// Hook for async operation feedback
export function useAsyncFeedback() {
  const { showSuccess, showError, showInfo } = useToast()

  const showOperationStart = (message: string) => {
    showInfo(message, { duration: 2000 })
  }

  const showOperationSuccess = (message: string) => {
    showSuccess(message)
  }

  const showOperationError = (error: any, defaultMessage = 'Operation failed') => {
    showError(typeof error === 'string' ? error : defaultMessage)
  }

  return {
    showOperationStart,
    showOperationSuccess,
    showOperationError
  }
}