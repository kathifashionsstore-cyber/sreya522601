/**
 * @typedef {Object} ServiceData
 * @property {string} id
 * @property {string} slug
 * @property {"fertility-treatments"|"fertility-testing"} category
 * @property {string} [subgroup] // only for fertility-testing items, e.g. "female-tests"
 * @property {"treatment"|"test"} pageType // controls conditional section labels/visibility
 * @property {string} title
 * @property {string} heroHeading
 * @property {string} heroSubtitle
 * @property {string} heroImage
 * @property {string} shortDescription
 * @property {string[]} overview
 * @property {{icon:string,title:string,description:string}[]} [symptoms] // "What This Test Checks" or Symptoms
 * @property {{title:string,description:string}[]} [causes]
 * @property {{text:string,level?:"high"|"moderate"}[]} [riskFactors]
 * @property {{step:string,title:string,description:string}[]} diagnosisSteps
 * @property {string[]} relevantDiagnosticTests
 * @property {{tabName:string,description:string,whoMayBenefit:string,recoveryInfo:string}[]} treatmentOptions
 * @property {string[]} careJourneySteps
 * @property {string[]} patientEducationTips
 * @property {string[]} relatedServiceSlugs
 * @property {{q:string,a:string}[]} faqs
 * @property {{title:string,description:string,canonicalPath:string,ogImage:string}} seo
 * @property {boolean} active
 * @property {number} order
 */

const placeholderImages = {
  hero: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1400&q=80",
  consultation: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1400&q=80",
  lab: "https://images.unsplash.com/photo-1581093458791-9d2fcea0a349?auto=format&fit=crop&w=1400&q=80",
  doctor: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80",
  family: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80",
  care: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=80",
}

export const serviceCategories = [
  {
    id: "fertility-treatments",
    slug: "fertility-treatments",
    title: "Fertility Treatments",
    shortTitle: "Treatments",
    tagline: "Expert fertility procedures including IVF, IUI, and ICSI.",
    description: "Sreya Hospitals & IVF Centre provides advanced assisted reproductive technologies led by specialists to help families conceive.",
    iconKey: "Microscope",
    accentColor: "var(--color-category-fertility)",
    imageUrl: placeholderImages.lab,
    order: 1,
  },
  {
    id: "fertility-testing",
    slug: "fertility-testing",
    title: "Fertility Testing",
    shortTitle: "Testing",
    tagline: "Comprehensive diagnostics and scans for both partners.",
    description: "Accurate diagnostic profiles and investigations to uncover root causes and guide your fertility pathway.",
    iconKey: "HeartPulse",
    accentColor: "var(--color-category-testing)",
    imageUrl: placeholderImages.consultation,
    order: 2,
  }
]

export const serviceSubgroups = [
  {
    title: 'Female Tests',
    name: 'Female Tests',
    slug: 'female-tests',
    category: 'fertility-testing',
    description: 'Focused assessments for ovulation, hormones, tubal patency, and uterine cavity structure.',
  },
  {
    title: 'Male Tests',
    name: 'Male Tests',
    slug: 'male-tests',
    category: 'fertility-testing',
    description: 'Semen profile parameters and hormonal checks to diagnose male-factor fertility barriers.',
  },
  {
    title: 'Both Partners',
    name: 'Both Partners',
    slug: 'both-partners',
    category: 'fertility-testing',
    description: 'Screenings for compatibility, infectious diseases, and combined diagnostic profiles.',
  },
]

/**
 * Helper to build service data with full V6 structure.
 * @param {string} id 
 * @param {"fertility-treatments"|"fertility-testing"} category 
 * @param {string|null} subgroup 
 * @param {"treatment"|"test"} pageType 
 * @param {string} title 
 * @param {string} summary 
 * @param {Partial<ServiceData>} [extras] 
 * @returns {ServiceData}
 */

function createService(id, category, subgroup, pageType, title, summary, extras = {}) {
  const slug = id;
  const canonicalPath = `/services/${category}${subgroup ? `/${subgroup}` : ''}/${slug}`

  return {
    id,
    slug,
    category,
    categoryId: category,
    subgroup: subgroup || undefined,
    pageType,
    title,
    heroHeading: extras.heroHeading || `Expert ${title} ${pageType === 'treatment' ? 'Treatment' : 'Testing'}`,
    heroSubtitle: extras.heroSubtitle || summary,
    heroImage: extras.heroImage || (pageType === 'treatment' ? placeholderImages.lab : placeholderImages.consultation),
    heroImages: extras.heroImages || [],
    shortDescription: summary,
    overview: extras.overview || [
      `${title} is a specialized clinical procedure performed at Sreya Hospitals & IVF Centre in Narasaraopet. This pathway is led by our fertility specialist to bring clarity and target successful outcomes.`,
      "The appropriate pathway is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
    ],
    symptoms: extras.symptoms || (pageType === 'treatment' ? [
      { icon: "ShieldAlert", title: "Difficulty Conceiving", description: "Inability to achieve pregnancy after 12 months of regular unprotected intercourse." },
      { icon: "Clock", title: "Advanced Maternal Age", description: "Women over 35 seeking to optimize their conception timeline." }
    ] : [
      { icon: "Stethoscope", title: "Ovarian Function", description: "Evaluating follicular reserve and egg maturation signals." },
      { icon: "Microscope", title: "Sperm Integrity", description: "Checking concentration, morphology, and motility parameters." }
    ]),
    causes: extras.causes || [
      { title: "Hormonal Imbalances", description: "Disruptions in ovulation signals or sperm production pathways." },
      { title: "Anatomical Barriers", description: "Blockages in tubal passages or uterine lining discrepancies." }
    ],
    riskFactors: extras.riskFactors || [
      { text: "Prior history of repeated pregnancy losses or failed implantation cycles", level: "high" },
      { text: "Age-related decline in egg quality or sperm parameters", level: "moderate" }
    ],
    diagnosisSteps: extras.diagnosisSteps || [
      { step: "1", title: "Specialist Consultation", description: "A thorough review of medical records, prior scans, and pregnancy history." },
      { step: "2", title: "Targeted Diagnostics", description: "Focused hormone blood panels or imaging scans ordered as needed." },
      { step: "3", title: "Result Analysis", description: "Explaining reports clearly to outline the options without pressure." },
      { step: "4", title: "Structured Care Plan", description: "Finalizing cycle schedules, medications, and support guidelines." }
    ],
    relevantDiagnosticTests: extras.relevantDiagnosticTests || [
      "Hormonal Testing",
      "Semen Analysis",
      "Pelvic Ultrasound Scans"
    ],
    treatmentOptions: extras.treatmentOptions || [
      {
        tabName: "Standard Protocol",
        description: "A standard, clinically proven path tailored to standard hormone responses.",
        whoMayBenefit: "Couples beginning their first guided treatment cycle.",
        recoveryInfo: "Minimal downtime; resume normal activities immediately."
      },
      {
        tabName: "Advanced Integration",
        description: "Utilizes advanced lab options (like ICSI or laser-assisted hatching) for complex factors.",
        whoMayBenefit: "Patients with previous failed cycles or severe male factor issues.",
        recoveryInfo: "Requires 24-48 hours of rest post egg retrieval."
      }
    ],
    careJourneySteps: extras.careJourneySteps || [
      "Initial Inquiry",
      "Specialist Discussion",
      "Diagnostic Checks",
      "Treatment Cycle",
      "Outcome Support"
    ],
    patientEducationTips: extras.patientEducationTips || [
      "Maintain a nutrient-rich, balanced diet to support reproductive cell quality.",
      "Attend all scan and monitoring visits exactly as scheduled by the clinic.",
      "Consult the care team immediately regarding severe symptoms or bleeding."
    ],
    relatedServiceSlugs: extras.relatedServiceSlugs || [],
    faqs: extras.faqs || [
      { q: "How long does the initial consultation take?", a: "The initial evaluation and history review take approximately 30 to 45 minutes. We encourage both partners to attend." },
      { q: "Is the procedure covered under standard insurance?", a: "Fertility treatments have varying coverage. Our billing team will provide transparent cost estimates." }
    ],
    seo: {
      title: extras.seoTitle || `${title} in Narasaraopet | Sreya Hospitals`,
      description: extras.seoDescription || `Expert ${title} services at Sreya Hospitals & IVF Centre, Narasaraopet. Lead specialist care and modern diagnostics.`,
      canonicalPath,
      ogImage: extras.heroImage || placeholderImages.lab,
    },
    active: true,
    order: extras.order || 1,
  }
}

export const subServices = [
  // ================= CATEGORY 1: FERTILITY TREATMENTS (9 flat items) =================
  createService(
    "iui",
    "fertility-treatments",
    null,
    "treatment",
    "Intrauterine Insemination (IUI)",
    "A procedure where prepared sperm is placed directly into the uterus during ovulation, bypasses the cervix to maximize natural conception.",
    {
      order: 1,
      heroHeading: "Intrauterine Insemination (IUI) Treatment",
      overview: [
        "Intrauterine Insemination (IUI) is a first-line, minimally invasive fertility treatment where washed and concentrated sperm is introduced directly into the female partner's uterus around the time of ovulation.",
        "By placing sperm directly into the uterine cavity, IUI bypasses cervical mucus barriers, giving sperm a shorter, easier path to reach and fertilize the egg naturally.",
        "The appropriate treatment is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Unexplained Infertility", description: "Conception delays where standard diagnostic profiles are normal." },
        { icon: "Microscope", title: "Mild Male Factor", description: "Slightly low sperm count or minor motility discrepancies." },
        { icon: "HeartPulse", title: "Cervical Barriers", description: "Hostile cervical mucus or prior cervical surgeries affecting sperm transit." }
      ],
      causes: [
        { title: "Ovulatory Discrepancy", description: "Irregular cycles making natural timing difficult." },
        { title: "Ejaculatory Barriers", description: "Difficulty achieving natural insemination." }
      ],
      treatmentOptions: [
        {
          tabName: "Natural Cycle IUI",
          description: "IUI timed strictly around the female partner's natural LH surge without ovulation drugs.",
          whoMayBenefit: "Women with regular ovulatory cycles and no hormonal imbalances.",
          recoveryInfo: "No downtime; resume normal work immediately."
        },
        {
          tabName: "Stimulated Cycle IUI",
          description: "Uses oral ovulation induction medications to stimulate development of 1 to 2 follicles.",
          whoMayBenefit: "Women with irregular cycles or PCOS.",
          recoveryInfo: "Minor pelvic bloating; normal activities can be resumed immediately."
        }
      ],
      relatedServiceSlugs: ["ivf", "icsi", "ovulation-induction"],
      faqs: [
        { q: "Is the IUI procedure painful?", a: "Most women experience only minor cramping similar to menstrual discomfort as the thin catheter is introduced." },
        { q: "How many IUI cycles should we try?", a: "Typically, 3 to 4 cycles are attempted. If pregnancy is not achieved, advanced options like IVF are discussed." }
      ]
    }
  ),

  createService(
    "ivf",
    "fertility-treatments",
    null,
    "treatment",
    "In Vitro Fertilization (IVF)",
    "The primary advanced fertility treatment where eggs are retrieved, fertilized in our lab, and transferred back into the uterus.",
    {
      order: 2,
      heroHeading: "In Vitro Fertilization (IVF) Treatment",
      overview: [
        "In Vitro Fertilization (IVF) is the gold standard of assisted reproductive technologies. Eggs are retrieved from the ovaries under sedation, fertilized by sperm in our embryology lab, and grown into embryos before being transferred back into the womb.",
        "Sreya Hospitals delivered the first test-tube baby in the Narasaraopet region, proving our commitment to bringing advanced lab services to the local community.",
        "The appropriate treatment is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Blocked Fallopian Tubes", description: "Bilateral tubal blockages preventing natural egg-sperm meeting." },
        { icon: "HeartPulse", title: "Endometriosis", description: "Severe pelvic adhesions or cysts affecting egg release and retrieval." },
        { icon: "Award", title: "Repeated IUI Failure", description: "Unsuccessful conception outcomes after multiple IUI attempts." }
      ],
      causes: [
        { title: "Tubal Damage", description: "Physical blocks due to previous pelvic infections or appendicitis." },
        { title: "Advanced Maternal Age", description: "Declining egg count or quality making natural fertilization less likely." }
      ],
      treatmentOptions: [
        {
          tabName: "Fresh Embryo Transfer",
          description: "Embryo is transferred back into the uterus 3 to 5 days after retrieval during the same cycle.",
          whoMayBenefit: "Patients with optimal hormone levels and lining thickness post-stimulation.",
          recoveryInfo: "Downtime of 24 hours is recommended; avoid heavy lifting."
        },
        {
          tabName: "Frozen Embryo Transfer (FET)",
          description: "Embryos are frozen (vitrified) and transferred in a subsequent cycle once the uterine lining is prepared.",
          whoMayBenefit: "Patients at risk of OHSS or with suboptimal endometrial lining.",
          recoveryInfo: "Standard outpatient procedure, resume normal work next day."
        }
      ],
      relatedServiceSlugs: ["icsi", "iui", "fertility-preservation"],
      faqs: [
        { q: "What is the average timeline for an IVF cycle?", a: "An IVF cycle typically spans 4 to 6 weeks, involving ovarian stimulation, monitoring scans, egg retrieval, fertilization, and transfer." },
        { q: "Are there travel restrictions after transfer?", a: "We recommend avoiding long, bumpy journeys for 24-48 hours. Local travel can be resumed with caution." }
      ]
    }
  ),

  createService(
    "icsi",
    "fertility-treatments",
    null,
    "treatment",
    "Intracytoplasmic Sperm Injection (ICSI)",
    "An advanced laboratory procedure where a single selected sperm is injected directly into a mature egg to ensure fertilization.",
    {
      order: 3,
      heroHeading: "Intracytoplasmic Sperm Injection (ICSI)",
      overview: [
        "Intracytoplasmic Sperm Injection (ICSI) is a highly specialized micromanipulation technique used in conjunction with IVF. Under high-powered magnification, our embryologist selects a single healthy sperm and injects it directly into the center of a mature egg.",
        "ICSI bypasses the natural binding and penetration steps, offering high fertilization rates even in cases of severe sperm abnormalities.",
        "The appropriate treatment is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
      ],
      symptoms: [
        { icon: "Microscope", title: "Severe Male Infertility", description: "Extremely low sperm count, motility, or abnormal morphology." },
        { icon: "ShieldAlert", title: "Poor IVF Fertilization", description: "Low fertilization rates in previous standard IVF cycles." },
        { icon: "Star", title: "Surgically Retrieved Sperm", description: "Sperm collected via testicular extraction (TESA/PESA) needing direct microinjection." }
      ],
      causes: [
        { title: "Sperm Binding Blocks", description: "Sperm unable to naturally break through the egg's outer shell." },
        { title: "Azoospermia", description: "Complete absence of sperm in ejaculate requiring micro-extraction." }
      ],
      treatmentOptions: [
        {
          tabName: "Standard ICSI",
          description: "Direct injection of selected sperm into retrieved mature oocytes.",
          whoMayBenefit: "Couples facing male-factor infertility or previous low fertilization.",
          recoveryInfo: "Same as standard IVF recovery."
        }
      ],
      relatedServiceSlugs: ["ivf", "semen-analysis"],
      faqs: [
        { q: "Does ICSI guarantee fertilization?", a: "While ICSI significantly increases fertilization rates (typically 70-80%), it does not guarantee that every egg will fertilize or grow." },
        { q: "Does ICSI increase genetic risks?", a: "The risk of birth defects with ICSI is extremely low, and matches standard IVF statistics." }
      ]
    }
  ),

  createService(
    "fertility-preservation",
    "fertility-treatments",
    null,
    "treatment",
    "Fertility Preservation",
    "Egg and sperm freezing utilizing vitrification technology to protect reproductive options for future planning.",
    {
      order: 4,
      heroHeading: "Egg and Sperm Cryopreservation",
      overview: [
        "Fertility Preservation allows individuals to harvest and freeze their eggs, sperm, or embryos at ultra-low temperatures, halting cellular aging.",
        "We use advanced vitrification (flash-freezing) technology, which avoids ice crystal formation, protecting delicate reproductive cells and ensuring high survival rates upon thawing.",
        "The appropriate treatment is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
      ],
      symptoms: [
        { icon: "Clock", title: "Delayed Childbearing", description: "Personal decisions to delay childbearing to secure career or educational milestones." },
        { icon: "ShieldAlert", title: "Medical Treatments", description: "Planned chemotherapy, radiation, or pelvic surgeries that impair ovarian/testicular function." }
      ],
      causes: [
        { title: "Diminishing Ovarian Reserve", description: "Declining AMH levels indicating reduced egg pool." }
      ],
      treatmentOptions: [
        {
          tabName: "Egg Vitrification",
          description: "Ovarian stimulation followed by egg retrieval and flash freezing of mature oocytes.",
          whoMayBenefit: "Women wishing to preserve reproductive potential before age-related decline.",
          recoveryInfo: "Same as standard egg retrieval; 24 hours of rest."
        },
        {
          tabName: "Semen Cryopreservation",
          description: "Analysis, washing, and cryopreservation of semen samples.",
          whoMayBenefit: "Men undergoing medical therapies or facing surgical risks.",
          recoveryInfo: "No downtime; completed within 1 hour."
        }
      ],
      relatedServiceSlugs: ["ivf", "hormonal-testing-female"],
      faqs: [
        { q: "How long can eggs or sperm remain frozen?", a: "Cryopreserved samples can remain stored in liquid nitrogen tanks indefinitely without biological degradation." },
        { q: "What is the survival rate after thawing?", a: "With vitrification, egg survival rates are over 90%, and sperm survival rates are extremely high." }
      ]
    }
  ),

  createService(
    "donor-programs",
    "fertility-treatments",
    null,
    "treatment",
    "Donor Programs",
    "Access to screened donor eggs or sperm, matching stringent clinical and regulatory parameters.",
    {
      order: 5,
      heroHeading: "Donor Egg and Sperm Programs",
      overview: [
        "Donor Programs provide a reliable pathway for couples whose own eggs or sperm are medically unable to achieve conception.",
        "All donor candidates undergo strict clinical evaluations, infectious disease screenings, and genetic checks under national guidelines.",
        "The appropriate treatment is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Ovarian Failure", description: "Early menopause or complete lack of follicle development." },
        { icon: "Microscope", title: "Azoospermia", description: "Absence of sperm where surgical recovery is not possible." }
      ],
      causes: [
        { title: "Genetic Transmission Risk", description: "Inherited disorders that could be passed down from parents." }
      ],
      treatmentOptions: [
        {
          tabName: "Donor Oocyte Cycle",
          description: "IVF using eggs from a verified donor, fertilized by partner sperm, and transferred to the recipient.",
          whoMayBenefit: "Women with premature ovarian failure or poor egg quality.",
          recoveryInfo: "Minimal downtime for the recipient (same as FET)."
        },
        {
          tabName: "Donor Insemination",
          description: "IUI using processed donor sperm samples from certified semen banks.",
          whoMayBenefit: "Couples facing untreatable male azoospermia.",
          recoveryInfo: "No downtime."
        }
      ],
      relatedServiceSlugs: ["ivf", "iui"],
      faqs: [
        { q: "Is donor selection kept anonymous?", a: "Yes, donor programs follow strict anonymity protocols in compliance with regulatory rules." },
        { q: "How are donor candidates evaluated?", a: "Candidates are screened for HIV, Hepatitis, Syphilis, karyotyping, and basic physiological health." }
      ]
    }
  ),

  createService(
    "surrogacy",
    "fertility-treatments",
    null,
    "treatment",
    "Surrogacy Services",
    "Gestational surrogacy support including IVF, embryo transfer, and obstetric care for eligible couples.",
    {
      order: 6,
      heroHeading: "Gestational Surrogacy Services",
      overview: [
        "Gestational Surrogacy is a pathway where a surrogate carries a pregnancy to term for intended parents who are medically unable to carry a child themselves.",
        "Sreya Hospitals provides the necessary IVF cycles, embryo preparation, transfer, and clinical support, strictly adhering to national surrogacy laws.",
        "The appropriate treatment is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Uterine Absence", description: "Congenital absence of the uterus or critical uterine malformations." },
        { icon: "HeartPulse", title: "Recurrent Loss", description: "Repeated pregnancy loss or embryo implantation failure despite high-grade embryos." }
      ],
      causes: [
        { title: "Severe Medical Contraindications", description: "Heart or kidney conditions making pregnancy life-threatening for the mother." }
      ],
      treatmentOptions: [
        {
          tabName: "Gestational Surrogacy Cycle",
          description: "Creating embryos using intended parents' gametes and transferring to the surrogate.",
          whoMayBenefit: "Eligible couples under medical certification.",
          recoveryInfo: "Intended parents experience standard outpatient cycle recovery."
        }
      ],
      relatedServiceSlugs: ["ivf", "hysteroscopy"],
      faqs: [
        { q: "What is gestational surrogacy?", a: "The surrogate carries a baby conceived via IVF and has no genetic connection to the child." },
        { q: "Are legal guidelines followed?", a: "Yes, Sreya Hospitals only accepts cases that possess valid legal clearance certificates." }
      ]
    }
  ),

  createService(
    "laparoscopic-surgeries",
    "fertility-treatments",
    null,
    "treatment",
    "Laparoscopic Surgeries",
    "Minimally invasive keyhole surgery to treat fibroids, cysts, tubal blocks, and pelvic adhesions affecting fertility.",
    {
      order: 7,
      heroHeading: "Laparoscopic Fertility Surgery",
      overview: [
        "Laparoscopic Surgery is a keyhole surgical procedure where a thin camera (laparoscope) and micro-instruments are inserted through small abdominal incisions.",
        "This allows our specialist to view pelvic organs directly and surgically treat endometriosis, ovarian cysts, or tubal blocks, restoring natural anatomy.",
        "The appropriate treatment is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Ovarian Cysts", description: "Endometriomas or large benign cysts impacting follicle growth." },
        { icon: "HeartPulse", title: "Severe Pelvic Pain", description: "Pain during menstruation or intercourse pointing to endometriosis." }
      ],
      causes: [
        { title: "Adhesions", description: "Scar tissues binding pelvic structures due to previous infections." }
      ],
      treatmentOptions: [
        {
          tabName: "Operative Laparoscopy",
          description: "Excision of endometriosis, cystectomy, or adhesiolysis under general anesthesia.",
          whoMayBenefit: "Women with structural blocks or pain symptoms.",
          recoveryInfo: "1 to 2 days hospital stay; resume normal activities in 7 days."
        }
      ],
      relatedServiceSlugs: ["hysteroscopic-surgeries", "laparoscopy-diagnostic"],
      faqs: [
        { q: "How long is recovery after laparoscopy?", a: "Most patients resume light desk work within 5 to 7 days, though heavy exercise should be avoided for 2 weeks." },
        { q: "Does laparoscopy improve pregnancy rates?", a: "Yes, by removing pelvic blocks, it restores anatomy and improves natural and assisted conception chances." }
      ]
    }
  ),

  createService(
    "hysteroscopic-surgeries",
    "fertility-treatments",
    null,
    "treatment",
    "Hysteroscopic Surgeries",
    "A scarless procedure to correct abnormalities inside the uterine cavity, ensuring a healthy environment for implantation.",
    {
      order: 8,
      heroHeading: "Hysteroscopic Womb Correction",
      overview: [
        "Hysteroscopic Surgery is a scarless procedure where a thin lighted telescope is passed through the cervix directly into the uterus.",
        "Our specialist inspects the uterine lining and removes polyps, fibroids, or septums that interfere with embryo implantation.",
        "The appropriate treatment is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Uterine Polyps", description: "Small, benign growths inside the endometrial cavity." },
        { icon: "Clock", title: "Implantation Failure", description: "Failure of high-quality embryos to attach in previous IVF cycles." }
      ],
      causes: [
        { title: "Septum", description: "A congenital fibrous wall dividing the womb cavity." }
      ],
      treatmentOptions: [
        {
          tabName: "Operative Hysteroscopy",
          description: "Polypectomy, septal resection, or scar tissue removal under light sedation.",
          whoMayBenefit: "Women with intrauterine structural factors.",
          recoveryInfo: "Outpatient care; return home same day; resume work in 24 hours."
        }
      ],
      relatedServiceSlugs: ["laparoscopic-surgeries", "hysteroscopy"],
      faqs: [
        { q: "Is hysteroscopy performed under general anesthesia?", a: "It is typically done under short intravenous sedation or local block, ensuring complete comfort." },
        { q: "When can we plan embryo transfer after hysteroscopy?", a: "Usually in the next cycle, once the endometrial lining has fully healed and regenerated." }
      ]
    }
  ),

  createService(
    "ovulation-induction",
    "fertility-treatments",
    null,
    "treatment",
    "Ovulation Induction",
    "Regulating cycle development with oral or injectable medications, combined with ultrasound tracking for timed intercourse.",
    {
      order: 9,
      heroHeading: "Ovulation Induction & Cycle Tracking",
      overview: [
        "Ovulation Induction is a conservative fertility treatment using oral or injectable medications to stimulate the development of mature eggs.",
        "Combined with follicular ultrasound monitoring to track growth, we advise the couple on timed intercourse to optimize natural conception.",
        "The appropriate treatment is selected after specialist evaluation and may vary according to the patient's condition, medical history, and diagnostic findings."
      ],
      symptoms: [
        { icon: "Clock", title: "Irregular Cycles", description: "Unpredictable menstrual cycles indicating inconsistent egg release." },
        { icon: "ShieldAlert", title: "PCOS / PCOD", description: "Polycystic ovary syndrome characterized by lack of ovulation." }
      ],
      causes: [
        { title: "Anovulation", description: "The ovaries failing to mature and release eggs naturally." }
      ],
      treatmentOptions: [
        {
          tabName: "Oral Medications",
          description: "Using standard oral induction agents (Letrozole/Clomiphene) taken for 5 days of the cycle.",
          whoMayBenefit: "Women with PCOS or irregular ovulation.",
          recoveryInfo: "No downtime; minor hormonal fluctuations."
        },
        {
          tabName: "Injectable Gonadotropins",
          description: "Low-dose injections to stimulate follicular development under close scan monitoring.",
          whoMayBenefit: "Patients who do not respond to oral agents.",
          recoveryInfo: "No downtime; requires daily monitoring."
        }
      ],
      relatedServiceSlugs: ["iui", "ultrasound-scans"],
      faqs: [
        { q: "What is the risk of multiple pregnancies?", a: "Stimulating the ovaries can release more than one egg. We track growth closely via ultrasound to cancel or convert cycles if too many follicles mature." },
        { q: "How long should we try ovulation induction?", a: "Usually 3 to 6 cycles are attempted before discussing advanced procedures like IUI." }
      ]
    }
  ),


  // ================= CATEGORY 2: FERTILITY TESTING (15 items total across 3 subgroups) =================
  // ------------------ SUBGROUP: female-tests (9 items) ------------------
  createService(
    "hormonal-testing-female",
    "fertility-testing",
    "female-tests",
    "test",
    "Hormonal Testing (Female)",
    "Blood draws to analyze reproductive signals including AMH for ovarian reserve, FSH, LH, and thyroid profiles.",
    {
      order: 1,
      overview: [
        "Female Hormonal Testing analyzes vital endocrine signals that regulate cycle timing, egg development, and endometrial receptivity.",
        "Samples are typically drawn on specific cycle days (e.g. day 2 or 3) to capture baseline hormone values. Anti-Müllerian Hormone (AMH) can be checked on any day.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "Stethoscope", title: "Ovarian Reserve (AMH)", description: "Estimates the remaining egg supply." },
        { icon: "Clock", title: "Ovulation Signals (FSH/LH)", description: "Checks if the brain is signaling follicular growth correctly." },
        { icon: "ShieldAlert", title: "Metabolic Markers (TSH/PRL)", description: "Excludes thyroid or prolactin issues that disrupt periods." }
      ],
      relatedServiceSlugs: ["ultrasound-scans", "ovulation-induction"],
      faqs: [
        { q: "Why is cycle timing important for hormone tests?", a: "FSH, LH, and Estrogen change rapidly across your cycle. Day 2 or 3 baseline checks are required for accurate comparison." }
      ]
    }
  ),

  createService(
    "hsg",
    "fertility-testing",
    "female-tests",
    "test",
    "Hysterosalpingography (HSG)",
    "A specialized X-ray utilizing contrast dye to verify fallopian tube patency and detect womb contour abnormalities.",
    {
      order: 2,
      overview: [
        "Hysterosalpingography (HSG) is a specialized diagnostic X-ray. A small amount of contrast dye is gently introduced into the uterus, showing its shape and verifying if the fallopian tubes are open.",
        "If dye spills out of both tubes, it indicates patency, confirming that sperm can travel naturally to meet the egg.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Tubal Patency Check", description: "Verifying if fallopian tubes are clear of blocks." },
        { icon: "Stethoscope", title: "Uterine Cavity Outline", description: "Mapping uterine wall contours for structural shifts." }
      ],
      relatedServiceSlugs: ["laparoscopy-diagnostic", "sonohysterography"],
      faqs: [
        { q: "Is HSG painful?", a: "Most women experience moderate, temporary menstrual cramping during the dye injection. Taking a mild pain reliever beforehand helps." }
      ]
    }
  ),

  createService(
    "hysteroscopy",
    "fertility-testing",
    "female-tests",
    "test",
    "Diagnostic Hysteroscopy",
    "Direct visual examination of the cervix and uterine lining using a micro-camera, completed without incisions.",
    {
      order: 3,
      overview: [
        "Diagnostic Hysteroscopy allows direct visualization of the cervix and endometrial cavity.",
        "A thin, lighted scope is guided gently through the vagina and cervix. This visual assessment helps locate tiny polyps, scar tissue, or divisions that scans might miss.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "Stethoscope", title: "Endometrial View", description: "Direct inspection of the lining where embryos implant." },
        { icon: "ShieldAlert", title: "Structural Detection", description: "Detecting polyps, sub-mucosal fibroids, or adhesions." }
      ],
      relatedServiceSlugs: ["hysteroscopic-surgeries", "sonohysterography"],
      faqs: [
        { q: "Do I need to stay in the hospital?", a: "No, diagnostic hysteroscopy is a quick day-care check. You can return home within a few hours." }
      ]
    }
  ),

  createService(
    "cervical-mucus-testing",
    "fertility-testing",
    "female-tests",
    "test",
    "Cervical Mucus Testing",
    "Evaluating mucus properties around ovulation to verify if they support sperm survival and transport.",
    {
      order: 4,
      overview: [
        "Cervical Mucus Testing evaluates the consistency, pH, and elasticity of cervical mucus around expected ovulation.",
        "Healthy mid-cycle mucus should be clear, stretchy, and alkaline, facilitating sperm transit into the womb.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "Stethoscope", title: "Mucus Elasticity", description: "Checking if mid-cycle mucus stretch is adequate." },
        { icon: "ShieldAlert", title: "Acidity Assessment", description: "Ensuring pH levels do not neutralize sperm." }
      ],
      relatedServiceSlugs: ["semen-analysis", "iui"],
      faqs: [
        { q: "What is hostile cervical mucus?", a: "Mucus that is too thick, dry, or acidic, preventing sperm from traveling naturally." }
      ]
    }
  ),

  createService(
    "sonohysterography",
    "fertility-testing",
    "female-tests",
    "test",
    "Sonohysterography (Saline Infusion)",
    "A clear ultrasound using sterile saline to expand the uterine walls and inspect for growths or adhesions.",
    {
      order: 5,
      overview: [
        "Sonohysterography (Saline Infusion Sonography or SIS) is an enhanced pelvic ultrasound.",
        "Sterile saline is introduced into the uterus through a thin catheter to expand the womb walls. This clear interface allows transvaginal scans to locate polyps, fibroids, or contour shifts.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "Stethoscope", title: "Cavity Expansion", description: "Saline helps distinguish between normal tissue and growths." },
        { icon: "ShieldAlert", title: "Lining Inspection", description: "High-resolution details of the endometrial layer." }
      ],
      relatedServiceSlugs: ["hysteroscopy", "hsg"],
      faqs: [
        { q: "How is this different from HSG?", a: "HSG checks if tubes are open using X-rays. Saline sonography examines the womb lining using ultrasound waves." }
      ]
    }
  ),

  createService(
    "ultrasound-scans",
    "fertility-testing",
    "female-tests",
    "test",
    "Ultrasound Scans (Transvaginal/AFC)",
    "Transvaginal scans to track ovarian follicle development and measure endometrial thickness.",
    {
      order: 6,
      overview: [
        "Transvaginal Ultrasound scans are the primary imaging tool in fertility care. A specialized probe is used to capture clear details of the uterus and ovaries.",
        "It includes Antral Follicle Count (AFC) to estimate resting follicles and monitors growth during cycle stimulation.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "Stethoscope", title: "Antral Follicle Count (AFC)", description: "Direct follicle count in the ovaries to map egg reserve." },
        { icon: "Clock", title: "Endometrial Thickness", description: "Measuring lining thickness for transfer readiness." }
      ],
      relatedServiceSlugs: ["hormonal-testing-female", "ovulation-induction"],
      faqs: [
        { q: "Is a full bladder required?", a: "No, transvaginal scans require an empty bladder for optimal pelvic resolution." }
      ]
    }
  ),

  createService(
    "laparoscopy-diagnostic",
    "fertility-testing",
    "female-tests",
    "test",
    "Diagnostic Laparoscopy",
    "Minimally invasive keyhole inspection under general anesthesia to check pelvic organs for endometriosis and scarring.",
    {
      order: 7,
      overview: [
        "Diagnostic Laparoscopy is a day-care surgical inspection. A thin camera is inserted through a tiny navel incision to view the uterus, tubes, and ovaries.",
        "It is the gold standard for locating endometriosis and pelvic scar tissues which are invisible on standard scans.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Endometriosis Check", description: "Locates active tissue implants or cysts." },
        { icon: "Stethoscope", title: "Adhesion Map", description: "Finds scar tissues that bind organs together." }
      ],
      relatedServiceSlugs: ["laparoscopic-surgeries", "hsg"],
      faqs: [
        { q: "Are stitches required?", a: "Yes, 1 or 2 tiny incisions are closed with dissolving stitches." }
      ]
    }
  ),

  createService(
    "ovulation-testing",
    "fertility-testing",
    "female-tests",
    "test",
    "Ovulation Testing & Cycle Tracking",
    "Clinical monitoring combining urine LH tests and follicular ultrasound to confirm the fertile window.",
    {
      order: 8,
      overview: [
        "Ovulation tracking combines home testing kits (LH surge kits) and regular follicular scans.",
        "This identifies the exact window of ovulation, ensuring that natural attempts or IUI are timed perfectly.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "Clock", title: "LH Surge Check", description: "Detects the pre-ovulation hormone spike." },
        { icon: "Stethoscope", title: "Follicle Rupture Scan", description: "Ultrasound verification that the egg has released." }
      ],
      relatedServiceSlugs: ["ultrasound-scans", "ovulation-induction"],
      faqs: [
        { q: "Does a positive LH kit guarantee ovulation?", a: "No, it confirms the signal. Follicular scan tracking is needed to verify that the egg has actually released." }
      ]
    }
  ),

  createService(
    "genetic-testing",
    "fertility-testing",
    "female-tests",
    "test",
    "Genetic Testing & Screening",
    "Karyotyping and genetic molecular screens to identify conditions that affect implantation and pregnancy.",
    {
      order: 9,
      overview: [
        "Genetic Testing assesses chromosomal layouts and molecular carrier markers for both partners.",
        "This helps identify translocations or traits that explain recurrent miscarriages or implantation failures.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Karyotype Check", description: "Verifies chromosomal structure and layout." },
        { icon: "Microscope", title: "Carrier Screening", description: "Excludes hereditary transmission risks." }
      ],
      relatedServiceSlugs: ["ivf", "icsi"],
      faqs: [
        { q: "How is the sample collected?", a: "It is done via a simple, standard blood draw." }
      ]
    }
  ),


  // ------------------ SUBGROUP: male-tests (3 items) ------------------
  createService(
    "semen-analysis",
    "fertility-testing",
    "male-tests",
    "test",
    "Semen Analysis",
    "Sperm count, concentration, active motility, and normal shape evaluation in our specialized fertility laboratory.",
    {
      order: 10,
      overview: [
        "Semen Analysis evaluates the primary parameters of male fertility.",
        "Conducted in our clinic lab, it tracks count, motility (movement), morphology (shape), and volume to evaluate fertilizing potential.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "Microscope", title: "Concentration Check", description: "Measures the number of sperm per milliliter." },
        { icon: "Clock", title: "Active Motility", description: "Checks what percentage of sperm are moving actively." },
        { icon: "Stethoscope", title: "Morphology Profile", description: "Evaluates the shape characteristics of sperm." }
      ],
      relatedServiceSlugs: ["icsi", "hormonal-testing-male"],
      faqs: [
        { q: "How many days of abstinence are required?", a: "A period of 2 to 5 days is recommended for accurate results." }
      ]
    }
  ),

  createService(
    "hormonal-testing-male",
    "fertility-testing",
    "male-tests",
    "test",
    "Hormonal Testing (Male)",
    "Blood draws checking testosterone, FSH, LH, and prolactin levels to analyze sperm production pathways.",
    {
      order: 11,
      overview: [
        "Male Hormonal Testing checks key endocrine levels that drive sperm maturation and testicular function.",
        "It includes FSH (which controls sperm production), LH (which drives testosterone production), and baseline Testosterone.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "Stethoscope", title: "Testosterone Levels", description: "Checks core androgen activity." },
        { icon: "Microscope", title: "FSH/LH Signals", description: "Verifies the communication between pituitary and testicles." }
      ],
      relatedServiceSlugs: ["semen-analysis", "genetic-testing"],
      faqs: [
        { q: "When should male hormone tests be drawn?", a: "Morning blood draws are preferred, as testosterone levels peak early in the day." }
      ]
    }
  ),

  createService(
    "post-ejaculatory-urinalysis",
    "fertility-testing",
    "male-tests",
    "test",
    "Post-Ejaculatory Urinalysis",
    "Urine examination immediately after ejaculation to diagnose retrograde semen flow.",
    {
      order: 12,
      overview: [
        "Post-Ejaculatory Urinalysis checks for the presence of sperm in urine.",
        "This helps identify Retrograde Ejaculation, where semen flows backward into the bladder instead of moving outward.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Dry Ejaculation", description: "Lack of or low semen volume during climax." },
        { icon: "Microscope", title: "Urine Sperm Check", description: "Verifies if sperm is redirecting into the bladder." }
      ],
      relatedServiceSlugs: ["semen-analysis", "icsi"],
      faqs: [
        { q: "How is retrograde ejaculation managed?", a: "It can be managed with specific medications or by harvesting sperm from post-ejaculation urine for IUI/IVF." }
      ]
    }
  ),


  // ------------------ SUBGROUP: both-partners (3 items) ------------------
  createService(
    "infectious-disease-screening",
    "fertility-testing",
    "both-partners",
    "test",
    "Infectious Disease Screening",
    "Mandatory safety screens checking both partners for HIV, Hepatitis B/C, and Syphilis before fertility procedures.",
    {
      order: 13,
      overview: [
        "Infectious Disease Screening is a mandatory safety check for both partners before IUI or IVF.",
        "This protects both partners, the clinic lab environment, and prevents transmission risks to the fetus.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Viral Markers", description: "HIV, HBsAg, and HCV blood screening." },
        { icon: "Stethoscope", title: "Syphilis Check", description: "VDRL blood panels for both partners." }
      ],
      relatedServiceSlugs: ["ivf", "iui", "comprehensive-fertility-panels"],
      faqs: [
        { q: "Is screening required before every cycle?", a: "Infectious disease screenings are valid for a specific period (typically 6-12 months) before they must be repeated." }
      ]
    }
  ),

  createService(
    "cross-matching-tests",
    "fertility-testing",
    "both-partners",
    "test",
    "Cross-Matching & Immune Tests",
    "Advanced compatibility assessments of partners' immune markers, ordered in recurrent failed cycles.",
    {
      order: 14,
      overview: [
        "Cross-Matching and Immunological Testing evaluates immune system compatibility factors between partners.",
        "This helps screen for antibodies or HLA mismatches that could contribute to recurrent pregnancy loss.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "ShieldAlert", title: "Immune Compatibility", description: "Checking HLA compatibility profiles." },
        { icon: "Stethoscope", title: "Antiphospholipid Screen", description: "Excluding maternal autoimmune factors that block transfer success." }
      ],
      relatedServiceSlugs: ["genetic-testing", "ivf"],
      faqs: [
        { q: "Who needs immunological testing?", a: "It is reserved for couples facing recurrent failed transfers or repeated miscarriages." }
      ]
    }
  ),

  createService(
    "comprehensive-fertility-panels",
    "fertility-testing",
    "both-partners",
    "test",
    "Comprehensive Fertility Panels",
    "A combined screening panel checking hormones, sperm, group, and metabolic markers for both partners.",
    {
      order: 15,
      overview: [
        "Comprehensive Fertility Panels compile core screenings for both partners in a single assessment.",
        "It combines hormone profiles, semen analysis, infectious disease screens, and basic metabolic panels for an efficient evaluation.",
        "The appropriate diagnostics are selected after specialist evaluation and may vary according to the patient's clinical presentation."
      ],
      symptoms: [
        { icon: "Stethoscope", title: "Initial Assessment", description: "Combines blood checks and physical scans." },
        { icon: "UsersRound", title: "Dual Profiling", description: "Evaluating both male and female factors simultaneously." }
      ],
      relatedServiceSlugs: ["semen-analysis", "hormonal-testing-female", "ultrasound-scans"],
      faqs: [
        { q: "Does the panel save time?", a: "Yes, completing tests together helps outline a clear treatment pathway in a single follow-up visit." }
      ]
    }
  )
]

export const lockedServiceCategorySlugs = serviceCategories.map((category) => category.slug)
export const lockedServiceSlugs = subServices.map((service) => service.slug)

export const serviceDepartments = subServices.map((service, index) => ({
  id: service.slug,
  name: service.title,
  serviceSlug: service.slug,
  categoryId: service.category,
  subgroup: service.subgroup,
  order: index + 1,
  active: true,
}))

function itemMatches(item, locked) {
  if (!item || !locked) return false
  return item.id === locked.id || item.slug === locked.slug || item.name === locked.name
}

function findLockedCandidate(candidates, locked) {
  return candidates.find((item) => itemMatches(item, locked))
}

function normalizeTextFallback(value, fallback) {
  if (typeof value === 'string' && value.trim()) {
    const trimmed = value.trim()
    if (trimmed !== 'Camp Registration') {
      return trimmed
    }
  }
  return fallback
}

export function getServiceCategoryUrl(category) {
  return `/services/${category.slug || category.id}`
}

export function getServiceSubgroupUrl(subgroup) {
  const slug = typeof subgroup === 'string' ? subgroup : subgroup.slug
  return `/services/fertility-testing/${slug}`
}

export function getServiceUrl(service, categories = serviceCategories) {
  const categoryId = service.categoryId || service.category
  const category = categories.find((item) => item.id === categoryId || item.slug === categoryId)
  const categorySlug = category?.slug || categoryId
  return service.subgroup
    ? `/services/${categorySlug}/${service.subgroup}/${service.slug}`
    : `/services/${categorySlug}/${service.slug}`
}

export function getLockedServiceCategories(candidateCategories = [], options = {}) {
  const candidates = Array.isArray(candidateCategories) ? candidateCategories : []
  const includeInactive = options.includeInactive === true

  return serviceCategories
    .map((locked) => {
      const candidate = findLockedCandidate(candidates, locked) || {}
      return {
        ...locked,
        ...candidate,
        id: locked.id,
        slug: locked.slug,
        title: normalizeTextFallback(candidate.title, locked.title),
        shortTitle: normalizeTextFallback(candidate.shortTitle, locked.shortTitle),
        order: candidate.order !== undefined && candidate.order !== '' ? Number(candidate.order) : locked.order,
        active: candidate.active === false ? false : locked.active !== false,
      }
    })
    .filter((category) => includeInactive || category.active !== false)
}

export function getLockedSubServices(candidateServices = [], options = {}) {
  const candidates = Array.isArray(candidateServices) ? candidateServices : []
  const includeInactive = options.includeInactive === true

  // 1. Process all candidates from Firestore
  const processedCandidates = candidates.map((candidate) => {
    // Find if this candidate matches a static locked service by ID, slug, or title
    const locked = subServices.find((s) => s.id === candidate.id || s.slug === candidate.slug || s.title === candidate.title) || {}
    
    const categoryId = candidate.categoryId || candidate.category || locked.category || 'fertility-treatments'
    const subgroup = candidate.subgroup !== undefined ? candidate.subgroup : locked.subgroup
    const pageType = candidate.pageType || locked.pageType || (categoryId === 'fertility-testing' ? 'test' : 'treatment')
    const slug = candidate.slug || locked.slug || candidate.id

    const normalized = {
      ...locked,
      ...candidate,
      id: candidate.id || locked.id,
      slug: slug,
      category: categoryId,
      categoryId: categoryId,
      subgroup: subgroup || undefined,
      pageType: pageType,
      title: normalizeTextFallback(candidate.title, locked.title || 'Untitled Service'),
      shortDescription: normalizeTextFallback(candidate.shortDescription || candidate.tagline, locked.shortDescription || ''),
      order: candidate.order !== undefined && candidate.order !== '' ? Number(candidate.order) : (locked.order !== undefined ? locked.order : 99),
      active: candidate.active === false ? false : (locked.active === false ? false : !candidate.deletedAt),
    }

    return {
      ...normalized,
      seo: {
        ...locked.seo,
        ...(candidate.seo || {}),
        canonicalPath: getServiceUrl(normalized),
      },
    }
  })

  // 2. Add any static locked services that are NOT present in the Firestore candidates list
  const missingLocked = subServices
    .filter((locked) => !processedCandidates.some((processed) => processed.id === locked.id || processed.slug === locked.slug))
    .map((locked) => ({
      ...locked,
      seo: {
        ...locked.seo,
        canonicalPath: getServiceUrl(locked),
      }
    }))

  // 3. Merge them together
  const allServices = [...processedCandidates, ...missingLocked]

  // 4. Filter according to active/deleted parameters and category validity
  return allServices.filter((service) => {
    const hasValidCategory = serviceCategories.some((cat) => cat.id === service.categoryId || cat.slug === service.categoryId)
    if (!hasValidCategory) return false

    if (service.deletedAt) {
      return includeInactive
    }
    return includeInactive || service.active !== false
  })
}

export function getLockedServiceDepartments(candidateDepartments = [], options = {}) {
  const candidates = Array.isArray(candidateDepartments) ? candidateDepartments : []
  const includeInactive = options.includeInactive === true

  const lockedResults = serviceDepartments.map((locked) => {
    const candidate = findLockedCandidate(candidates, locked) || {}
    return {
      ...locked,
      ...candidate,
      id: locked.id,
      name: normalizeTextFallback(candidate.name, locked.name),
      serviceSlug: locked.serviceSlug,
      categoryId: locked.categoryId,
      subgroup: locked.subgroup,
      order: candidate.order !== undefined && candidate.order !== '' ? Number(candidate.order) : locked.order,
      active: candidate.active === false ? false : locked.active,
    }
  })

  const extraResults = candidates
    .filter((candidate) => !findLockedCandidate(serviceDepartments, candidate))
    .map((candidate) => ({
      ...candidate,
      id: candidate.id || candidate.slug,
      name: candidate.name || candidate.title || 'Untitled Department',
      serviceSlug: candidate.serviceSlug || candidate.slug || candidate.id,
      categoryId: candidate.categoryId || candidate.category || 'fertility-treatments',
      subgroup: candidate.subgroup || undefined,
      order: candidate.order !== undefined && candidate.order !== '' ? Number(candidate.order) : 99,
      active: candidate.active !== false,
    }))

  return [...lockedResults, ...extraResults]
    .filter((department) => includeInactive || department.active !== false)
}

export function getAllServiceUrls(categories = serviceCategories, services = subServices) {
  const lockedCategories = getLockedServiceCategories(categories, { includeInactive: true })
  const lockedServices = getLockedSubServices(services, { includeInactive: true })
  return [
    '/services',
    ...lockedCategories.map((category) => getServiceCategoryUrl(category)),
    ...serviceSubgroups.map((subgroup) => getServiceSubgroupUrl(subgroup)),
    ...lockedServices.map((service) => getServiceUrl(service, lockedCategories)),
  ]
}
