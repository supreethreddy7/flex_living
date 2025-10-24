'use client'
import { useState, useEffect } from 'react'
import { BadgeCheck, Star, User } from 'lucide-react'

export default function ReviewCard({
  id,
  guestName,
  text,
  overallRating,
  categories,
  submittedAt,
  approved,
  onToggle
}: any) {
  const [isApproved, setApproved] = useState<boolean>(approved ?? false)
  useEffect(() => setApproved(approved ?? false), [approved])
  const toggle = () => {
    const next = !isApproved
    setApproved(next)
    onToggle?.(id, next)
    try {
      const map = JSON.parse(localStorage.getItem('approvalMap') || '{}')
      map[id] = next
      localStorage.setItem('approvalMap', JSON.stringify(map))
    } catch {}
  }
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4" />
          <span className="font-medium">{guestName || 'Guest'}</span>
          <span className="text-black/50">• {new Date(submittedAt).toLocaleDateString()}</span>
        </div>
        <button className={`btn ${isApproved ? 'bg-green-50 border-green-200' : ''}`} onClick={toggle}>
          <BadgeCheck className="w-4 h-4" /> {isApproved ? 'Approved' : 'Approve for Website'}
        </button>
      </div>
      {text && <p className="text-sm leading-relaxed">{text}</p>}
      <div className="flex gap-3 items-center text-sm">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span className="font-medium">{overallRating ?? '—'}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(categories || {}).map(([k, v]) => (
            <span key={k} className="badge">{k.replaceAll('_',' ')}: {v as any}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
