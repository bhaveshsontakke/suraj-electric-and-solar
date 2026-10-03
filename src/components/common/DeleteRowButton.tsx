'use client'

import React, { useState, useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'

export interface DeleteRowButtonProps {
  id: string
  name?: string
  onDelete: (id: string) => Promise<any>
  confirmMessage?: string
  iconOnly?: boolean
  label?: string
  size?: 'sm' | 'md'
}

export default function DeleteRowButton({
  id,
  name,
  onDelete,
  confirmMessage,
  iconOnly = true,
  label = 'Delete',
  size = 'sm',
}: DeleteRowButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isConfirming, setIsConfirming] = useState(false)

  const defaultMsg = name
    ? `Delete ${name}? This action cannot be undone.`
    : 'Are you sure you want to delete this record? This action cannot be undone.'

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isConfirming) {
      setIsConfirming(true)
      return
    }

    startTransition(async () => {
      try {
        await onDelete(id)
      } catch (err: any) {
        alert(err?.message || 'Failed to delete record')
      } finally {
        setIsConfirming(false)
      }
    })
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsConfirming(false)
  }

  if (isConfirming) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#fef2f2',
          border: '1px solid #f87171',
          padding: '4px 8px',
          borderRadius: 8,
          fontSize: 12,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ color: '#b91c1c', fontWeight: 600 }}>Confirm?</span>
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 11,
            fontWeight: 700,
            cursor: isPending ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : 'Yes, Delete'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          style={{
            background: 'white',
            color: 'var(--gray-600)',
            border: '1px solid var(--gray-300)',
            borderRadius: 6,
            padding: '3px 6px',
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      title={name ? `Delete ${name}` : 'Delete this record'}
      aria-label="Delete"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        padding: iconOnly ? '6px' : '6px 10px',
        borderRadius: 8,
        border: '1px solid #fee2e2',
        background: '#fff5f5',
        color: '#dc2626',
        fontSize: size === 'sm' ? 12 : 13,
        fontWeight: 600,
        cursor: isPending ? 'wait' : 'pointer',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#fee2e2'
        e.currentTarget.style.color = '#b91c1c'
        e.currentTarget.style.borderColor = '#f87171'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#fff5f5'
        e.currentTarget.style.color = '#dc2626'
        e.currentTarget.style.borderColor = '#fee2e2'
      }}
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      {!iconOnly && <span>{label}</span>}
    </button>
  )
}
