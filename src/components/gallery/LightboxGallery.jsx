import { useState } from 'react'
import { X } from 'lucide-react'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { gallery as fallbackGallery } from '../../data/seed'

export function LightboxGallery({ items: providedItems, limit, className = '' }) {
  const { data: dbGallery } = useFirestoreCollection('gallery', fallbackGallery)
  const sourceItems = providedItems || (dbGallery && dbGallery.length ? dbGallery : fallbackGallery)
  const images = sourceItems
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, limit || undefined)

  const [selected, setSelected] = useState(null)

  return (
    <>
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {images.map((item, idx) => (
          <button
            type="button"
            key={item.id || idx}
            className="group overflow-hidden rounded-lg bg-white text-left shadow-soft"
            onClick={() => setSelected(item)}
          >
            <img src={item.imageUrl} alt={item.altText || item.title} className="h-60 w-full object-cover transition group-hover:scale-105" loading="lazy" />
            <span className="block p-4 text-sm font-black text-brand-navy">{item.title}</span>
          </button>
        ))}
      </div>
      {selected ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-brand-ink/80 p-4">
          <button
            type="button"
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-lg bg-white text-brand-navy"
            onClick={() => setSelected(null)}
            aria-label="Close image"
          >
            <X className="size-5" />
          </button>
          <img src={selected.imageUrl} alt={selected.altText || selected.title} className="max-h-[85vh] max-w-[95vw] rounded-lg object-contain" />
        </div>
      ) : null}
    </>
  )
}
