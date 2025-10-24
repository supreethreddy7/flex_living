import { ListingBucket, NormalizedReview } from './types'

export function computeMetricsForReviews(reviews: NormalizedReview[]): ListingBucket['metrics'] {
  const count = reviews.length
  if (!count) return { count: 0, avgOverall: null, avgByCategory: {}, lastReviewAt: null }
  const overall = reviews.map(r => r.overallRating).filter((x): x is number => typeof x === 'number')
  const avgOverall = overall.length ? parseFloat((overall.reduce((a,b)=>a+b,0)/overall.length).toFixed(2)) : null
  const catMap: Record<string, { sum: number; n: number }> = {}
  for (const r of reviews) {
    for (const [k, v] of Object.entries(r.categories)) {
      if (typeof v !== 'number') continue
      if (!catMap[k]) catMap[k] = { sum: 0, n: 0 }
      catMap[k].sum += v
      catMap[k].n += 1
    }
  }
  const avgByCategory = Object.fromEntries(Object.entries(catMap).map(([k, v]) => [k, parseFloat((v.sum / v.n).toFixed(2))])) as ListingBucket['metrics']['avgByCategory']
  const lastReviewAt = reviews.map(r => r.submittedAt).sort().at(-1) ?? null
  return { count, avgOverall, avgByCategory, lastReviewAt }
}
