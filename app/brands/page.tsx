'use client'

import Layout from '@/components/dashboard/Layout'
import { brandsAPI } from '@/lib/api'
import { Brand } from '@/types/types'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import Link from 'next/link'
import { Building, Edit2, MessageSquare, Plus, Search, ThumbsUp, Trash2 } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import CreateBrandModal from '@/components/brands/CreateBrandModal'
import EditBrandModal from '@/components/brands/EditBrandModal'

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    loadBrands()
  }, [])

  useEffect(() => {
    // Filter brands based on search term
    const filtered = brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBrands(filtered)
  }, [brands, searchTerm])

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

  const handleDelete = async (brand: Brand) => {
    setDeleteLoading(brand.id)
    try {
      await brandsAPI.deleteBrand(brand.id)
      setBrands(brands.filter((b) => b.id !== brand.id))
      toast.success('Brand deleted successfully')
    } catch (error) {
      console.error('Failed to delete brand:', error)
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <Layout>
      <div className='py-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8'>
          {/* Header */}
          <div className='md:flex md:items-center md:justify-between'>
            <div className='flex-1 min-w-0'>
              <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate'>
                Brands
              </h2>
              <p className='mt-1 text-sm text-gray-500'>
                Manage your brands and monitor AI responses
              </p>
            </div>
            <div className='mt-4 flex md:mt-0 md:ml-4'>
              <CreateBrandModal onBrandCreated={loadBrands} />
            </div>
          </div>

          {/* Search */}
          <div className='mt-6'>
            <div className='max-w-lg'>
              <div className='relative'>
                <Search className='h-5 w-5 text-gray-400 absolute left-3 top-3' />
                <input
                  type='text'
                  placeholder='Search brands...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                />
              </div>
            </div>
          </div>

          {/* Brands Grid */}
          <div className='mt-8'>
            {isLoading ? (
              <div className='flex justify-center py-12'>
                <LoadingSpinner size='lg' />
              </div>
            ) : filteredBrands.length === 0 ? (
              <div className='text-center py-12'>
                <Building className='mx-auto h-12 w-12 text-gray-400' />
                <h3 className='mt-2 text-sm font-medium text-gray-900'>
                  {searchTerm ? 'No brands found' : 'No brands'}
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Get started by adding your first brand to monitor.'}
                </p>
                {!searchTerm && (
                  <div className='mt-6'>
                    <CreateBrandModal onBrandCreated={loadBrands} />
                  </div>
                )}
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {filteredBrands.map((brand) => {
                  const positiveRate = brand.stats?.totalResponses
                    ? Math.round(
                        (brand.stats.positiveResponses /
                          brand.stats.totalResponses) *
                          100
                      )
                    : 0

                  return (
                    <div
                      key={brand.id}
                      className='bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200'
                    >
                      <div className='p-6'>
                        <div className='flex items-center justify-between'>
                          <h3 className='text-lg font-medium text-gray-900 truncate'>
                            {brand.name}
                          </h3>
                          <div className='flex items-center space-x-2'>
                            <EditBrandModal
                              brand={brand}
                              trigger={
                                <button className='text-gray-400 hover:text-gray-600'>
                                  <Edit2 className='h-4 w-4' />
                                </button>
                              }
                              onBrandUpdated={loadBrands}
                            />
                            <button
                              onClick={() => handleDelete(brand)}
                              disabled={deleteLoading === brand.id}
                              className='text-gray-400 hover:text-red-600 disabled:opacity-50'
                            >
                              {deleteLoading === brand.id ? (
                                <LoadingSpinner size='sm' />
                              ) : (
                                <Trash2 className='h-4 w-4' />
                              )}
                            </button>
                          </div>
                        </div>

                        {brand.description && (
                          <p className='mt-2 text-sm text-gray-500 line-clamp-3'>
                            {brand.description}
                          </p>
                        )}

                        {/* Stats */}
                        <div className='mt-4 grid grid-cols-3 gap-4'>
                          <div className='text-center'>
                            <div className='flex items-center justify-center'>
                              <MessageSquare className='h-4 w-4 text-gray-400 mr-1' />
                              <span className='text-sm font-medium text-gray-900'>
                                {brand.stats?.totalResponses || 0}
                              </span>
                            </div>
                            <p className='text-xs text-gray-500'>Responses</p>
                          </div>
                          <div className='text-center'>
                            <div className='flex items-center justify-center'>
                              <span className='text-sm font-medium text-green-600'>
                                {brand.stats?.positiveResponses || 0}
                              </span>
                              <ThumbsUp className='h-4 w-4 text-green-400 ml-1' />
                            </div>
                            <p className='text-xs text-gray-500'>Positive</p>
                          </div>
                          <div className='text-center'>
                            <div className='flex items-center justify-center'>
                              <span className='text-sm font-medium text-gray-900'>
                                {positiveRate}%
                              </span>
                            </div>
                            <p className='text-xs text-gray-500'>Rate</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className='mt-6'>
                          <Link
                            href={`/brands/${brand.id}`}
                            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                          >
                            View Responses
                          </Link>
                        </div>

                        <div className='mt-2 text-xs text-gray-500 text-center'>
                          Created{' '}
                          {format(new Date(brand.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BrandsPage
