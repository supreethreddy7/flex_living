export type HostawayCategory =
  | 'cleanliness'
  | 'communication'
  | 'respect_house_rules'
  | 'location'
  | 'accuracy'
  | 'value'

export interface HostawayRawReview {
  id: number
  type: 'host-to-guest' | 'guest-to-host'
  status: 'published' | 'unpublished'
  rating: number | null
  publicReview: string | null
  reviewCategory: { category: HostawayCategory; rating: number }[]
  submittedAt: string
  guestName?: string
  listingName: string
  listingId?: string | number
  channel?: 'airbnb' | 'booking' | 'direct' | 'expedia' | 'vrbo' | 'other'
}

export interface NormalizedReview {
  id: string
  source: 'hostaway' | 'google'
  channel: 'airbnb' | 'booking' | 'direct' | 'expedia' | 'vrbo' | 'other'
  listingId: string
  listingName: string
  type: 'host-to-guest' | 'guest-to-host'
  status: 'published' | 'unpublished'
  overallRating: number | null
  categories: Partial<Record<HostawayCategory, number>>
  submittedAt: string
  guestName?: string
  text: string | null
  approved?: boolean
}

export interface ListingBucket {
  listingId: string
  listingName: string
  source: 'hostaway'
  reviews: NormalizedReview[]
  metrics: {
    count: number
    avgOverall: number | null
    avgByCategory: Partial<Record<HostawayCategory, number>>
    lastReviewAt: string | null
  }
}

export interface HostawayNormalizedResponse {
  status: 'ok'
  generatedAt: string
  listings: ListingBucket[]
}
