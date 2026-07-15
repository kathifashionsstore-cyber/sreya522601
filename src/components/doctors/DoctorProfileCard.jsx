import { Award, Clock, GraduationCap } from 'lucide-react'
import { yearsSince } from '../../lib/dateUtils'

export function DoctorProfileCard({ doctor }) {
  const experienceYears =
    doctor.practicingSinceYear && Number(doctor.practicingSinceYear)
      ? `${yearsSince(doctor.practicingSinceYear)}+`
      : doctor.experienceYears
  return (
    <article className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-soft">
      <img src={doctor.photoUrl} alt={doctor.altText || doctor.name} className="h-72 w-full object-cover" loading="lazy" />
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-brand-navy">{doctor.name}</h2>
            <p className="mt-1 font-bold text-brand-teal">{doctor.specialty}</p>
          </div>
          {doctor.needsVerification ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">Needs verification</span>
          ) : null}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{doctor.bio}</p>
        <div className="mt-5 grid gap-3 text-sm text-slate-700">
          <p className="flex gap-2"><GraduationCap className="size-5 text-brand-rose" /> {doctor.qualifications}</p>
          <p className="flex gap-2"><Award className="size-5 text-brand-rose" /> {experienceYears} years experience, {doctor.proceduresCount}</p>
          <p className="flex gap-2"><Clock className="size-5 text-brand-rose" /> {doctor.consultationTiming}</p>
        </div>
      </div>
    </article>
  )
}
