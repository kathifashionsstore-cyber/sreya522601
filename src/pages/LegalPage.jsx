import { Link, useParams } from 'react-router-dom'
import { Seo } from '../components/shared/Seo'
import { settings } from '../mockData/settings'

function PrivacyPolicyContent() {
  return (
    <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
      <p>
        <strong>Last Updated:</strong> July 10, 2026
      </p>
      <p>
        At <strong>Sreya Hospitals &amp; IVF Centre</strong>, your privacy is of utmost importance to us. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you use our services. It also explains your privacy rights and how applicable laws protect you.
      </p>
      <p>
        By using our services, you consent to the practices described in this Privacy Policy.
      </p>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">1. Interpretation and Definitions</h3>
      <h4 className="text-lg font-black text-brand-navy mt-4 mb-2">Interpretation</h4>
      <p>
        Capitalized words have specific meanings as defined below. These definitions apply regardless of their singular or plural form.
      </p>
      <h4 className="text-lg font-black text-brand-navy mt-4 mb-2">Definitions</h4>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Account:</strong> A unique account created to access our services.
        </li>
        <li>
          <strong>Affiliate:</strong> An entity under common ownership or control with our organization.
        </li>
        <li>
          <strong>Company:</strong> Refers to <strong>Sreya Hospitals &amp; IVF Centre</strong>, located at {settings.legalAddress || 'Guntur Road, Narsaraopet, Palnadu District, Andhra Pradesh, India - 522601'}
        </li>
        <li>
          <strong>Cookies:</strong> Small files stored on your device to enhance your experience and provide analytics.
        </li>
        <li>
          <strong>Country:</strong> Refers to <strong>Andhra Pradesh, India</strong>.
        </li>
        <li>
          <strong>Device:</strong> Any electronic device capable of accessing our services.
        </li>
        <li>
          <strong>Personal Data:</strong> Any information that identifies an individual.
        </li>
        <li>
          <strong>Service:</strong> Refers to the website and related offerings of Sreya Hospitals &amp; IVF Centre.
        </li>
        <li>
          <strong>Service Provider:</strong> Third-party entities that assist in delivering and improving our services.
        </li>
        <li>
          <strong>Usage Data:</strong> Data collected automatically, such as browsing details and device information.
        </li>
        <li>
          <strong>Website:</strong> Refers to <strong>Sreya Hospitals &amp; IVF Centre</strong>, accessible at{' '}
          <a href="https://sreyaivfcentre.com/" className="text-brand-teal font-black underline">
            https://sreyaivfcentre.com/
          </a>.
        </li>
        <li>
          <strong>You:</strong> Refers to the user accessing or using the service.
        </li>
      </ul>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">2. Types of Data Collected</h3>
      <h4 className="text-lg font-black text-brand-navy mt-4 mb-2">Personal Data</h4>
      <p>We may collect the following information:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Contact Details:</strong> Name, email address, phone number, and physical address.
        </li>
        <li>
          <strong>Usage Data:</strong> IP address, browser type, device identifiers, and browsing behavior.
        </li>
        <li>
          <strong>Mobile Data:</strong> Mobile device type, operating system, and browser details.
        </li>
      </ul>
      <h4 className="text-lg font-black text-brand-navy mt-4 mb-2">Cookies and Tracking</h4>
      <p>We use Cookies and similar technologies to enhance your experience. Types of Cookies include:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Essential Cookies:</strong> Ensure website functionality and security.
        </li>
        <li>
          <strong>Preference Cookies:</strong> Remember your settings for a personalized experience.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Track and analyze user interactions to improve our service.
        </li>
      </ul>
      <p>You can control or disable Cookies through your browser settings.</p>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">3. How We Use Your Data</h3>
      <p>We use your data for the following purposes:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>To provide, maintain, and enhance our services.</li>
        <li>To manage your account and provide personalized features.</li>
        <li>To communicate with you about updates, promotions, and services.</li>
        <li>To process transactions and fulfill contractual obligations.</li>
        <li>To analyze and improve website performance and user experience.</li>
        <li>For legal, regulatory, and security purposes.</li>
      </ul>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">4. Sharing Your Data</h3>
      <p>We may share your information with:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Service Providers:</strong> To facilitate operations and improve services.
        </li>
        <li>
          <strong>Affiliates:</strong> For seamless coordination across our group entities.
        </li>
        <li>
          <strong>Business Partners:</strong> To provide relevant promotions or offerings.
        </li>
        <li>
          <strong>Legal Authorities:</strong> To comply with legal obligations or enforce our rights.
        </li>
      </ul>
      <p>We never sell your personal data.</p>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">5. Data Retention</h3>
      <p>
        Your personal data is retained only as long as necessary to fulfill the purposes outlined in this policy or as required by law. Usage Data may be retained for analytical purposes to improve service functionality.
      </p>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">6. Data Security</h3>
      <p>
        We implement advanced security measures to safeguard your data. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute data security.
      </p>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">7. Your Privacy Rights</h3>
      <p>You have the right to:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Access, update, or delete your personal data.</li>
        <li>Withdraw consent for specific data uses.</li>
        <li>Restrict or object to data processing in certain situations.</li>
      </ul>
      <p>
        To exercise your rights, contact us at{' '}
        <strong>
          <a href={`mailto:${settings.email}`} className="text-brand-teal font-black underline">
            {settings.email}
          </a>
        </strong>.
      </p>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">8. Children's Privacy</h3>
      <p>
        We do not knowingly collect data from individuals under 13 years of age. If you believe a child has provided us with personal data, please contact us to ensure its deletion.
      </p>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">9. Links to Third-Party Websites</h3>
      <p>
        Our website may contain links to external sites. We are not responsible for the content or privacy practices of third-party websites. We encourage you to review their policies.
      </p>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">10. Updates to This Privacy Policy</h3>
      <p>
        We may revise this Privacy Policy periodically. Updates will be posted on this page with the revised date. Significant changes will be communicated through email or prominent notices.
      </p>

      <h3 className="text-xl font-black text-brand-navy mt-8 mb-4">11. Contact Us</h3>
      <p>For any questions or concerns about this Privacy Policy, you can reach us at:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${settings.email}`} className="text-brand-teal font-black underline">
            {settings.email}
          </a>
        </li>
      </ul>
    </div>
  )
}

const pages = {
  'terms-of-use': {
    title: 'Terms of Use',
    description: 'Website terms for visitors using Sreya Hospitals & IVF Centre online services.',
    sections: [
      ['Use of Website', 'This website is provided for general information, appointment requests, and hospital contact. Do not misuse forms, attempt unauthorized access, or submit false information.'],
      ['Appointments', 'Submitting a request online does not guarantee a confirmed appointment. The hospital team must confirm availability.'],
      ['Content Ownership', 'Text, images, branding, and website materials may not be copied or reused without permission.'],
      ['Availability', 'The website may be updated, paused, or unavailable from time to time for maintenance or technical reasons.'],
    ],
  },
  'medical-disclaimer': {
    title: 'Medical Disclaimer',
    description: 'Medical information on this website is general education and not a diagnosis.',
    sections: [
      ['General Information Only', 'Service descriptions, symptom lists, risk factors, and treatment information are educational and do not replace an in-person consultation.'],
      ['No Online Diagnosis', 'Do not use this website to diagnose yourself or delay urgent care. Treatment suitability depends on examination, history, reports, and doctor assessment.'],
      ['Emergency Care', 'For severe pain, heavy bleeding, fainting, high fever, breathing difficulty, or pregnancy-related emergencies, contact the hospital or emergency services immediately.'],
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    description: 'Cookie and local storage information for the Sreya Hospitals website.',
    sections: [
      ['What Is Stored', 'The site may store cookie acknowledgement, theme cache, language preference, splash/announcement dismissal, and analytics-related browser data.'],
      ['Analytics', 'Firebase Analytics may use cookies or similar technologies to understand aggregate website usage.'],
      ['Your Choice', 'You can clear cookies and local storage in your browser settings. Some preferences may reset after clearing them.'],
    ],
  },
}

export default function LegalPage() {
  const { slug } = useParams()
  const page = pages[slug] || { title: 'Privacy Policy', description: 'How Sreya Hospitals & IVF Centre collects, uses, and protects your information.' }

  return (
    <>
      <Seo title={page.title} description={page.description} />
      <section className="bg-brand-cream px-4 py-16">
        <article className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-soft sm:p-10">
          <Link to="/" className="text-sm font-black text-brand-teal">Back to Home</Link>
          <h1 className="mt-4 text-4xl font-black text-brand-navy mb-6">{page.title}</h1>
          
          {slug === 'privacy-policy' ? (
            <PrivacyPolicyContent />
          ) : (
            <>
              <p className="text-base leading-7 text-slate-600 mb-8">{page.description}</p>
              <div className="grid gap-6">
                {page.sections?.map(([title, body]) => (
                  <section key={title}>
                    <h2 className="text-xl font-black text-brand-navy">{title}</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{body}</p>
                  </section>
                ))}
              </div>
            </>
          )}
        </article>
      </section>
    </>
  )
}
