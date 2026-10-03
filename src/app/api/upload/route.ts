import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Validate type: JPG, PNG, WEBP, GIF, AVIF, BMP, SVG
    const validMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/avif',
      'image/bmp',
      'image/svg+xml',
    ]
    const hasValidExt = /\.(jpe?g|png|webp|gif|avif|bmp|svg)$/i.test(file.name)

    if (!validMimes.includes(file.type) && !hasValidExt) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file format. Please upload JPG, PNG, WEBP, or GIF.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Clean filename and create unique timestamped name
    const ext = path.extname(file.name) || '.jpg'
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30)
    const fileName = `site_${Date.now()}_${baseName}${ext}`
    const filePath = path.join(uploadsDir, fileName)

    await writeFile(filePath, buffer)

    const publicUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
      mimeType: file.type || 'image/jpeg',
    })
  } catch (err: any) {
    console.error('File upload error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'File upload failed' },
      { status: 500 }
    )
  }
}
