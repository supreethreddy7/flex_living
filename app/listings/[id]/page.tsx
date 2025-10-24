'use client'
import useSWR from 'swr'
import Image from 'next/image'

const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function ListingPage({ params }: { params: { id: string } }) {
  const { data } = useSWR('/api/reviews/hostaway', fetcher)
  let map: Record<string, boolean> = {}
  if (typeof window !== 'undefined') {
    try { map = JSON.parse(localStorage.getItem('approvalMap') || '{}') } catch {}
  }
  const listing = data?.listings.find((l: any) => l.listingId === params.id)
  const approved = (listing?.reviews || []).filter((r: any) => map[r.id])
  return (
    <div className="space-y-6">
      <div className="relative h-64 w-full overflow-hidden rounded-2xl">
        <Image src="/hero.jpg" alt="Property" fill className="object-cover" />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{listing?.listingName || 'Property'}</h1>
          <p className="text-black/60">Book Beautiful Stays</p>
        </div>
        <a href="/dashboard" className="btn">Go to Dashboard</a>
      </div>
      {approved.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Guest Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approved.map((r: any) => (
              <div key={r.id} className="card p-4">
                <div className="text-sm text-black/60">{new Date(r.submittedAt).toLocaleDateString()}</div>
                <p className="mt-1">{r.text}</p>
                <div className="mt-2 text-sm">Rating: <b>{r.overallRating ?? '—'}</b></div>
              </div>
            ))}
          </div>
        </section>
      )}
      {approved.length === 0 && (
        <div className="card p-6 text-black/60">No reviews have been approved for display yet.</div>
      )}
    </div>
  )
}
