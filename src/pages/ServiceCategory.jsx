import { Navigate, useParams } from 'react-router-dom'
import { Stethoscope, Microscope, UsersRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHero } from '../components/shared/PageHero'
import { SubServiceCard } from '../components/services/SubServiceCard'
import { Seo } from '../components/shared/Seo'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import {
  getLockedServiceCategories,
  getLockedSubServices,
  serviceCategories as fallbackCategories,
  subServices as fallbackSubServices,
} from '../mockData/services'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export default function ServiceCategory() {
  const { category: categoryParam } = useParams()
  
  const { data: dbCategories } = useFirestoreCollection('serviceCategories', [])
  const { data: dbSubServices } = useFirestoreCollection('subServices', [])

  const categories = getLockedServiceCategories(dbCategories)
  const allSubServices = getLockedSubServices(dbSubServices)

  const category = categories.find((item) => item.slug === categoryParam || item.id === categoryParam)

  if (!category) return <Navigate to="/services" replace />

  const rawServices = allSubServices.filter(
    (service) => (service.categoryId || service.category) === category.id && service.active !== false
  )

  // Map subServices to ensure both categoryId and category are present, and shortDescription is populated
  const categoryServices = rawServices.map((service) => ({
    ...service,
    categoryId: service.categoryId || service.category || category.id,
    category: service.categoryId || service.category || category.id,
    shortDescription: service.shortDescription || service.tagline || (service.whatIsIt ? service.whatIsIt.substring(0, 120) + '...' : '')
  })).sort((a, b) => (a.order || 0) - (b.order || 0))

  // Sub-groups for Fertility Testing or categories with subgroups
  const femaleTests = categoryServices.filter((s) => s.subgroup === 'female-tests')
  const maleTests = categoryServices.filter((s) => s.subgroup === 'male-tests')
  const bothPartnersTests = categoryServices.filter((s) => s.subgroup === 'both-partners')

  const hasSubgroups = femaleTests.length > 0 || maleTests.length > 0 || bothPartnersTests.length > 0

  return (
    <>
      <Seo title={category.title} description={category.description} image={category.imageUrl} />
      <PageHero
        badge={category.shortTitle || category.title}
        title={category.title}
        subtitle={category.description}
        image={category.imageUrl}
        breadcrumb={category.title}
      />

      {hasSubgroups ? (
        // FERTILITY TESTING / SUBGROUPS Layout
        <div className="bg-brand-cream py-16 space-y-16">
          {/* Band 1: Female Partner Tests */}
          {femaleTests.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="border-l-4 border-brand-rose pl-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-brand-navy flex items-center gap-3 font-display">
                  <Stethoscope className="size-8 text-brand-rose" /> Tests for the Female Partner
                </h2>
                <p className="mt-2 text-base text-slate-655">
                  Focused assessments to evaluate ovulation, hormonal balance, tubal patency, and uterine cavity structure.
                </p>
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {femaleTests.map((service) => (
                  <motion.div variants={itemVariants} key={service.id}>
                    <SubServiceCard category={category} service={service} variant="icon-top" />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* Band 2: Male Partner Tests */}
          {maleTests.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="border-l-4 border-brand-teal pl-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-brand-navy flex items-center gap-3 font-display">
                  <Microscope className="size-8 text-brand-teal" /> Tests for the Male Partner
                </h2>
                <p className="mt-2 text-base text-slate-655">
                  Semen profile parameters and hormonal checks to diagnose male-factor fertility barriers.
                </p>
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {maleTests.map((service) => (
                  <motion.div variants={itemVariants} key={service.id}>
                    <SubServiceCard category={category} service={service} variant="icon-top" />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* Band 3: Both Partners Tests */}
          {bothPartnersTests.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="border-l-4 border-brand-rose pl-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-brand-navy flex items-center gap-3 font-display">
                  <UsersRound className="size-8 text-brand-rose" /> Tests for Both Partners
                </h2>
                <p className="mt-2 text-base text-slate-655">
                  Screenings for compatibility, infectious diseases, and combined diagnostic profiles.
                </p>
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {bothPartnersTests.map((service) => (
                  <motion.div variants={itemVariants} key={service.id}>
                    <SubServiceCard category={category} service={service} variant="icon-top" />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}
        </div>
      ) : (
        // Standard Care List (Treatments)
        <section className="bg-brand-cream py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-brand-navy font-display">Available Care & Treatments</h2>
              <p className="mt-2 text-base text-slate-655">
                Explore our specialized options available in {category.title}.
              </p>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {categoryServices.map((service) => (
                <motion.div variants={itemVariants} key={service.id} className="h-full">
                  <SubServiceCard category={category} service={service} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}
