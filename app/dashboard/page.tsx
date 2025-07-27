'use client'

import Layout from '@/components/dashboard/Layout'
import { brandsAPI } from '@/lib/api'
import { Brand } from '@/types/types'
import { Building, MessageSquare, Plus, ThumbsDown, ThumbsUp, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      const data = await brandsAPI.getAllBrands()
      setBrands(data)
    } catch (error) {
      console.error('Failed to load brands:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate overall stats
  const totalBrands = brands.length
  const totalResponses = brands.reduce(
    (sum, brand) => sum + (brand.stats?.totalResponses || 0),
    0
  )
  const totalPositive = brands.reduce(
    (sum, brand) => sum + (brand.stats?.positiveResponses || 0),
    0
  )
  const totalNegative = brands.reduce(
    (sum, brand) => sum + (brand.stats?.negativeResponses || 0),
    0
  )
  const positivePercentage =
    totalResponses > 0 ? Math.round((totalPositive / totalResponses) * 100) : 0

  return (
    <Layout>
      <div className='py-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8'>
          {/* Header */}
          <div className='md:flex md:items-center md:justify-between'>
            <div className='flex-1 min-w-0'>
              <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate'>
                Dashboard
              </h2>
              <p className='mt-1 text-sm text-gray-500'>
                Monitor how AI models represent your brands
              </p>
            </div>
            <div className='mt-4 flex md:mt-0 md:ml-4'>
              <Link
                href='/brands/new'
                className='ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Brand
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className='mt-8'>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='bg-white overflow-hidden shadow rounded-lg'>
                <div className='p-5'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <Building className='h-6 w-6 text-gray-400' />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 truncate'>
                          Total Brands
                        </dt>
                        <dd className='text-lg font-medium text-gray-900'>
                          {totalBrands}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-white overflow-hidden shadow rounded-lg'>
                <div className='p-5'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <MessageSquare className='h-6 w-6 text-gray-400' />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 truncate'>
                          Total Responses
                        </dt>
                        <dd className='text-lg font-medium text-gray-900'>
                          {totalResponses}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-white overflow-hidden shadow rounded-lg'>
                <div className='p-5'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <ThumbsUp className='h-6 w-6 text-green-400' />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 truncate'>
                          Positive Responses
                        </dt>
                        <dd className='text-lg font-medium text-gray-900'>
                          {totalPositive}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-white overflow-hidden shadow rounded-lg'>
                <div className='p-5'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <TrendingUp className='h-6 w-6 text-primary-400' />
                    </div>
                    <div className='ml-5 w-0 flex-1'>
                      <dl>
                        <dt className='text-sm font-medium text-gray-500 truncate'>
                          Positive Rate
                        </dt>
                        <dd className='text-lg font-medium text-gray-900'>
                          {positivePercentage}%
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brands List */}
          <div className='mt-8'>
            <div className='bg-white shadow overflow-hidden sm:rounded-md'>
              <div className='px-4 py-5 sm:px-6 border-b border-gray-200'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                  Your Brands
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                  Click on a brand to view and manage AI responses
                </p>
              </div>

              {isLoading ? (
                <div className='p-8 flex justify-center'>
                  {/* <LoadingSpinner size='lg' /> */}
                </div>
              ) : brands.length === 0 ? (
                <div className='p-8 text-center'>
                  <Building className='mx-auto h-12 w-12 text-gray-400' />
                  <h3 className='mt-2 text-sm font-medium text-gray-900'>
                    No brands
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Get started by adding your first brand to monitor.
                  </p>
                  <div className='mt-6'>
                    <Link
                      href='/brands/new'
                      className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add Brand
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className='divide-y divide-gray-200'>
                  {brands.map((brand) => (
                    <li key={brand.id}>
                      <Link
                        href={`/brands/${brand.id}`}
                        className='block hover:bg-gray-50 transition-colors duration-200'
                      >
                        <div className='px-4 py-4 sm:px-6'>
                          <div className='flex items-center justify-between'>
                            <div className='flex-1 min-w-0'>
                              <h4 className='text-lg font-medium text-primary-600 truncate'>
                                {brand.name}
                              </h4>
                              {brand.description && (
                                <p className='mt-1 text-sm text-gray-500 line-clamp-2'>
                                  {brand.description}
                                </p>
                              )}
                            </div>
                            <div className='ml-4 flex-shrink-0'>
                              <div className='flex items-center space-x-4 text-sm text-gray-500'>
                                <div className='flex items-center'>
                                  <MessageSquare className='h-4 w-4 mr-1' />
                                  {brand.stats?.totalResponses || 0}
                                </div>
                                <div className='flex items-center text-green-600'>
                                  <ThumbsUp className='h-4 w-4 mr-1' />
                                  {brand.stats?.positiveResponses || 0}
                                </div>
                                <div className='flex items-center text-red-600'>
                                  <ThumbsDown className='h-4 w-4 mr-1' />
                                  {brand.stats?.negativeResponses || 0}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
