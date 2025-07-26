/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { LoginData, User } from '@/types/types'

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginData) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter()
    const pathname = usePathname()

    const checkAuth = async () => {
      try {
        const response = await authAPI.getMe()
        setUser(response.user)
      } catch (error) {
        setUser(null)
        // Only redirect to login if we're on a protected page
        if (pathname !== '/login' && pathname !== '/') {
          router.push('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    const login = async (data: LoginData) => {
        try {
            const response = await authAPI.login(data)
            setUser(response.user)
            toast.success('Login successful')
            router.push('/dashboard')
        } catch (error: any) {
            const message = error.response?.data?.error || 'Login failed'
            toast.error(message)
            throw error
        }
    }

    const logout = async () => {
        try {
            await authAPI.logout()
            setUser(null)
            toast.success('Logout successful')
            router.push('/login')
        } catch (error: any) {
          const message = error.response?.data?.error || 'Logout failed'
          toast.error(message)
          // Even if logout fails on server, clear local state
          setUser(null)
          router.push('/login')
          throw error
        }
    }

    useEffect(() => {
      checkAuth()
    }, [])

    const value = {
        user,
        isLoading,
        login,
        logout,
        checkAuth,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}