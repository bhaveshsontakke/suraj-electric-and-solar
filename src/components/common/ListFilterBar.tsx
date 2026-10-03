'use client'

import React, { useState, useEffect, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X, RotateCcw, Filter, Plus } from 'lucide-react'
import Link from 'next/link'

export interface FilterOption {
  key: string
  label: string
  count?: number
}

export interface ListFilterBarProps {
  /** The clean base URL for this list (e.g., '/dashboard/customers') */
  basePath: string
  /** Placeholder for the search input */
  searchPlaceholder?: string
  /** Name of the URL query param for the filter (default: 'status') */
  filterParamName?: string
  /** Filter pill options to display */
  filterOptions?: FilterOption[]
  /** Currently active filter value */
  currentFilter?: string
  /** Current search query string */
  currentSearch?: string
  /** Total count of items */
  totalCount?: number
  /** Primary action button at the top right */
  actionButton?: {
    label: string
    href: string
    icon?: React.ReactNode
  }
  /** Additional custom action buttons/links */
  extraActions?: React.ReactNode
}

function ListFilterBarContent(props: ListFilterBarProps) {
  const {
    basePath,
    searchPlaceholder = 'Search records...',
    filterParamName = 'status',
    filterOptions,
    currentFilter,
    currentSearch = '',
    totalCount,
    actionButton,
    extraActions,
  } = props

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for immediate typing feedback
  const [searchValue, setSearchValue] = useState(currentSearch)

  // Sync state if URL search query changes externally
  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  // Determine active filter: either explicitly passed or from searchParams
  const activeFilter = currentFilter || searchParams.get(filterParamName) || 'ALL'
  const isSearchActive = Boolean(searchValue && searchValue.trim().length > 0)
  const isFilterActive = activeFilter !== 'ALL' && Boolean(activeFilter)
  const hasActiveFilters = isSearchActive || isFilterActive

  // Count active filters
  const activeFilterCount = (isSearchActive ? 1 : 0) + (isFilterActive ? 1 : 0)

  // Helper to push updated query parameters
  const applyFilter = (newFilter: string, newSearch: string) => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (newFilter && newFilter !== 'ALL') {
        params.set(filterParamName, newFilter)
      }
      if (newSearch && newSearch.trim().length > 0) {
        params.set('search', newSearch.trim())
      }
      const qs = params.toString()
      router.push(qs ? `${basePath}?${qs}` : basePath)
    })
  }

  // Handle Search Input Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilter(activeFilter, searchValue)
  }

  // Clear button click handler - resets everything back to base URL
  const handleClearAll = () => {
    setSearchValue('')
    startTransition(() => {
      router.push(basePath)
    })
  }

  // Clear only search text
  const handleClearSearchOnly = () => {
    setSearchValue('')
    applyFilter(activeFilter, '')
  }

  return (
    <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top Row: Search Input + Clear Button + Action CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Left Side: Search Bar & Clear Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 360px', maxWidth: 640 }}>
          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 14,
                color: isSearchActive ? 'var(--navy)' : 'var(--gray-400)',
                pointerEvents: 'none',
                transition: 'color 0.2s',
              }}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  applyFilter(activeFilter, searchValue)
                }
              }}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                padding: '10px 40px 10px 42px',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--gray-900)',
                background: 'white',
                border: isSearchActive ? '1.5px solid var(--navy)' : '1px solid var(--gray-200)',
                borderRadius: 12,
                outline: 'none',
                boxShadow: isSearchActive ? '0 0 0 3px rgba(17,34,64,0.08)' : '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
              }}
            />
            {/* Inline Quick Clear X inside input */}
            {searchValue ? (
              <button
                type="button"
                onClick={handleClearSearchOnly}
                title="Clear search text"
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: 12,
                  background: 'var(--gray-100)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--gray-600)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2'
                  e.currentTarget.style.color = '#dc2626'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--gray-100)'
                  e.currentTarget.style.color = 'var(--gray-600)'
                }}
              >
                <X size={13} />
              </button>
            ) : null}
          </form>

          {/* Dedicated CLEAR BUTTON on Top Side */}
          <button
            type="button"
            onClick={handleClearAll}
            title={hasActiveFilters ? 'Clear all search queries and active filters' : 'Reset list view'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 14px',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 12,
              cursor: 'pointer',
              border: hasActiveFilters ? '1.5px solid #f87171' : '1px solid var(--gray-200)',
              background: hasActiveFilters ? '#fff5f5' : 'white',
              color: hasActiveFilters ? '#dc2626' : 'var(--gray-600)',
              boxShadow: hasActiveFilters ? '0 2px 6px rgba(220,38,38,0.12)' : '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2'
              e.currentTarget.style.color = '#b91c1c'
              e.currentTarget.style.borderColor = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = hasActiveFilters ? '#fff5f5' : 'white'
              e.currentTarget.style.color = hasActiveFilters ? '#dc2626' : 'var(--gray-600)'
              e.currentTarget.style.borderColor = hasActiveFilters ? '#f87171' : 'var(--gray-200)'
            }}
          >
            <RotateCcw size={14} style={{ transition: 'transform 0.3s' }} />
            <span>Clear{hasActiveFilters ? ` (${activeFilterCount})` : ''}</span>
          </button>
        </div>

        {/* Right Side: Extra Actions & Primary Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {extraActions}

          {actionButton && (
            <Link
              href={actionButton.href}
              className="btn btn-primary"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 13,
                fontWeight: 700,
                padding: '9px 16px',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(17,34,64,0.15)',
              }}
            >
              {actionButton.icon || <Plus size={16} />}
              <span>{actionButton.label}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Row: Filter Pills (if any options provided) */}
      {filterOptions && filterOptions.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              maxWidth: '100%',
            }}
          >
            {filterOptions.map((opt) => {
              const isSelected = activeFilter === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => applyFilter(opt.key, searchValue)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 12.5,
                    fontWeight: isSelected ? 700 : 600,
                    background: isSelected ? 'var(--navy)' : 'white',
                    color: isSelected ? 'white' : 'var(--gray-600)',
                    border: isSelected ? '1px solid var(--navy)' : '1px solid var(--gray-200)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 6px rgba(17,34,64,0.18)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'var(--gray-50)'
                      e.currentTarget.style.color = 'var(--gray-900)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.color = 'var(--gray-600)'
                    }
                  }}
                >
                  <span>{opt.label}</span>
                  {typeof opt.count === 'number' && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: '1px 6px',
                        borderRadius: 10,
                        background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--gray-100)',
                        color: isSelected ? 'white' : 'var(--gray-600)',
                        fontWeight: 700,
                      }}
                    >
                      {opt.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Active Status Badge if filtered */}
          {hasActiveFilters && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: 'var(--gray-500)',
                background: 'var(--gray-50)',
                padding: '4px 10px',
                borderRadius: 8,
                border: '1px solid var(--gray-200)',
              }}
            >
              <span>Filter active:</span>
              <strong style={{ color: 'var(--navy)' }}>
                {isSearchActive && `"${searchValue}"`}
                {isSearchActive && isFilterActive && ' • '}
                {isFilterActive && activeFilter.replace(/_/g, ' ')}
              </strong>
              <button
                type="button"
                onClick={handleClearAll}
                title="Reset"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                  marginLeft: 2,
                }}
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ListFilterBar(props: ListFilterBarProps) {
  return (
    <Suspense
      fallback={
        <div style={{ height: 50, background: 'var(--gray-50)', borderRadius: 12, marginBottom: 20 }} />
      }
    >
      <ListFilterBarContent {...props} />
    </Suspense>
  )
}
