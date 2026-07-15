import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '../components/shared/PageHero'
import { Seo } from '../components/shared/Seo'
import { Button } from '../components/shared/Button'
import { Field, Input, Select, Textarea } from '../components/shared/Input'
import { useToast } from '../components/shared/Toast'
import { useSiteSettings } from '../context/SiteSettingsContext'

const contactSchema = z.object({
  name: z.string().min(2, 'Enter your name').max(100),
  phone: z.string().regex(/^[0-9+() -]{7,18}$/, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  type: z.string().min(1),
  message: z.string().min(5, 'Enter a message').max(1200),
  consentToContact: z.boolean().refine(Boolean, 'Consent is required.'),
  website: z.string().optional(),
})

export default function Contact() {
  const { push } = useToast()
  const { settings } = useSiteSettings()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { type: 'general', consentToContact: false },
  })

  async function onSubmit(values) {
    if (values.website) return
    setSubmitting(true)
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      push('Message submitted. The hospital team will get in touch with you shortly.', 'success')
      reset()
    } catch (error) {
      push(error.message || 'Message could not be submitted.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const banner = settings.pageBanners?.contact || {}

  return (
    <>
      <Seo
        title="Contact"
        description="Contact Sreya Hospitals & IVF Centre for appointments, directions, and fertility counselling."
      />
      <PageHero
        badge={banner.badge || 'Contact'}
        title={banner.title || 'Reach the Sreya Hospitals team'}
        subtitle={banner.subtitle || settings.tagline}
        image={banner.imageUrl}
        breadcrumb={banner.breadcrumb || 'Contact'}
      />
      <section className="bg-brand-cream py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-lg bg-white p-6 shadow-soft">
            <input type="text" className="hidden" tabIndex="-1" autoComplete="off" {...register('website')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name?.message}>
                <Input {...register('name')} />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <Input {...register('phone')} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" error={errors.email?.message}>
                <Input type="email" {...register('email')} />
              </Field>
              <Field label="Type" error={errors.type?.message}>
                <Select {...register('type')}>
                  <option value="general">General Enquiry</option>
                  <option value="appointment">Appointment Help</option>
                  <option value="feedback">Feedback</option>
                </Select>
              </Field>
            </div>
            <Field label="Message" error={errors.message?.message}>
              <Textarea {...register('message')} />
            </Field>
            <label className="flex gap-3 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" className="mt-1 size-4" {...register('consentToContact')} />
              <span>I agree to be contacted regarding my enquiry.</span>
            </label>
            {errors.consentToContact ? <p className="text-xs font-bold text-rose-600">{errors.consentToContact.message}</p> : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
          <aside className="grid gap-4">
            {[
              { icon: MapPin, label: 'Address', value: settings.address },
              { icon: Phone, label: 'Mobile', value: settings.phoneMobile },
              { icon: Phone, label: 'Primary Office', value: settings.phonePrimary },
              { icon: Mail, label: 'Email', value: settings.email },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-white p-5 shadow-soft">
                <item.icon className="size-6 text-brand-teal" />
                <h2 className="mt-3 text-lg font-black text-brand-navy">{item.label}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.value}</p>
              </div>
            ))}
            {settings.mapEmbedUrl ? (
              <iframe
                title="Sreya Hospitals map"
                src={settings.mapEmbedUrl}
                className="h-72 w-full rounded-lg border-0 shadow-soft"
                loading="lazy"
              />
            ) : null}
          </aside>
        </div>
      </section>
    </>
  )
}
