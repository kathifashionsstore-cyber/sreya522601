import { Inbox } from 'lucide-react'

export function EmptyState({ title = 'Nothing here yet', message = 'Add content in the admin panel to publish it.' }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-brand-blush text-brand-rose">
        <Inbox className="size-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-brand-navy">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p>
    </div>
  )
}
