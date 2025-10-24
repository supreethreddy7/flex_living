import { formatISO } from 'date-fns'
import { HostawayNormalizedResponse, HostawayRawReview, ListingBucket, NormalizedReview } from './types'
import { computeMetricsForReviews } from './metrics'

export function normalizeHostaway(raw: HostawayRawReview[]): HostawayNormalizedResponse {
  const dx: Record<string, ListingBucket> = {}
  for (const r of raw) {
    const listingId = String(r.listingId ?? r.listingName)
    const review: NormalizedReview = {
      id: String(r.id),
      source: 'hostaway',
      channel: (r.channel ?? 'other'),
      listingId,
      listingName: r.listingName,
      type: r.type,
      status: r.status,
      overallRating: r.rating,
      categories: Object.fromEntries((r.reviewCategory || []).map(rc => [rc.category, rc.rating])),
      submittedAt: new Date(r.submittedAt.replace(' ', 'T') + 'Z').toISOString(),
      guestName: r.guestName,
      text: r.publicReview,
      approved: false
    }
    if (!dx[listingId]) {
      dx[listingId] = {
        listingId,
        listingName: r.listingName,
        source: 'hostaway',
        reviews: [],
        metrics: { count: 0, avgOverall: null, avgByCategory: {}, lastReviewAt: null }
      }
    }
    dx[listingId].reviews.push(review)
  }
  const buckets = Object.values(dx)
  for (const b of buckets) b.metrics = computeMetricsForReviews(b.reviews)
  return {
    status: 'ok',
    generatedAt: formatISO(new Date()),
    listings: buckets.sort((a, b) => (b.metrics.avgOverall ?? 0) - (a.metrics.avgOverall ?? 0))
  }
}
