'use client'

import React, { useState, useTransition } from 'react'
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react'

export interface RemoveAllButtonProps {
  entityName: string // e.g. "Customers", "Materials", "Activity Logs"
  onRemoveAll: () => Promise<any>
  totalCount?: number
  label?: string
}

export default function RemoveAllButton({
  entityName,
  onRemoveAll,
  totalCount,
  label,
}: RemoveAllButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const isDisabled = typeof totalCount === 'number' && totalCount === 0

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await onRemoveAll()
        setIsOpen(false)
      } catch (err: any) {
        alert(err?.message || `Failed to remove all ${entityName}`)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isDisabled || isPending}
        title={isDisabled ? `No ${entityName} to remove` : `Remove all ${entityName}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          fontSize: 12.5,
          fontWeight: 700,
          borderRadius: 12,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.45 : 1,
          border: '1px solid #fca5a5',
          background: '#fff5f5',
          color: '#b91c1c',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.background = '#fee2e2'
            e.currentTarget.style.borderColor = '#ef4444'
            e.currentTarget.style.color = '#991b1b'
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.background = '#fff5f5'
            e.currentTarget.style.borderColor = '#fca5a5'
            e.currentTarget.style.color = '#b91c1c'
          }
        }}
      >
        <Trash2 size={14} />
        <span>{label || `Remove All (${totalCount ?? 0})`}</span>
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
          onClick={() => !isPending && setIsOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 18,
              padding: 28,
              maxWidth: 440,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Remove All {entityName}?
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, margin: 0 }}>
                  This will permanently delete {totalCount ? `all ${totalCount}` : 'all'} {entityName.toLowerCase()} and associated records.
                </p>
              </div>
            </div>

            <div
              style={{
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 12.5,
                color: '#9f1239',
                lineHeight: 1.5,
              }}
            >
              ⚠️ <strong>Warning:</strong> This bulk action is irreversible. All linked historical data will be cleared from the system.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                style={{
                  padding: '9px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                style={{
                  padding: '9px 18px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  cursor: isPending ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} /> Yes, Delete All
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
