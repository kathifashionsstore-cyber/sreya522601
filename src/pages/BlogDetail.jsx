import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Seo } from '../components/shared/Seo'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { blogPosts as fallbackBlogPosts } from '../data/seed'

export default function BlogDetail() {
  const { slug } = useParams()
  const { data: dbPosts } = useFirestoreCollection('blogPosts', fallbackBlogPosts)
  const posts = dbPosts && dbPosts.length ? dbPosts : fallbackBlogPosts
  // Since some drafts are not published but accessible via detail view or preview, let's look them up from the entire list
  const post = posts.find((item) => item.slug === slug)

  if (!post) return <Navigate to="/blog" replace />

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl,
    datePublished: post.date,
    author: { '@type': 'Organization', name: post.author },
  }

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        image={post.coverImageUrl}
        jsonLd={jsonLd}
      />
      <article className="bg-brand-cream py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-black text-brand-teal">
            <ArrowLeft className="size-4" /> Back to Blog
          </Link>
          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-soft">
            <img src={post.coverImageUrl} alt={post.title} className="h-80 w-full object-cover" />
            <div className="p-6 sm:p-8">
              <p className="text-sm font-black uppercase text-brand-rose">{post.category}</p>
              <h1 className="mt-2 text-4xl font-black text-brand-navy">{post.title}</h1>
              <p className="mt-3 text-sm font-bold text-slate-500">
                {post.date} · {post.readTime} · {post.author}
              </p>
              {/* Draft warning alert if post is unpublished */}
              {!post.published && (
                <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                  <strong>Draft Status Notice:</strong> This article is a draft placeholder. REAL authored content must be provided by the hospital team prior to publishing this page publicly.
                </div>
              )}
              <div className="mt-8 grid gap-5 text-base leading-8 text-slate-705">
                {post.content?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

