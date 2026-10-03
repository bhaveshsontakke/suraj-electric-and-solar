'use client'

import React, { useState, useRef } from 'react'
import { UploadCloud, CheckCircle2, AlertCircle, X, Image as ImageIcon, Link as LinkIcon, RefreshCw } from 'lucide-react'

export interface ImageUploadInputProps {
  name?: string // defaults to 'photoUrl'
  label?: string
  initialUrl?: string
  required?: boolean
  helpText?: string
}

export default function ImageUploadInput({
  name = 'photoUrl',
  label = 'Site Installation Photo',
  initialUrl = '',
  required = false,
  helpText = 'Upload photos of installed panels, structure, inverter, or meter (JPG, PNG, WEBP, GIF).',
}: ImageUploadInputProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl)
  const [fileName, setFileName] = useState<string>('')
  const [fileSize, setFileSize] = useState<string>('')
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<string>('')
  const [showUrlMode, setShowUrlMode] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFileProcess = async (file: File) => {
    setUploadError('')
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/bmp']
    const hasValidExt = /\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(file.name)

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setUploadError('Invalid format. Please select a JPG, PNG, WEBP, or GIF image.')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File is too large. Maximum allowed size is 15MB.')
      return
    }

    setFileName(file.name)
    setFileSize(formatSize(file.size))
    setIsUploading(true)

    // Create an immediate local preview
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        // Temporary preview while uploading
        setCurrentUrl(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.url) {
        setCurrentUrl(data.url)
        setIsUploading(false)
      } else {
        // Fallback: keep base64 DataURL if API had an issue
        console.warn('API upload response:', data)
        setIsUploading(false)
      }
    } catch (err: any) {
      console.warn('Network upload failed, preserving base64 fallback:', err)
      setIsUploading(false)
    }
  }

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileProcess(file)
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileProcess(file)
    }
  }

  const handleClear = () => {
    setCurrentUrl('')
    setFileName('')
    setFileSize('')
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFormatBadge = (urlOrName: string) => {
    const ext = urlOrName.split('.').pop()?.toUpperCase() || ''
    if (['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'AVIF', 'BMP'].includes(ext)) {
      return ext === 'JPEG' ? 'JPG' : ext
    }
    return 'IMAGE'
  }

  return (
    <div className="form-group" style={{ marginBottom: 20 }}>
      {/* Hidden input storing URL for Form submission */}
      <input type="hidden" name={name} value={currentUrl} required={required} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label className="form-label" style={{ fontWeight: 700, margin: 0 }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlMode(!showUrlMode)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary-color, #0070f3)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: 0,
          }}
        >
          <LinkIcon size={12} /> {showUrlMode ? 'Switch to File Upload' : 'Or paste URL'}
        </button>
      </div>

      {showUrlMode ? (
        <div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or https://..."
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            {currentUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-outline btn-sm"
                title="Clear"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <span style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4, display: 'block' }}>
            Paste any direct image link or switch back to upload directly from your device.
          </span>
        </div>
      ) : (
        <div>
          {/* Hidden File Input accepting JPG, PNG, WEBP, GIF, AVIF, BMP */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/bmp,.jpg,.jpeg,.png,.webp,.gif,.avif,.bmp"
            onChange={onFileInputChange}
            style={{ display: 'none' }}
          />

          {!currentUrl ? (
            /* Upload Dropzone */
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              style={{
                border: isDragOver ? '2px dashed #0070f3' : '2px dashed #cbd5e1',
                borderRadius: 14,
                padding: '28px 20px',
                textAlign: 'center',
                background: isDragOver ? 'rgba(0, 112, 243, 0.05)' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(0, 112, 243, 0.1)',
                  color: '#0070f3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <UploadCloud size={28} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900, #0f172a)' }}>
                Click to browse or drag &amp; drop photo here
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray-500, #64748b)', marginTop: 4 }}>
                Supports <strong style={{ color: '#0f172a' }}>JPG, PNG, WEBP, GIF, AVIF</strong> (up to 15MB)
              </div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 6 }}>
                {['JPG', 'PNG', 'WEBP', 'GIF'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#475569',
                    }}
                  >
                    .{tag.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* Preview Card with Image and Metadata */
            <div
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: 14,
                padding: 14,
                background: '#ffffff',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 10,
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                }}
              >
                <img
                  src={currentUrl}
                  alt="Site preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span
                    style={{
                      background: 'rgba(34, 197, 94, 0.12)',
                      color: '#16a34a',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={13} /> {getFormatBadge(fileName || currentUrl)} Ready
                  </span>
                  {isUploading && (
                    <span style={{ fontSize: 11, color: '#f5a623', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <RefreshCw size={11} className="spin" /> Uploading...
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={fileName || currentUrl}
                >
                  {fileName || 'Installed Site Photo'}
                </div>

                {fileSize && (
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    File Size: <strong>{fileSize}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#0f172a',
                      cursor: 'pointer',
                    }}
                  >
                    Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 8px',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          {uploadError && (
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: '#dc2626',
                background: '#fef2f2',
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #fecaca',
              }}
            >
              <AlertCircle size={14} /> {uploadError}
            </div>
          )}

          <span style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 6, display: 'block' }}>
            {helpText}
          </span>
        </div>
      )}
    </div>
  )
}
