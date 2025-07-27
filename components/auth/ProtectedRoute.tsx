'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      // Store the current path to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', pathname)
      router.push('/login')
    }
  }, [user, isLoading, router, pathname])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If no user and not loading, don't render anything (redirect will happen)
  if (!user) {
    return null
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}

export default ProtectedRoute