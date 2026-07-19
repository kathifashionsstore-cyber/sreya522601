import { useParams, Navigate, Link } from 'react-router-dom'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { IVFLoader } from '../components/shared/IVFLoader'
import {
  getLockedServiceCategories,
  getLockedSubServices,
  getServiceCategoryUrl,
  getServiceSubgroupUrl,
  getServiceUrl,
  serviceCategories as fallbackCategories,
  serviceSubgroups,
  subServices as fallbackSubServices,
} from '../mockData/services'
import ServiceSubPage from './ServiceSubPage'
import { Microscope, Activity, Users, ArrowLeft } from 'lucide-react'
import { Seo } from '../components/shared/Seo'

const subgroupMeta = {
  'female-tests': {
    title: 'Female Fertility Tests & Scans',
    description: 'Comprehensive diagnostic testing, scans, and ovarian checks to assess female fertility indicators.',
    eyebrow: 'Female Diagnostics',
    icon: Activity,
  },
  'male-tests': {
    title: 'Male Fertility Investigations',
    description: 'Advanced laboratory semen analysis and hormonal screening to check male fertility indicators.',
    eyebrow: 'Male Diagnostics',
    icon: Microscope,
  },
  'both-partners': {
    title: 'Both Partners Screening Panels',
    description: 'Joint testing profiles, compatibility screens, and infectious screening panels for couples.',
    eyebrow: 'Couple Evaluation',
    icon: Users,
  },
}

export default function ServiceOrSubgroupResolver() {
  const { category, slugOrSubgroup } = useParams()
  
  const { data: dbCategories, loading: catLoading } = useFirestoreCollection('serviceCategories', [])
  const { data: dbSubServices, loading: subLoading } = useFirestoreCollection('subServices', [])

  if (catLoading || subLoading) {
    return <IVFLoader />
  }

  const activeCategories = getLockedServiceCategories(dbCategories)
  const allSubServices = getLockedSubServices(dbSubServices)

  const validCategory = activeCategories.find((c) => c.slug === category || c.id === category)
  if (!validCategory) {
    return <Navigate to="/services" replace />
  }

  // Check if slugOrSubgroup matches a subgroup key
  const isSubgroup = serviceSubgroups.some((subgroup) => subgroup.slug === slugOrSubgroup)

  if (isSubgroup) {
    // Render subgroup landing page
    const meta = subgroupMeta[slugOrSubgroup] || { title: 'Subgroup Tests', description: '', eyebrow: 'Fertility Diagnostics', icon: Microscope }
    const Icon = meta.icon
    const subgroupTests = allSubServices
      .filter((s) => (s.categoryId || s.category) === validCategory.id && s.subgroup === slugOrSubgroup && s.active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    return (
      <div className="min-h-screen bg-bg-alt py-12 md:py-20">
        <Seo 
          title={`${meta.title} | Sreya Hospitals`}
          description={meta.description}
          canonicalPath={getServiceSubgroupUrl(slugOrSubgroup)}
        />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex flex-wrap text-sm text-text-secondary">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <span className="mx-2">/</span>
            <Link to={getServiceCategoryUrl(validCategory)} className="hover:text-primary transition-colors">{validCategory.title}</Link>
            <span className="mx-2">/</span>
            <span className="text-text-primary font-medium">{meta.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-12 rounded-2xl bg-surface p-8 shadow-sm border border-border md:p-12">
            <span className="eyebrow-badge bg-brand-blush text-brand-rose">
              {meta.eyebrow}
            </span>
            <div className="mt-4 flex items-start gap-4 md:gap-6">
              <div className="hidden sm:grid size-12 place-items-center rounded-xl bg-primary-light/10 text-primary md:size-16">
                <Icon className="size-6 md:size-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-text-primary md:text-4xl">
                  {meta.title}
                </h1>
                <p className="mt-4 text-lg text-text-secondary leading-relaxed max-w-3xl">
                  {meta.description}
                </p>
              </div>
            </div>
          </div>

          {/* Tests List */}
          <h2 className="mb-6 text-xl font-extrabold text-text-primary uppercase tracking-wider">
            Available Diagnostic Tests ({subgroupTests.length})
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {subgroupTests.map((test) => {
              const tagline = test.shortDescription || test.tagline || (test.whatIsIt ? test.whatIsIt.substring(0, 100) + '...' : '')
              
              return (
                <Link
                  key={test.slug}
                  to={getServiceUrl(test, activeCategories)}
                  className="group relative rounded-xl border border-border bg-surface p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200"
                >
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                    {test.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-3 leading-relaxed">
                    {tagline}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-bold text-primary group-hover:text-primary-dark">
                    View Test Details & Schedule &rarr;
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link
              to={getServiceCategoryUrl(validCategory)}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft className="size-4" /> Back to {validCategory.title}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Not a subgroup, so it must be a flat service slug (Category 1 treatments)
  // Delegate rendering directly to ServiceSubPage
  return <ServiceSubPage overrideSlug={slugOrSubgroup} />
}
