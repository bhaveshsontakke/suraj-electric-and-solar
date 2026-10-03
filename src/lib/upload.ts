import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directories exist
export function ensureUploadDirs() {
  const dirs = [
    UPLOAD_DIR,
    path.join(UPLOAD_DIR, 'photos'),
    path.join(UPLOAD_DIR, 'documents'),
    path.join(UPLOAD_DIR, 'invoices'),
    path.join(UPLOAD_DIR, 'avatars'),
  ]
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

export async function saveFile(
  file: File,
  category: 'photos' | 'documents' | 'invoices' | 'avatars' = 'documents'
): Promise<{ url: string; filename: string; size: number; type: string }> {
  ensureUploadDirs()

  const ext = path.extname(file.name)
  const filename = `${uuidv4()}${ext}`
  const uploadPath = path.join(UPLOAD_DIR, category, filename)

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  fs.writeFileSync(uploadPath, buffer)

  return {
    url: `/uploads/${category}/${filename}`,
    filename: file.name,
    size: file.size,
    type: file.type,
  }
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

export const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function validateFile(
  file: File,
  allowedTypes: string[] = ALLOWED_IMAGE_TYPES
): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 10MB' }
  }
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' }
  }
  return { valid: true }
}

export function deleteFile(url: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', url)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('Failed to delete file:', error)
  }
}
