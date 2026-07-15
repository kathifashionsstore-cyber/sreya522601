import { BlogCard } from '../components/blog/BlogCard'
import { PageHero } from '../components/shared/PageHero'
import { Seo } from '../components/shared/Seo'
import { EmptyState } from '../components/shared/EmptyState'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { blogPosts as fallbackBlogPosts } from '../data/seed'

export default function Blog() {
  const { settings } = useSiteSettings()
  const { data: dbPosts } = useFirestoreCollection('blogPosts', fallbackBlogPosts)
  const posts = (dbPosts && dbPosts.length ? dbPosts : fallbackBlogPosts).filter((post) => post.published !== false)
  const banner = settings.pageBanners?.blog || {}

  return (
    <>
      <Seo
        title="Blog"
        description="Patient education articles from Sreya Hospitals & IVF Centre."
      />
      <PageHero
        badge={banner.badge || 'Blog'}
        title={banner.title || 'Patient education for informed care'}
        subtitle={banner.subtitle || settings.tagline}
        image={banner.imageUrl}
        breadcrumb={banner.breadcrumb || 'Blog'}
      />
      <section className="bg-brand-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState title="No blog posts yet" />
          )}
        </div>
      </section>
    </>
  )
}
