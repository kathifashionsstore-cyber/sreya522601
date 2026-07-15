import { Navigate, useParams } from 'react-router-dom'
import { ServiceDetailLayout } from '../components/services/ServiceDetailLayout'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import {
  getLockedServiceCategories,
  getLockedSubServices,
  serviceCategories as fallbackCategories,
  subServices as fallbackSubServices,
} from '../mockData/services'

export default function ServiceSubPage({ overrideSlug }) {
  const { category: categoryParam, slug: slugParam } = useParams()

  // Determine active slug and category slug
  const resolvedCategorySlug = categoryParam
  const resolvedServiceSlug = overrideSlug || slugParam

  const { data: dbCategories } = useFirestoreCollection('serviceCategories', [])
  const { data: dbSubServices } = useFirestoreCollection('subServices', [])

  const categories = getLockedServiceCategories(dbCategories)
  const subServices = getLockedSubServices(dbSubServices)

  const category = categories.find((item) => item.slug === resolvedCategorySlug || item.id === resolvedCategorySlug)
  const service = subServices.find(
    (item) => item.slug === resolvedServiceSlug && ((item.categoryId || item.category) === category?.id)
  )

  if (!category || !service) {
    return <Navigate to="/services" replace />
  }

  // Ensure consistent fields mapped
  const mappedService = {
    ...service,
    categoryId: service.categoryId || service.category || category.id,
    category: service.categoryId || service.category || category.id,
    shortDescription: service.shortDescription || service.tagline || (service.whatIsIt ? service.whatIsIt.substring(0, 120) + '...' : '')
  }

  return <ServiceDetailLayout category={category} service={mappedService} />
}
