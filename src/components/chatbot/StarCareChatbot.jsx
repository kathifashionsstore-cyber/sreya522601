import { useMemo, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Send, X, MapPin, Navigation, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import {
  getLockedServiceDepartments,
  getLockedSubServices,
  getServiceUrl,
  serviceDepartments,
  subServices as fallbackSubServices,
} from '../../mockData/services'
import { useSiteSettings } from '../../context/SiteSettingsContext'
import { saveDocument, useFirestoreCollection } from '../../hooks/useFirestoreCollection'
import { generateReceiptId } from '../../lib/seo'

const quickQuestions = [
  'Book an Appointment',
  'What services do you offer?',
  'Where are you located?',
  'What are your timings?',
  'Explore our facilities',
  'Meet our doctor',
  'Emergency contact?'
]

function renderMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) =>
    part.startsWith('**') ? <strong key={index} className="font-extrabold">{part.slice(2, -2)}</strong> : <span key={index}>{part}</span>
  )
}

export function StarCareChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const { settings } = useSiteSettings()

  const { data: dbSubServices } = useFirestoreCollection('subServices', fallbackSubServices)
  const { data: dbDepartments } = useFirestoreCollection('departments', serviceDepartments)
  const subServices = getLockedSubServices(dbSubServices)
  const departmentOptions = getLockedServiceDepartments(dbDepartments)
  
  // Real-time Chatbot state machine for interactive appointment booking
  const [bookingState, setBookingState] = useState('idle') // 'idle' | 'name' | 'phone' | 'dept' | 'date' | 'time' | 'confirm'
  const [bookingForm, setBookingForm] = useState({
    patientName: '',
    phone: '',
    department: '',
    preferredDate: '',
    preferredTime: '',
  })

  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hello! I am **Star Care AI**, your real-time assistant for Sreya Hospitals. You can ask me questions or **book an appointment** directly with me right here!',
    },
  ])

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const serviceText = useMemo(() => {
    return subServices
      .filter((service) => service.category === 'fertility-treatments')
      .slice(0, 6)
      .map((service) => service.title.replace(/\s*\([^)]*\)/g, ''))
      .join(', ')
  }, [subServices])

  function startBookingFlow() {
    setBookingState('name')
    setMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        text: 'Awesome! Let’s book your appointment in real-time. First, **what is your full name**?'
      }
    ])
  }

  async function handleBookingStep(text) {
    const trimmed = text.trim()
    if (!trimmed) return

    if (bookingState === 'name') {
      setBookingForm((prev) => ({ ...prev, patientName: trimmed }))
      setBookingState('phone')
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: trimmed },
        { role: 'bot', text: `Thanks ${trimmed}! Next, **what is your mobile phone number**?` }
      ])
      return
    }

    if (bookingState === 'phone') {
      setBookingForm((prev) => ({ ...prev, phone: trimmed }))
      setBookingState('dept')
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: trimmed },
        { 
          role: 'bot', 
          text: `Got it. **Which department or treatment** would you like to visit? Choose one of the options below:`,
          richContent: { type: 'dept_select' }
        }
      ])
      return
    }

    if (bookingState === 'date') {
      setBookingForm((prev) => ({ ...prev, preferredDate: trimmed }))
      setBookingState('time')
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: trimmed },
        { role: 'bot', text: `Got it. Lastly, **what is your preferred time** (e.g. 10:30 AM)?` }
      ])
      return
    }

    if (bookingState === 'time') {
      const updatedForm = { ...bookingForm, preferredTime: trimmed }
      setBookingForm(updatedForm)
      setBookingState('confirm')
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: trimmed },
        {
          role: 'bot',
          text: `We are ready to finalize! Here is your request summary:\n\n**Patient**: ${updatedForm.patientName}\n**Phone**: ${updatedForm.phone}\n**Department**: ${updatedForm.department}\n**Date**: ${updatedForm.preferredDate}\n**Time**: ${updatedForm.preferredTime}\n\nClick **Confirm Booking** below to submit request:`,
          richContent: { type: 'booking_confirm', form: updatedForm }
        }
      ])
      return
    }
  }

  async function finalizeBooking() {
    setTyping(true)
    const receiptId = generateReceiptId()
    const appt = {
      ...bookingForm,
      email: '',
      message: 'Chatbot real-time request',
      source: 'chatbot',
      status: 'pending',
      consentToContact: true,
      receiptId
    }

    try {
      await saveDocument('appointments', appt)
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `🎉 **Success! Your appointment has been booked in real-time.**\nYour Receipt ID is: **${receiptId}**.\nOur clinic team will phone you shortly to confirm. Thank you!`,
          richContent: { type: 'receipt_summary', receiptId, form: appt }
        }
      ])
      setBookingState('idle')
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: `Oops, something went wrong saving your appointment: ${err.message}. Please book using our regular form.` }
      ])
      setBookingState('idle')
    } finally {
      setTyping(false)
    }
  }

  function getBotResponse(question) {
    const q = question.toLowerCase()

    if (q.includes('book') || q.includes('appointment') || q.includes('schedule') || q.includes('register')) {
      startBookingFlow()
      return null
    }

    if (/(service|offer|treatment|speciality|specialities)/.test(q)) {
      return {
        text: `Sreya Hospitals offers advanced fertility treatments: **${serviceText}**. Here is our primary IVF program:`,
        richContent: {
          type: 'service',
          slug: 'ivf'
        }
      }
    }

    const matchedService = subServices.find(
      (s) => q.includes(s.title.toLowerCase()) || q.includes(s.slug.toLowerCase())
    )
    if (matchedService) {
      return {
        text: `Here is information on **${matchedService.title}**:`,
        richContent: {
          type: 'service',
          slug: matchedService.slug
        }
      }
    }

    if (/(ivf|icsi|iui|ovulation|preservation|surgery|laparoscopic|hysteroscopic|semen|hormonal|hsg|ultrasound)/.test(q)) {
      return {
        text: 'We provide specialized fertility pathways. Here is details on our IVF treatment line:',
        richContent: {
          type: 'service',
          slug: 'ivf'
        }
      }
    }

    if (/(location|address|where|map|directions)/.test(q)) {
      return {
        text: 'Sreya Hospitals & IVF Centre is situated in Palnadu District, Narasaraopet:',
        richContent: {
          type: 'location',
          address: settings.address || 'Guntur Road, Narsaraopet, Palnadu District, Andhra Pradesh, India - 522601'
        }
      }
    }

    if (/(doctor|vasanta|kiran|specialist|physician|who)/.test(q)) {
      return {
        text: 'Dr. Vasanta Kiran Mekala leads our fertility center:',
        richContent: {
          type: 'doctor',
          name: 'Dr. Vasanta Kiran Mekala',
          credentials: 'MBBS, DGO, DNB (OBGYN), Fellowship in Reproductive Medicine (IVF)',
          photo: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=300&q=80'
        }
      }
    }

    if (/(timing|hours|open|time)/.test(q)) {
      return {
        text: `Our consultation timings are:\n**${
          settings.businessHours || 'Monday - Saturday: 9:00 AM - 6:00 PM, Sunday: Closed'
        }**.`
      }
    }

    if (/(camp|free|counselling|counseling)/.test(q)) {
      return {
        text: 'We provide advanced clinical diagnostics, NABL-grade laboratory investigations, and treatment-related counselling. You can request a specialist consultation online or explore our recovery wards.'
      }
    }

    if (/(facility|facilities|ward|room|lab|icu|ot|operation)/.test(q)) {
      return {
        text: 'Sreya Hospitals is equipped with modern NABL-standard diagnostic labs, clean-room embryology IVF labs, premium recovery rooms (Non-AC, AC, and Premium Suite Wards), and sterile operating theatres. Visit our **Facilities** showcase page to learn more!'
      }
    }

    if (/(cost|price|package|fees|pricing)/.test(q)) {
      return {
        text: 'Pricing details depend on your clinical requirements. Sreya holds a commitment to **transparent package details** with zero hidden fees. Please consult our staff.'
      }
    }

    if (/(emergency|urgent|bleeding|pain|fever|faint)/.test(q)) {
      return {
        text: `For emergency clinical concerns, call Sreya team immediately at **${
          settings.phoneMobile || '9390328255'
        }** or **08647-222888**.`
      }
    }

    return {
      text: 'I cannot answer symptom-specific medical queries. You can ask me about our services, timing, location, doctors, or type **"book"** to schedule a visit in real-time!'
    }
  }

  function send(text = input) {
    const trimmed = text.trim()
    if (!trimmed) return

    // If state machine is active, redirect message to the booking handler
    if (bookingState !== 'idle') {
      setInput('')
      handleBookingStep(trimmed)
      return
    }

    setMessages((items) => [...items, { role: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    
    window.setTimeout(() => {
      const response = getBotResponse(trimmed)
      if (response) {
        setMessages((items) => [...items, { role: 'bot', ...response }])
      }
      setTyping(false)
    }, 650)
  }

  function handleSelectDept(deptName) {
    setBookingForm((prev) => ({ ...prev, department: deptName }))
    setBookingState('date')
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: deptName },
      { role: 'bot', text: `Selected: **${deptName}**.\nNext, **what date would you like to visit** (e.g. YYYY-MM-DD or Next Monday)?` }
    ])
  }

  return (
    <>
      {/* Bot Launcher Button */}
      <button
        type="button"
        className="fixed bottom-24 left-4 z-40 hidden size-14 place-items-center rounded-full bg-primary text-white shadow-lift hover:scale-105 transition-transform lg:grid border-2 border-white"
        onClick={() => setOpen(true)}
        aria-label="Open Star Care AI"
      >
        <Bot className="size-7 text-white" />
      </button>
      <button
        type="button"
        className="fixed bottom-24 right-4 z-40 grid size-14 place-items-center rounded-full bg-primary text-white shadow-lift hover:scale-105 transition-transform lg:hidden border-2 border-white"
        onClick={() => setOpen(true)}
        aria-label="Open Star Care AI"
      >
        <Bot className="size-7 text-white" />
      </button>

      {open && (
        <div className="fixed bottom-6 left-4 right-4 z-[95] max-h-[85vh] overflow-hidden rounded-2xl bg-[var(--color-bg-base)] border border-[var(--color-border)] shadow-2xl lg:left-auto lg:right-6 lg:w-[440px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary p-4.5 text-white">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-white/15 text-white">
                <Bot className="size-5 text-white" />
              </span>
              <div>
                <p className="font-black leading-tight text-white text-base">Star Care Real-Time AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">
                    Online & Ready
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-9 place-items-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages Area (Larger) */}
          <div className="h-[52vh] overflow-auto p-4 space-y-4 bg-[var(--color-bg-base)]">
            {messages.map((message, index) => {
              const rc = message.richContent
              
              let targetService = null
              if (rc?.type === 'service') {
                targetService = subServices.find((s) => s.slug === rc.slug) || subServices[0]
              }

              return (
                <div key={index} className="space-y-2.5">
                  {/* Primary text bubble */}
                  <div
                    className={`rounded-xl p-3 text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                      message.role === 'bot'
                        ? 'bg-[var(--color-surface)] border border-[var(--color-border)] text-text-primary self-start shadow-sm'
                        : 'bg-primary text-white ml-auto text-left shadow-sm'
                    }`}
                  >
                    {renderMarkdown(message.text)}
                  </div>

                  {/* ================= RICH MEDIA RESPONSE CARDS ================= */}
                  {message.role === 'bot' && rc && (
                    <div className="pl-2 pr-6">
                      {/* 1. Service Card */}
                      {rc.type === 'service' && targetService && (
                        <div className="rounded-xl border border-[var(--color-border)] bg-white overflow-hidden shadow-md flex flex-col">
                          <img
                            src={targetService.heroImage}
                            alt={targetService.title}
                            className="h-32 w-full object-cover"
                          />
                          <div className="p-4 space-y-2">
                            <h4 className="text-xs sm:text-sm font-black text-text-primary leading-tight">
                              {targetService.title}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-text-secondary leading-normal line-clamp-2">
                              {targetService.shortDescription}
                            </p>
                            <Link
                              to={getServiceUrl(targetService)}
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center gap-1 text-[11px] font-black text-primary hover:text-primary-dark pt-1.5"
                            >
                              View Full Details <ArrowRight className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* 2. Location Map Card */}
                      {rc.type === 'location' && (
                        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 space-y-3 shadow-md">
                          <div className="flex gap-2.5 items-start">
                            <span className="grid size-9 place-items-center rounded-lg bg-[var(--color-accent-blush)] text-primary shrink-0">
                              <MapPin className="size-4.5" />
                            </span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-text-primary">Our Narasaraopet Clinic</h4>
                              <p className="text-[10px] sm:text-xs text-text-secondary leading-relaxed mt-1">
                                {rc.address}
                              </p>
                            </div>
                          </div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=Sreya+Hospitals+IVF+Centre+Narasaraopet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full min-h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-black text-white hover:bg-primary-dark transition shadow-sm"
                          >
                            Get Directions <Navigation className="size-3.5" />
                          </a>
                        </div>
                      )}

                      {/* 3. Doctor Bio Card */}
                      {rc.type === 'doctor' && (
                        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 space-y-3 shadow-md">
                          <div className="flex gap-3 items-center">
                            <img
                              src={rc.photo}
                              alt={rc.name}
                              className="size-12 rounded-full object-cover border border-[var(--color-border)] shadow-sm"
                            />
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-text-primary">{rc.name}</h4>
                              <span className="inline-flex rounded-full bg-[var(--color-primary-light)] text-primary px-2.5 py-0.5 text-[9px] font-black mt-1">
                                Lead Infertility Specialist
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] sm:text-xs text-text-secondary leading-relaxed line-clamp-3">
                            {rc.credentials}
                          </p>
                          <Link
                            to="/doctors"
                            onClick={() => setOpen(false)}
                            className="inline-flex w-full min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-slate-50 px-3 py-1.5 text-xs font-black text-text-primary hover:bg-slate-100 transition"
                          >
                            Meet Dr. Vasanta <User className="size-3.5" />
                          </Link>
                        </div>
                      )}

                      {/* 4. Interactive Department Selection */}
                      {rc.type === 'dept_select' && (
                        <div className="flex flex-col gap-2 pt-1.5">
                          {departmentOptions.map((department) => (
                            <button
                              key={department.id}
                              type="button"
                              onClick={() => handleSelectDept(department.name)}
                              className="w-full text-left rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-xs font-bold text-text-primary hover:bg-[var(--color-primary-light)]/20 hover:border-primary transition"
                            >
                              {department.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* 5. Interactive Confirm Booking Card */}
                      {rc.type === 'booking_confirm' && (
                        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 space-y-3 shadow-md text-center">
                          <p className="text-xs text-text-secondary">Click below to submit this request directly in real-time:</p>
                          <button
                            type="button"
                            onClick={finalizeBooking}
                            className="inline-flex w-full min-h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700 transition shadow-sm"
                          >
                            Confirm Booking <CheckCircle2 className="size-4" />
                          </button>
                        </div>
                      )}

                      {/* 6. Receipt Success Summary Card */}
                      {rc.type === 'receipt_summary' && (
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-2 text-left">
                          <p className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="size-4 text-emerald-600" /> Booking Verified
                          </p>
                          <div className="text-[10px] text-slate-700 space-y-1 mt-1.5">
                            <p><strong>Receipt ID</strong>: {rc.receiptId}</p>
                            <p><strong>Patient</strong>: {rc.form.patientName}</p>
                            <p><strong>Department</strong>: {rc.form.department}</p>
                            <p><strong>Preferred Slot</strong>: {rc.form.preferredDate} at {rc.form.preferredTime}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            
            {typing && (
              <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-xs font-bold text-slate-400 w-fit flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Quick Questions and Input */}
          <div className="grid gap-2 border-t border-[var(--color-border)] p-3 bg-white">
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  className="shrink-0 rounded-full bg-[var(--color-bg-alt)] border border-[var(--color-border)] px-3 py-1.5 text-[10px] sm:text-xs font-black text-text-secondary hover:text-primary transition"
                  onClick={() => send(question)}
                >
                  {question}
                </button>
              ))}
            </div>

            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                send()
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-xs outline-none focus:border-primary bg-[var(--color-bg-base)] text-text-primary"
                placeholder={
                  bookingState === 'name' ? 'Type your full name...' : 
                  bookingState === 'phone' ? 'Type your mobile number...' :
                  bookingState === 'date' ? 'Type date (e.g. YYYY-MM-DD)...' :
                  bookingState === 'time' ? 'Type time (e.g. 10:30 AM)...' :
                  'Ask about treatments, location, timings...'
                }
              />
              <button
                type="submit"
                className="grid size-10 place-items-center rounded-lg bg-primary text-white hover:bg-primary-dark transition shrink-0"
              >
                <Send className="size-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
