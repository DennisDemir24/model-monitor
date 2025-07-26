/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

import { Brain, LogOut, Menu, X, BarChart3, Building } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      current: pathname === '/dashboard',
    },
    {
      name: 'Brands',
      href: '/brands',
      icon: Building,
      current: pathname.startsWith('/brands'),
    },
  ]

  return (
    <div className='h-screen flex overflow-hidden bg-gray-100'>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? '' : 'hidden'
        }`}
      >
        <div
          className='fixed inset-0 bg-gray-600 bg-opacity-75'
          onClick={() => setSidebarOpen(false)}
        />
        <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white'>
          <div className='absolute top-0 right-0 -mr-12 pt-2'>
            <button
              className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
              onClick={() => setSidebarOpen(false)}
            >
              <X className='h-6 w-6 text-white' />
            </button>
          </div>
          <SidebarContent navigation={navigation} user={user} logout={logout} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className='hidden md:flex md:flex-shrink-0'>
        <div className='flex flex-col w-64'>
          <SidebarContent navigation={navigation} user={user} logout={logout} />
        </div>
      </div>

      {/* Main content */}
      <div className='flex flex-col w-0 flex-1 overflow-hidden'>
        <div className='md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3'>
          <button
            className='-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500'
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className='h-6 w-6' />
          </button>
        </div>
        <main className='flex-1 relative overflow-y-auto focus:outline-none'>
          {children}
        </main>
      </div>
    </div>
  )
}

interface SidebarContentProps {
  navigation: Array<{
    name: string
    href: string
    icon: any
    current: boolean
  }>
  user: any
  logout: () => void
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  navigation,
  user,
  logout,
}) => {
  return (
    <div className='flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white'>
      <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
        <div className='flex items-center flex-shrink-0 px-4'>
          <Brain className='h-8 w-8 text-primary-600' />
          <span className='ml-2 text-xl font-bold text-gray-900'>
            Model Monitor
          </span>
        </div>
        <nav className='mt-5 flex-1 px-2 space-y-1'>
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
              >
                <Icon
                  className={`${
                    item.current
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 flex-shrink-0 h-6 w-6`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className='flex-shrink-0 flex border-t border-gray-200 p-4'>
        <div className='flex-shrink-0 w-full group block'>
          <div className='flex items-center'>
            <div className='ml-3 flex-1'>
              <p className='text-sm font-medium text-gray-700 group-hover:text-gray-900'>
                {user?.email}
              </p>
              <button
                onClick={logout}
                className='flex items-center text-xs font-medium text-gray-500 group-hover:text-gray-700 mt-1'
              >
                <LogOut className='h-4 w-4 mr-1' />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
