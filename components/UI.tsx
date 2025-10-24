import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="card p-4">{children}</div>
    </section>
  )
}
export function Spinner() {
  return <Loader2 className="animate-spin" />
}
