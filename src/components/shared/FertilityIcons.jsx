// Custom duotone SVG Icon set designed specifically for Sreya Hospitals & IVF Centre

export function EmbryoIcon({ className = "size-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
      <circle cx="10" cy="10" r="3.5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="14.5" cy="13.5" r="2.5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="10.5" cy="15" r="1.5" />
      <circle cx="14.5" cy="9.5" r="1.5" />
    </svg>
  )
}

export function DnaIcon({ className = "size-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} {...props}>
      <path d="M4.5 10.5C4.5 5.5 19.5 5.5 19.5 10.5S4.5 15.5 4.5 20.5" />
      <path d="M19.5 10.5C19.5 5.5 4.5 5.5 4.5 10.5S19.5 15.5 19.5 20.5" strokeDasharray="2 2" />
      <line x1="6" y1="8" x2="18" y2="8" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="6" y1="16" x2="18" y2="16" />
    </svg>
  )
}

export function OvumIcon({ className = "size-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} {...props}>
      <circle cx="12" cy="12" r="6" fill="currentColor" fillOpacity="0.15" />
      <circle cx="12" cy="12" r="1.5" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 19.8l1.4-1.4M19.8 4.2l-1.4 1.4" />
    </svg>
  )
}

export function SpermIcon({ className = "size-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <ellipse cx="8" cy="12" rx="4" ry="2.5" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 12c4 0 6 3 8 0s3-4 4-2" />
    </svg>
  )
}

export function UterusIcon({ className = "size-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 21c-2-2-4-5-4-9 0-3 1.5-5 4-5s4 2 4 5c0 4-2 7-4 9z" fill="currentColor" fillOpacity="0.1" />
      <path d="M3 6c2-2 5-2 9 1 4-3 7-3 9-1" />
      <path d="M3 6v4c0 1.5 2 3 5 2M21 6v4c0 1.5-2 3-5 2" />
    </svg>
  )
}

export function OvulationCalendarIcon({ className = "size-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="15" r="2.5" fill="currentColor" />
    </svg>
  )
}

export function HeartsIcon({ className = "size-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 5.5C10.5 3 6.5 3 4.5 5.5s0 6 7.5 11c7.5-5 7.5-8.5 7.5-11s-4-2.5-5.5 0z" fill="currentColor" fillOpacity="0.05" />
      <path d="M16 11.5c-1-1.5-3.5-1.5-4.8 0s0 3.8 4.8 7c4.8-3.2 4.8-5.5 4.8-7s-2.5-1.5-3.5 0z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  )
}

export function PreservationIcon({ className = "size-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} {...props}>
      <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
      <path d="M12 6v12M6 12h12M8.5 8.5l7 7M15.5 8.5l-7 7" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  )
}

export function ConsultationIcon({ className = "size-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M3 12a9 9 0 0 0 15 6.7l2 1.3" />
      <path d="M21 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
      <path d="M12 5.5c-.8-.8-2-.8-2.8 0a2 2 0 0 0 0 2.8l2.8 2.7 2.8-2.7a2 2 0 0 0 0-2.8c-.8-.8-2-.8-2.8 0z" fill="currentColor" fillOpacity="0.15" />
    </svg>
  )
}

export const fertilityIconMap = {
  Activity: EmbryoIcon,
  Heart: HeartsIcon,
  Layers: UterusIcon,
  User: OvumIcon,
  Users: SpermIcon,
  Preservation: PreservationIcon,
  Calendar: OvulationCalendarIcon,
  Dna: DnaIcon,
  Consultation: ConsultationIcon
}
