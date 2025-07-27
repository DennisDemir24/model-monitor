'use client'

import { useState } from 'react'
import { Response } from '@/types/types'
import { responsesAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface ResponseCardProps {
  response: Response
  onRatingChanged?: () => void
}

export default function ResponseCard({
  response,
  onRatingChanged,
}: ResponseCardProps) {
  const [ratingLoading, setRatingLoading] = useState(false)

  const handleRate = async (value: boolean) => {
    setRatingLoading(true)
    try {
      await responsesAPI.rate(response.id, value)
      toast.success(
        value ? 'Response rated positively' : 'Response rated negatively'
      )
      onRatingChanged?.()
    } catch (error) {
      console.error('Failed to rate response:', error)
      // Error toast is handled by API interceptor
    } finally {
      setRatingLoading(false)
    }
  }

  const handleRemoveRating = async () => {
    if (!response.rating) return

    setRatingLoading(true)
    try {
      await responsesAPI.removeRating(response.id)
      toast.success('Rating removed')
      onRatingChanged?.()
    } catch (error) {
      console.error('Failed to remove rating:', error)
      // Error toast is handled by API interceptor
    } finally {
      setRatingLoading(false)
    }
  }

  const getRatingColor = () => {
    if (!response.rating) return 'text-gray-400'
    return response.rating.value ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'>
      <div className='space-y-4'>
        {/* Response Text */}
        <div>
          <p className='text-gray-900 whitespace-pre-wrap leading-relaxed'>
            {response.text}
          </p>
        </div>

        {/* Metadata */}
        <div className='flex items-center justify-between text-sm text-gray-500'>
          <span>
            Generated{' '}
            {format(new Date(response.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </span>

          {/* Rating Status */}
          {response.rating && (
            <span className={`font-medium ${getRatingColor()}`}>
              {response.rating.value
                ? '👍 Rated Positive'
                : '👎 Rated Negative'}
            </span>
          )}
        </div>

        {/* Rating Actions */}
        <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleRate(true)}
              disabled={ratingLoading || response.rating?.value === true}
              className={`${
                response.rating?.value === true
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : ''
              }`}
            >
              {ratingLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <ThumbsUp className='h-4 w-4' />
              )}
              <span className='ml-1'>Good</span>
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={() => handleRate(false)}
              disabled={ratingLoading || response.rating?.value === false}
              className={`${
                response.rating?.value === false
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : ''
              }`}
            >
              {ratingLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <ThumbsDown className='h-4 w-4' />
              )}
              <span className='ml-1'>Bad</span>
            </Button>
          </div>

          {/* Remove Rating Button */}
          {response.rating && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleRemoveRating}
              disabled={ratingLoading}
              className='text-gray-500 hover:text-gray-700'
            >
              Remove Rating
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
