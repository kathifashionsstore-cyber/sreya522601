import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarHeart, ClipboardList, Settings, HeartPulse, Sparkles, Smile, HelpCircle } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: "1. Specialist Consultation",
    shortTitle: "Consultation",
    icon: CalendarHeart,
    color: "#e11d48", // Rose
    bgColor: "#fff1f2",
    description: "Your journey starts with an in-depth conversation. Dr. Vasanta Kiran reviews your history, prior scans, and diagnostic reports to understand your goals without pressure.",
    tip: "Bring any previous prescriptions, HSG films, or semen analysis reports."
  },
  {
    id: 2,
    title: "2. Diagnostic Evaluation",
    shortTitle: "Evaluation",
    icon: ClipboardList,
    color: "#0d9488", // Teal
    bgColor: "#f0fdfa",
    description: "Targeted hormone panels, follicular scans, or semen profiles are conducted. We only order tests that are clinically relevant to pinpoint fertility factors.",
    tip: "Most tests are completed in-house within 1-2 days."
  },
  {
    id: 3,
    title: "3. Custom Care Plan",
    shortTitle: "Care Plan",
    icon: Settings,
    color: "#4f46e5", // Indigo
    bgColor: "#eef2ff",
    description: "Whether choosing natural cycle monitoring, IUI, or IVF, we structure a precise cycle schedule, medication list, and lifestyle guidelines tailored to your markers.",
    tip: "You'll receive a detailed roadmap with transparent cost estimates."
  },
  {
    id: 4,
    title: "4. Embryo Monitoring",
    shortTitle: "Monitoring",
    icon: HeartPulse,
    color: "#db2777", // Pink
    bgColor: "#fdf2f8",
    description: "In our ICMR-compliant cleanroom embryology lab, eggs and sperm are fertilized (via IVF or ICSI) and incubated under rigorous environmental parameters.",
    tip: "Advanced trigas incubators ensure optimal embryo growth."
  },
  {
    id: 5,
    title: "5. Confirmed Pregnancy",
    shortTitle: "Pregnancy",
    icon: Smile,
    color: "#059669", // Emerald
    bgColor: "#ecfdf5",
    description: "Following embryo transfer, we provide continuous hormonal support, scheduling verification blood tests (Beta-hCG) and initial scans to confirm viability.",
    tip: "Our care team continues support through the first trimester."
  }
]

export function FertilityPathway() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-brand-rose">Our Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy font-display">
            The Sreya Fertility Pathway
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Click on each milestone of our structured diagnostic and treatment pathway to explore how we guide you from the initial consultation to pregnancy.
          </p>
        </div>

        {/* Interactive SVG / Grid Pathway */}
        <div className="relative">
          
          {/* Desktop connecting line (SVG) */}
          <div className="absolute top-[52px] left-[10%] right-[10%] h-1 hidden lg:block z-0">
            <svg className="w-full h-full" fill="none" preserveAspectRatio="none">
              <path 
                d="M 0,2 Q 200,-5 400,2 T 800,2" 
                stroke="#e2e8f0" 
                strokeWidth="3" 
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          <div className="grid gap-8 lg:grid-cols-5 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const isActive = activeStep === idx

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className="flex flex-col items-center text-center group focus:outline-none"
                >
                  {/* Step Bubble */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      backgroundColor: isActive ? step.color : '#ffffff',
                      color: isActive ? '#ffffff' : step.color,
                      boxShadow: isActive 
                        ? `0 20px 25px -5px ${step.color}33, 0 10px 10px -5px ${step.color}20`
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative grid size-24 place-items-center rounded-full border-2 transition-colors duration-300 z-10"
                    style={{ borderColor: isActive ? step.color : '#f1f5f9' }}
                  >
                    <Icon className="size-9" />
                    {/* Step indicator badge */}
                    <span 
                      className={`absolute -top-1.5 -right-1.5 size-6 rounded-full text-[10px] font-black grid place-items-center border-2 border-white shadow-sm ${
                        isActive ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {step.id}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <span className="mt-4 text-xs font-black uppercase tracking-wider text-brand-navy group-hover:text-brand-rose transition-colors duration-200">
                    {step.shortTitle}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Display Active Step Detail Block */}
        <div className="mt-12 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-10 grid md:grid-cols-[1fr_280px] gap-8 shadow-soft"
            >
              {/* Left Column: Title & Description */}
              <div className="space-y-4">
                <span 
                  className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit"
                  style={{ color: steps[activeStep].color, backgroundColor: steps[activeStep].bgColor }}
                >
                  Step {steps[activeStep].id} details
                </span>
                <h3 className="text-2xl font-black text-brand-navy font-display">
                  {steps[activeStep].title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-650">
                  {steps[activeStep].description}
                </p>
              </div>

              {/* Right Column: Practical tip card */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5 text-brand-rose mb-3">
                    <Sparkles className="size-4 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Practical Tip</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-normal">
                    {steps[activeStep].tip}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                  <HelpCircle className="size-3.5" />
                  <span>Ask our care team for details</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
