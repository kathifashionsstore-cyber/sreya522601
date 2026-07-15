import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, HelpCircle } from 'lucide-react'
import {
  getLockedServiceCategories,
  getServiceCategoryUrl,
  serviceCategories as fallbackCategories,
} from '../../mockData/services'
import { fertilityIconMap } from '../shared/FertilityIcons'
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection'

function getYoutubeId(url) {
  if (!url) return ''
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}

function getYoutubeEmbedUrl(url) {
  if (!url) return ''
  const id = getYoutubeId(url)
  if (id) {
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0`
  }
  return url
}

function AutoplayVideo({ url, title, fallbackImage }) {
  const isYoutube = url && (url.includes('youtube.com') || url.includes('youtu.be'))
  
  if (isYoutube) {
    const embedUrl = getYoutubeEmbedUrl(url)
    return (
      <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md bg-black">
        {fallbackImage && (
          <img 
            src={fallbackImage} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 pointer-events-none" 
            loading="lazy"
          />
        )}
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="relative z-10 w-full h-full object-cover scale-[1.03]"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md bg-black">
      <video
        src={url}
        autoPlay
        muted
        loop
        playsInline
        poster={fallbackImage}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function CategoryCoverImage({ url, title }) {
  return (
    <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md group">
      <img
        src={url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
    </div>
  )
}

export function ServicesGrid1() {
  const { data: dbCategories } = useFirestoreCollection('serviceCategories', fallbackCategories)
  const categoriesToRender = getLockedServiceCategories(dbCategories)

  return (
    <section className="bg-[var(--color-bg-base)] py-16 sm:py-24 border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-primary">Comprehensive Fertility Care</span>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary">
            Our Services
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto">
            Complete fertility care under one roof, from first consultation to parenthood.
          </p>
        </div>

        {/* Locked service category cards */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {categoriesToRender.map((category, index) => {
            const Icon = fertilityIconMap[category.iconKey] || HelpCircle
            const isEven = index % 2 === 0
            
            // Check mediaType (default to video if category has videoUrl and index % 2 !== 0, for backward compatibility)
            const showVideo = category.mediaType ? (category.mediaType === 'video' && category.videoUrl) : (category.videoUrl && index % 2 !== 0)
            
            const fallbackImage = category.imageUrl || category.cardImages?.[0] || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
            const mediaUrl = showVideo ? category.videoUrl : fallbackImage

            const bullets = Array.isArray(category.highlightBullets) ? category.highlightBullets : []
            const cardImgs = Array.isArray(category.cardImages) ? category.cardImages : []

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur-[20px] p-6 sm:p-8 hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <div className="grid gap-8 items-center lg:grid-cols-12">
                  
                  {/* Left Column (or Right on alternating index): Media */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    {showVideo ? (
                      <AutoplayVideo url={mediaUrl} title={category.title} fallbackImage={fallbackImage} />
                    ) : (
                      <CategoryCoverImage url={mediaUrl} title={category.title} />
                    )}
                  </div>

                  {/* Right Column: Heading, highlights, bullets, triptych cluster */}
                  <div className={`lg:col-span-7 flex flex-col justify-between h-full space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-tr from-[var(--color-accent-blush)] to-[var(--color-bg-base)] text-primary shrink-0 shadow-sm border border-[var(--color-border)]/45">
                          <Icon className="size-5" />
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-text-primary leading-tight font-display">
                          {category.title}
                        </h3>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {category.description}
                      </p>

                      {/* Bullet Highlights */}
                      {bullets.length > 0 && (
                        <ul className="grid gap-2 sm:grid-cols-2 pt-2">
                          {bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border)]/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* 3-Image Triptych cluster */}
                      {cardImgs.length > 0 && (
                        <div className="flex items-center -space-x-4">
                          {cardImgs.slice(0, 3).map((img, imgIdx) => (
                            <img
                              key={imgIdx}
                              src={img}
                              alt=""
                              className="size-11 sm:size-12 object-cover rounded-lg border-2 border-[var(--color-bg-base)] shadow-sm hover:scale-110 hover:z-30 transition-transform duration-350 z-10"
                              style={{ zIndex: 10 + imgIdx }}
                            />
                          ))}
                          <span className="text-[10px] text-text-muted font-bold pl-6">
                            Real Facilities
                          </span>
                        </div>
                      )}

                      <Link
                        to={getServiceCategoryUrl(category)}
                        className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-primary-dark transition self-start sm:self-auto"
                      >
                        Learn More <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              </motion.div>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <Link
            to="/services"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-6 py-3 text-sm font-black text-primary hover:bg-[var(--color-primary-light)]/20 transition shadow-sm"
          >
            View All Specialities <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
