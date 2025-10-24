'use client'
import { useMemo } from 'react'

export type Filters = {
  search: string
  minRating: number | null
  channel: string | 'all'
  since: string | 'all'
}

export function useFilter<T extends { overallRating: number | null; channel: string; submittedAt: string; text?: string | null; guestName?: string }>(
  items: T[],
  f: Filters
) {
  return useMemo(() => {
    return items.filter(it => {
      if (f.minRating && (it.overallRating ?? 0) < f.minRating) return false
      if (f.channel !== 'all' && it.channel !== f.channel) return false
      if (f.since !== 'all' && new Date(it.submittedAt) < new Date(f.since)) return false
      const q = f.search.trim().toLowerCase()
      if (q) {
        const hay = `${it.text ?? ''} ${it.guestName ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [items, f])
}
