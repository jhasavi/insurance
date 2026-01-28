"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <Loader2 
      className={cn(
        "animate-spin",
        sizeClasses[size],
        className
      )} 
    />
  )
}

interface LoadingStateProps {
  isLoading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function LoadingState({ 
  isLoading, 
  children, 
  fallback, 
  className 
}: LoadingStateProps) {
  if (isLoading) {
    return fallback || (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}

interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  disabled?: boolean
  className?: string
  loadingText?: string
}

export function LoadingButton({ 
  isLoading, 
  children, 
  disabled = false, 
  className,
  loadingText = "Loading..."
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4",
        className
      )}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  )
}

interface LoadingCardProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
}

export function LoadingCard({ isLoading, children, className }: LoadingCardProps) {
  return (
    <LoadingState 
      isLoading={isLoading}
      fallback={
        <div className={cn("border rounded-lg p-6", className)}>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>
      }
    >
      {children}
    </LoadingState>
  )
}
