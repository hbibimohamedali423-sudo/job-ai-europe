import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { uploadAvatar, deleteAvatar } from '@/services/storage'

interface ProfilePhotoUploadProps {
  userId: string
  currentAvatarUrl: string | null
  onUploadComplete: (url: string) => void
  onDeleteComplete: () => void
}

export function ProfilePhotoUpload({
  userId,
  currentAvatarUrl,
  onUploadComplete,
  onDeleteComplete,
}: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const result = await uploadAvatar(userId, file)

    if (result.error) {
      setError(result.error)
      setUploading(false)
    } else if (result.url) {
      onUploadComplete(result.url)
      setUploading(false)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your profile photo?')) {
      return
    }

    setDeleting(true)
    setError(null)

    const result = await deleteAvatar(userId)

    if (result.error) {
      setError(result.error)
      setDeleting(false)
    } else {
      onDeleteComplete()
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border-4 border-neutral-200"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-neutral-100 border-4 border-neutral-200">
            <svg
              className="h-16 w-16 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          id="avatar-upload"
        />
        <label
          htmlFor="avatar-upload"
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${(uploading || deleting) ? 'opacity-50' : ''}`}
        >
          {uploading ? '...' : currentAvatarUrl ? 'Replace' : 'Upload'}
        </label>

        {currentAvatarUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={uploading || deleting}
          >
            {deleting ? '...' : 'Delete'}
          </Button>
        )}
      </div>

      <p className="text-xs text-neutral-500">
        JPG, PNG, GIF, or WebP. Max 5MB.
      </p>
    </div>
  )
}
