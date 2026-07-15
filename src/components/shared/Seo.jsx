import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { canonical, routeTitle } from '../../lib/seo'
import { useSiteSettings } from '../../context/SiteSettingsContext'

export function Seo({ title, description, image, jsonLd }) {
  const location = useLocation()
  const { settings } = useSiteSettings()
  const metaTitle = routeTitle(title)
  const metaDescription = description || settings.seo?.description || settings.tagline
  const metaImage = image || settings.seo?.ogImage
  const url = canonical(location.pathname)

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      {metaImage ? <meta property="og:image" content={metaImage} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  )
}
