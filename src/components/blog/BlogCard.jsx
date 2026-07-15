import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays } from 'lucide-react'

export function BlogCard({ post }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-soft">
      <img src={post.coverImageUrl} alt={post.title} className="h-56 w-full object-cover" loading="lazy" />
      <div className="p-5">
        <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500">
          <span className="rounded-full bg-brand-blush px-3 py-1 text-brand-rose">{post.category}</span>
          <span className="inline-flex items-center gap-1"><CalendarDays className="size-3" /> {post.date}</span>
          <span>{post.readTime}</span>
        </div>
        <h2 className="mt-4 text-xl font-black text-brand-navy">{post.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
        <Link to={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-teal">
          Read article <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  )
}
