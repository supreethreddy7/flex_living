import { NextRequest } from 'next/server'
import { normalizeHostaway } from '@/lib/normalize'
import mock from '@/data/hostaway-mock.json'
import { HostawayRawReview } from '@/lib/types'

export async function GET(req: NextRequest) {
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID || '61148'
  const apiKey = process.env.HOSTAWAY_API_KEY || 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152'
  const raw = (mock as any).result as HostawayRawReview[]
  const normalized = normalizeHostaway(raw)
  return Response.json(normalized, { status: 200 })
}
