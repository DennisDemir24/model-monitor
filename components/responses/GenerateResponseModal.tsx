'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { brandsAPI } from '@/lib/api'
import { Response } from '@/types/types'
import { MessageSquare, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface GenerateResponseModalProps {
  brandId: string
  brandName: string
  onResponseGenerated?: (response: Response) => void
  trigger?: React.ReactNode
}

export default function GenerateResponseModal({
  brandId,
  brandName,
  onResponseGenerated,
  trigger,
}: GenerateResponseModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatedResponse, setGeneratedResponse] = useState<Response | null>(
    null
  )

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const generatedResponse = await brandsAPI.generateResponse(brandId) as unknown as Response;
      setGeneratedResponse(generatedResponse)
      toast.success('Response generated successfully')
      onResponseGenerated?.(generatedResponse)
    } catch (error) {
      console.error('Failed to generate response:', error)
      // Error toast is handled by API interceptor
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen)
      if (!newOpen) {
        setGeneratedResponse(null)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <MessageSquare className='h-4 w-4 mr-2' />
            Generate Response
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Generate AI Response for {brandName}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {!generatedResponse ? (
            <div className='text-center py-8'>
              <MessageSquare className='mx-auto h-12 w-12 text-gray-400 mb-4' />
              <p className='text-gray-600 mb-6'>
                Generate a new AI response to see how AI models represent your
                brand.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className='w-full'
              >
                {loading ? (
                  <>
                    <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    Generating...
                  </>
                ) : (
                  'Generate Response'
                )}
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>
                  Generated Response:
                </h4>
                <p className='text-gray-700 whitespace-pre-wrap'>
                  {generatedResponse.text}
                </p>
              </div>

              <div className='flex justify-end space-x-2'>
                <Button variant='outline' onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setGeneratedResponse(null)
                    handleGenerate()
                  }}
                  disabled={loading}
                >
                  Generate Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
