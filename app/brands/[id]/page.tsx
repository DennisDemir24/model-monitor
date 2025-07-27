'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/dashboard/Layout'
import { brandsAPI, responsesAPI } from '@/lib/api'
import { Brand, Response } from '@/types/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MessageSquare, Plus, ThumbsUp, ThumbsDown } from 'lucide-react'
import GenerateResponseModal from '@/components/responses/GenerateResponseModal'
import ResponseCard from '@/components/responses/ResponseCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function BrandResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = params.id as string

  const [brand, setBrand] = useState<Brand | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (brandId) {
      loadBrandAndResponses()
    }
  }, [brandId])

  const loadBrandAndResponses = async () => {
    try {
      const [brandData, responsesData] = await Promise.all([
        brandsAPI.getBrandById(brandId),
        // You might need to add a getResponsesByBrandId API method
        // For now, assuming responses come with the brand
        brandsAPI.getBrandById(brandId)
      ])
      
      setBrand(brandData)
      setResponses(brandData.responses || [])
    } catch (error) {
      console.error('Failed to load brand and responses:', error)
      toast.error('Failed to load brand data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResponseGenerated = (newResponse: Response) => {
    setResponses(prev => [newResponse, ...prev])
    // Refresh brand stats
    loadBrandAndResponses()
  }

  const handleRatingChanged = () => {
    // Refresh brand stats
    loadBrandAndResponses()
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (!brand) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Brand not found</h2>
          <Button 
            onClick={() => router.push('/brands')}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brands
          </Button>
        </div>
      </Layout>
    )
  }

  const positiveResponses = responses.filter(r => r.rating?.value === true).length
  const negativeResponses = responses.filter(r => r.rating?.value === false).length
  const unratedResponses = responses.filter(r => !r.rating).length

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/brands')}
                  className="p-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    {brand.name}
                  </h2>
                  {brand.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {brand.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <GenerateResponseModal
                brandId={brand.id}
                brandName={brand.name}
                onResponseGenerated={handleResponseGenerated}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Responses
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {responses.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <ThumbsUp className="h-6 w-6 text-green-400" />
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Positive
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {positiveResponses}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <ThumbsDown className="h-6 w-6 text-red-400" />
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Negative
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {negativeResponses}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Unrated
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {unratedResponses}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
       
          {/* Responses List */}
          <div className="mt-8 space-y-6">
            {responses.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No responses yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate a new response to see how AI models represent your brand.
                </p>
                <div className="mt-6 flex justify-center">
                  <GenerateResponseModal
                    brandId={brand.id}
                    brandName={brand.name}
                    onResponseGenerated={handleResponseGenerated}
                  />
                </div>
              </div>
            ) : (
              responses.map((response) => (
                <ResponseCard
                  key={response.id}
                  response={response}
                  onRatingChanged={handleRatingChanged}
                />
              ))
            )}
          </div>
        </div>
      </div>
      </div>
    </Layout>
  )
}