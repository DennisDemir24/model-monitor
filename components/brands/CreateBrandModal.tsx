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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { brandsAPI } from '@/lib/api'
import { CreateBrandData } from '@/types/types'
import { Plus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface CreateBrandModalProps {
  onBrandCreated?: () => void
  trigger?: React.ReactNode
}

export default function CreateBrandModal({
  onBrandCreated,
  trigger,
}: CreateBrandModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateBrandData>({
    name: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Brand name is required')
      return
    }

    setLoading(true)
    try {
      await brandsAPI.createBrand({
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      })

      toast.success('Brand created successfully')
      setOpen(false)
      setFormData({ name: '', description: '' })
      onBrandCreated?.()
    } catch (error) {
      console.error('Failed to create brand:', error)
      // Error toast is handled by API interceptor
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen)
      if (!newOpen) {
        setFormData({ name: '', description: '' })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className='h-4 w-4 mr-2' />
            Add Brand
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create New Brand</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Brand Name *</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder='Enter brand name'
              disabled={loading}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder='Enter brand description (optional)'
              disabled={loading}
              rows={3}
            />
          </div>
          <div className='flex justify-end space-x-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Creating...
                </>
              ) : (
                'Create Brand'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
