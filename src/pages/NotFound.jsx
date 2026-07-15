import { Link } from 'react-router-dom'
import { Seo } from '../components/shared/Seo'
import { Button } from '../components/shared/Button'

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you requested was not found." />
      <section className="grid min-h-[60vh] place-items-center bg-brand-cream px-4 py-16 text-center">
        <div>
          <p className="text-sm font-black uppercase text-brand-rose">404</p>
          <h1 className="mt-2 text-4xl font-black text-brand-navy">Page not found</h1>
          <p className="mt-3 text-slate-600">The page may have moved or the link may be incorrect.</p>
          <Button as={Link} to="/" className="mt-6">Go Home</Button>
        </div>
      </section>
    </>
  )
}
