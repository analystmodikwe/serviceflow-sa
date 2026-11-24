import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl rounded-card border border-brand-100 bg-white px-6 py-12 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">404</p>
      <h1 className="mt-2 text-3xl font-bold text-brand-700">Page not found</h1>
      <p className="mt-3 text-sm text-muted">
        Sorry, we could not find the page you were looking for. It may have been
        moved or the link might be incorrect.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-card bg-accent-500 px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          Back to home
        </Link>
        <Link
          to="/browse"
          className="rounded-card border border-brand-100 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors duration-150 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          Browse providers
        </Link>
      </div>
    </section>
  )
}
