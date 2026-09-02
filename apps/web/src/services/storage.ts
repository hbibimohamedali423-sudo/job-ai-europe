import { supabase } from '@/lib/supabase'

const AVATAR_BUCKET = 'avatars'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export interface UploadResult {
  url: string | null
  error: string | null
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<UploadResult> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { url: null, error: 'File size must be less than 5MB' }
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: null, error: 'File type must be JPEG, PNG, GIF, or WebP' }
  }

  // Generate unique file name: userId/timestamp-filename
  const fileExt = file.name.split('.').pop() || 'jpg'
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  // Upload to storage
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { url: null, error: error.message }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(data.path)

  return { url: urlData.publicUrl, error: null }
}

export async function deleteAvatar(userId: string): Promise<{ error: string | null }> {
  // List all files in user's folder
  const { data: files, error: listError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId, { limit: 100 })

  if (listError) {
    return { error: listError.message }
  }

  if (!files || files.length === 0) {
    return { error: null } // Nothing to delete
  }

  // Delete all files in user's folder
  const filePaths = files.map((f) => `${userId}/${f.name}`)
  const { error: deleteError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .remove(filePaths)

  if (deleteError) {
    return { error: deleteError.message }
  }

  return { error: null }
}

export async function getAvatarUrl(userId: string): Promise<string | null> {
  // List files in user's folder
  const { data: files, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId, { limit: 1 })

  if (error || !files || files.length === 0) {
    return null
  }

  // Get the most recent file
  const sortedFiles = files.sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
    return bTime - aTime
  })

  const latestFile = sortedFiles[0]
  if (!latestFile.name) return null

  const { data } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(`${userId}/${latestFile.name}`)

  return data.publicUrl
}
