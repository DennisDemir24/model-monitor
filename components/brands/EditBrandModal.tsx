'use client'

import { useState, useEffect } from 'react'
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
import { Brand } from '@/types/types'
import { Loader2, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'

interface EditBrandModalProps {
  brand: Brand
  onBrandUpdated?: (updated: Brand) => void
  trigger?: React.ReactNode
}

export default function EditBrandModal({
  brand,
  onBrandUpdated,
  trigger,
}: EditBrandModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: brand.name,
    description: brand.description || '',
  })

  // Reset form when brand or modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: brand.name,
        description: brand.description || '',
      })
    }
  }, [brand, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Brand name is required')
      return
    }
    setLoading(true)
    try {
      const updated = await brandsAPI.updateBrand(brand.id, {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      })
      toast.success('Brand updated successfully')
      setOpen(false)
      onBrandUpdated?.(updated)
    } catch (error) {
      // Error toast handled by API interceptor
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' size='sm'>
            <Pencil className='h-4 w-4 mr-2' />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
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
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
