'use client'
import useSWR from 'swr'
import { useMemo, useState } from 'react'
import { Section } from '@/components/UI'
import ReviewCard from '@/components/ReviewCard'
import TrendChart from '@/components/TrendChart'
import { useFilter, Filters } from '@/components/Filters'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function DashboardPage() {
  const { data } = useSWR('/api/reviews/hostaway', fetcher)
  const [filters, setFilters] = useState<Filters>({ search: '', minRating: null, channel: 'all', since: 'all' })
  const allReviews = useMemo(() => {
    if (!data) return []
    return data.listings.flatMap((l: any) => l.reviews)
  }, [data])
  const enriched = useMemo(() => {
    let map: Record<string, boolean> = {}
    try { map = JSON.parse(localStorage.getItem('approvalMap') || '{}') } catch {}
    return allReviews.map((r: any) => ({ ...r, approved: map[r.id] ?? r.approved }))
  }, [allReviews])
  const filtered = useFilter(enriched, filters)
  const trend = useMemo(() => {
    const buckets: Record<string, number[]> = {}
    for (const r of filtered) {
      if (typeof r.overallRating !== 'number') continue
      const k = new Date(r.submittedAt).toISOString().slice(0, 7)
      if (!buckets[k]) buckets[k] = []
      buckets[k].push(r.overallRating)
    }
    return Object.keys(buckets).sort().map(k => ({ date: k, avg: parseFloat((buckets[k].reduce((a,b)=>a+b,0)/buckets[k].length).toFixed(2)) }))
  }, [filtered])
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manager Dashboard</h1>
      <Section title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="input" placeholder="Search text/guest" value={filters.search} onChange={e=>setFilters(f=>({...f, search: e.target.value}))} />
          <select className="input" value={filters.minRating ?? ''} onChange={e=>setFilters(f=>({...f, minRating: e.target.value? Number(e.target.value): null}))}>
            <option value="">Min rating</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <select className="input" value={filters.channel} onChange={e=>setFilters(f=>({...f, channel: e.target.value as any}))}>
            <option value="all">All channels</option>
            <option value="airbnb">Airbnb</option>
            <option value="booking">Booking</option>
            <option value="direct">Direct</option>
          </select>
          <select className="input" value={filters.since} onChange={e=>setFilters(f=>({...f, since: e.target.value as any}))}>
            <option value="all">Any time</option>
            <option value="2024-01-01">Since 2024</option>
            <option value="2023-01-01">Since 2023</option>
          </select>
        </div>
      </Section>
      <Section title="Portfolio Snapshot">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.listings?.map((l: any) => (
            <div key={l.listingId} className="card p-4">
              <div className="font-semibold">{l.listingName}</div>
              <div className="text-sm text-black/70 mt-1">Avg rating: <b>{l.metrics.avgOverall ?? '—'}</b> ({l.metrics.count} reviews)</div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {Object.entries(l.metrics.avgByCategory || {}).map(([k, v]: any) => (
                  <span key={k} className="badge">{k.replaceAll('_',' ')}: {v}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Trend (avg monthly rating)">
        <TrendChart data={trend} />
      </Section>
      <Section title={`Reviews (${filtered.length})`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r: any) => (
            <ReviewCard key={r.id} {...r} onToggle={() => {}} />
          ))}
        </div>
      </Section>
    </div>
  )
}
