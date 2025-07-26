import { Brain, ArrowRight, BarChart3, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-white'>
      {/* Header */}
      <header className='relative'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center space-x-2'>
              <Brain className='h-8 w-8 text-primary-600' />
              <span className='text-2xl font-bold text-gray-900'>
                Model Monitor
              </span>
            </div>
            <Link
              href='/login'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
    </div>
  )
}
