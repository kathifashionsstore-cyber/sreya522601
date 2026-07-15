import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { saveDocument } from '../../hooks/useFirestoreCollection'
import { generateReceiptId } from '../../lib/seo'
import { useToast } from '../shared/Toast'
import { Button } from '../shared/Button'
import { Field, Input, Textarea } from '../shared/Input'
import { DepartmentSelect } from './DepartmentSelect'
import { ReceiptPreview } from './ReceiptPreview'
import { useSiteSettings } from '../../context/SiteSettingsContext'

const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Enter full name').max(100),
  phone: z.string().regex(/^[0-9+() -]{7,18}$/, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  department: z.string().min(1, 'Choose a department'),
  preferredDate: z.string().min(1, 'Choose a date'),
  preferredTime: z.string().min(1, 'Choose a time'),
  message: z.string().max(1200).optional(),
  consentToContact: z.boolean().refine(Boolean, 'Consent is required.'),
  website: z.string().optional(),
})

export function AppointmentForm({ defaultDepartment = '' }) {
  const [receipt, setReceipt] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { push } = useToast()
  const { settings } = useSiteSettings()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { department: defaultDepartment || '', consentToContact: false },
  })

  useEffect(() => {
    reset({ department: defaultDepartment || '', consentToContact: false })
  }, [defaultDepartment, reset])

  async function onSubmit(values) {
    console.log("Form values at submit:", values)
    if (values.website) return
    setSubmitting(true)
    setSubmitError('')
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const appointment = {
      patientName: values.patientName,
      phone: values.phone,
      email: values.email || '',
      department: values.department,
      preferredDate: values.preferredDate,
      preferredTime: values.preferredTime,
      message: values.message || '',
      source: 'online',
      status: 'pending',
      consentToContact: true,
      notificationChannel: values.email ? 'email' : 'none',
      receiptId: generateReceiptId(),
    }

    try {
      const docId = await saveDocument('appointments', appointment)
      setReceipt({ ...appointment, id: docId, createdAt: new Date().toISOString() })
      push('Appointment request submitted. The hospital team will confirm it soon.', 'success')
      reset()
    } catch (error) {
      setSubmitError(error.message || 'Appointment could not be submitted.')
      push(error.message || 'Appointment could not be submitted.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-lg bg-white p-5 shadow-soft">
        <input type="text" className="hidden" tabIndex="-1" autoComplete="off" {...register('website')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" error={errors.patientName?.message}>
            <Input {...register('patientName')} placeholder="Patient full name" />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input {...register('phone')} placeholder="+91" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email (optional)" error={errors.email?.message}>
            <Input type="email" {...register('email')} placeholder="patient@example.com" />
          </Field>
          <Field label="Department" error={errors.department?.message}>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <DepartmentSelect
                  currentValue={field.value}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred Date" error={errors.preferredDate?.message}>
            <Input type="date" {...register('preferredDate')} />
          </Field>
          <Field label="Preferred Time" error={errors.preferredTime?.message}>
            <Input type="time" {...register('preferredTime')} />
          </Field>
        </div>
        <Field label="Message or Symptoms (optional)" error={errors.message?.message}>
          <Textarea {...register('message')} placeholder="Briefly tell the team what you need help with." />
        </Field>
        <label className="flex gap-3 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-700">
          <input type="checkbox" className="mt-1 size-4" {...register('consentToContact')} />
          <span>I agree to be contacted regarding my appointment request.</span>
        </label>
        {errors.consentToContact ? <p className="text-xs font-bold text-rose-600">{errors.consentToContact.message}</p> : null}
        {submitError ? (
          <p className="rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-900">
            Online submission failed. Please call {settings.phoneMobile || 'the hospital'} directly to book.
          </p>
        ) : null}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Appointment Request'}
        </Button>
      </form>
      <ReceiptPreview appointment={receipt} />
    </div>
  )
}
