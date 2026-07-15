import { describe, expect, it } from 'vitest'
import {
  getAllServiceUrls,
  getLockedServiceCategories,
  getLockedSubServices,
  getServiceCategoryUrl,
  getServiceSubgroupUrl,
  getServiceUrl,
  serviceCategories,
  serviceSubgroups,
  subServices,
} from '../../src/mockData/services'

const staticRoutes = new Set([
  '/',
  '/about',
  '/services',
  '/doctors',
  '/gallery',
  '/blog',
  '/free-camp',
  '/success-stories',
  '/faq',
  '/contact',
  '/appointment',
  '/verify-appointment',
  '/privacy-policy',
  '/terms-of-use',
  '/medical-disclaimer',
  '/cookie-policy',
])

function routeMatchesKnownServiceRoute(path) {
  const categoryRoutes = new Set(serviceCategories.map((category) => getServiceCategoryUrl(category)))
  const subgroupRoutes = new Set(serviceSubgroups.map((subgroup) => getServiceSubgroupUrl(subgroup)))
  const serviceRoutes = new Set(subServices.map((service) => getServiceUrl(service)))

  return staticRoutes.has(path) || categoryRoutes.has(path) || subgroupRoutes.has(path) || serviceRoutes.has(path)
}

describe('Service Slugs & Routing Integrity', () => {
  it('keeps the locked master taxonomy to 2 categories and 24 services', () => {
    expect(serviceCategories.map((category) => category.slug)).toEqual([
      'fertility-treatments',
      'fertility-testing',
    ])

    expect(subServices).toHaveLength(24)
    expect(subServices.filter((service) => service.category === 'fertility-treatments')).toHaveLength(9)
    expect(subServices.filter((service) => service.category === 'fertility-testing')).toHaveLength(15)

    expect(
      subServices
        .filter((service) => service.category === 'fertility-testing')
        .reduce((counts, service) => ({ ...counts, [service.subgroup]: (counts[service.subgroup] || 0) + 1 }), {}),
    ).toEqual({
      'female-tests': 9,
      'male-tests': 3,
      'both-partners': 3,
    })
  })

  it('generates only URLs that resolve to real service routes', () => {
    const allServiceUrls = getAllServiceUrls()

    expect(new Set(allServiceUrls).size).toBe(allServiceUrls.length)
    expect(allServiceUrls).toHaveLength(30)

    allServiceUrls.forEach((url) => {
      expect(routeMatchesKnownServiceRoute(url), `Generated link "${url}" did not resolve to a locked route.`).toBe(true)
    })
  })

  it('rejects retired source-B service categories and links', () => {
    const staleCategories = [
      { id: 'pregnancy-maternity-care', slug: 'pregnancy-maternity-care', title: 'Pregnancy & Maternity Care' },
      { id: 'gynaecology', slug: 'gynaecology', title: 'Gynaecology' },
      { id: 'laparoscopy-surgical-care', slug: 'laparoscopy-surgical-care', title: 'Laparoscopy & Surgical Care' },
    ]
    const staleServices = [
      {
        id: 'ultrasound-fetal-monitoring',
        slug: 'ultrasound-fetal-monitoring',
        category: 'pregnancy-maternity-care',
        categoryId: 'pregnancy-maternity-care',
        title: 'Ultrasound & Fetal Monitoring',
      },
    ]

    expect(getLockedServiceCategories(staleCategories).map((category) => category.slug)).toEqual([
      'fertility-treatments',
      'fertility-testing',
    ])
    expect(getLockedSubServices(staleServices).map((service) => service.slug)).not.toContain('ultrasound-fetal-monitoring')
    expect(routeMatchesKnownServiceRoute('/services/pregnancy-maternity-care/ultrasound-fetal-monitoring')).toBe(false)
  })

  it('keeps every service slug URL-safe and category-aligned', () => {
    const categorySlugs = new Set(serviceCategories.map((category) => category.slug))
    const subgroupSlugs = new Set(serviceSubgroups.map((subgroup) => subgroup.slug))

    subServices.forEach((service) => {
      expect(service.slug).toMatch(/^[a-z0-9-]+$/)
      expect(categorySlugs.has(service.category)).toBe(true)
      if (service.subgroup) {
        expect(service.category).toBe('fertility-testing')
        expect(subgroupSlugs.has(service.subgroup)).toBe(true)
      }
    })
  })
})
