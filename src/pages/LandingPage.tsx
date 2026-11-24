import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { homePathForRole } from '../auth/AuthContext'
import { useAuth } from '../auth/useAuth'
import { listProviders, type ProviderWithServices } from '../lib/bookingApi'
import { formatRands } from '../lib/providerHelpers'

const CATEGORIES = [
  { name: 'Barbers', desc: 'Fades, beard trims & classic cuts' },
  { name: 'Braiders', desc: 'Knotless, box braids & protective styles' },
  { name: 'Nail techs', desc: 'Manicures, gel & acrylic sets' },
  { name: 'Car wash', desc: 'Mobile valets & exterior detailing' },
  { name: 'Other', desc: 'Massage, makeup & wellness services' },
]

export default function LandingPage() {
  const { session, role } = useAuth()
  const [featuredProviders, setFeaturedProviders] = useState<ProviderWithServices[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchFailed, setFetchFailed] = useState(false)

  useEffect(() => {
    let isMounted = true
    void listProviders().then((res) => {
      if (!isMounted) return
      if (res.error) {
        setFetchFailed(true)
      } else {
        // Take up to 3 real active providers
        setFeaturedProviders(res.providers.slice(0, 3))
      }
      setLoading(false)
    })
    return () => {
      isMounted = false
    }
  }, [])

  function getMinPrice(provider: ProviderWithServices): number | null {
    if (!provider.services || provider.services.length === 0) return null
    return Math.min(...provider.services.map((s) => s.price_cents))
  }

  return (
    <div className="space-y-20 py-4 sm:py-8">
      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-700 sm:text-5xl lg:text-6xl">
            Book trusted local services in seconds.
          </h1>
          <p className="max-w-2xl text-lg text-ink sm:text-xl">
            Barbers, braiders, nail techs and more across South Africa. Pick a time
            that works, and your provider confirms.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/browse"
              className="rounded-card bg-accent-500 px-6 py-3.5 text-base font-bold text-brand-700 shadow-sm transition-colors hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-accent-500"
            >
              Find a provider
            </Link>
            {session ? (
              <Link
                to={homePathForRole(role)}
                className="rounded-card border border-brand-600 bg-surface px-6 py-3.5 text-base font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                Go to your dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="rounded-card border border-brand-600 bg-surface px-6 py-3.5 text-base font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                I'm a provider
              </Link>
            )}
          </div>
        </div>

        {/* Right side: Real Active Providers / Skeleton / Illustration */}
        <div className="lg:col-span-5">
          {loading ? (
            <div className="space-y-3" aria-busy="true" aria-label="Loading featured providers">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-card border border-brand-100 bg-surface p-4 shadow-sm"
                >
                  <div className="h-5 w-3/4 rounded bg-brand-100" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-brand-50" />
                  <div className="mt-4 h-4 w-1/3 rounded bg-brand-50" />
                </div>
              ))}
            </div>
          ) : fetchFailed || featuredProviders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-card border border-brand-100 bg-surface p-8 text-center shadow-sm">
              <img
                src="/brand/brand-icon.svg"
                alt="ServiceFlow SA icon"
                className="h-20 w-20 text-brand-500"
              />
              <h2 className="mt-4 text-lg font-bold text-brand-700">
                Independent services made simple
              </h2>
              <p className="mt-1 text-sm text-muted">
                Explore our growing directory of barbers, braiders and local specialists.
              </p>
              <Link
                to="/browse"
                className="mt-4 text-sm font-semibold text-brand-700 hover:underline"
              >
                Browse providers &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Featured providers
              </p>
              {featuredProviders.map((provider) => {
                const minPrice = getMinPrice(provider)
                return (
                  <article
                    key={provider.id}
                    className="flex flex-col justify-between rounded-card border border-brand-100 bg-surface p-4 shadow-sm transition-all hover:border-brand-500 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-brand-700">
                          {provider.business_name}
                        </h2>
                        {provider.is_verified && (
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 border border-brand-100">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-muted">
                        {provider.category}
                      </p>
                      {minPrice !== null && (
                        <p className="mt-1 text-xs text-brand-700">
                          From{' '}
                          <span className="font-bold">
                            {formatRands(minPrice)}
                          </span>
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/p/${provider.slug}`}
                      className="mt-3 inline-block rounded-card bg-brand-600 px-3 py-1.5 text-center text-xs font-semibold text-surface transition-colors hover:bg-brand-700 sm:mt-0"
                    >
                      Book
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* 2. How it works */}
      <section className="space-y-8 border-t border-brand-100 pt-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-700">How it works</h2>
          <p className="mt-2 text-muted">
            Three simple steps to secure your next booking.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-card border border-brand-100 bg-surface p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-700">
              1. Choose a service & provider
            </h3>
            <p className="mt-2 text-sm text-ink">
              Browse profiles, verified businesses, ratings, and transparent upfront pricing in ZAR.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-card border border-brand-100 bg-surface p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-700">
              2. Pick a time that suits you
            </h3>
            <p className="mt-2 text-sm text-ink">
              View live provider availability in SAST with no double-booking clashes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-card border border-brand-100 bg-surface p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-700">
              3. Get confirmed by your provider
            </h3>
            <p className="mt-2 text-sm text-ink">
              Receive confirmation directly from the business without back-and-forth messaging.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      <section className="space-y-8 border-t border-brand-100 pt-16">
        <div>
          <h2 className="text-3xl font-bold text-brand-700">Browse by category</h2>
          <p className="mt-2 text-muted">
            Explore trusted specialists by service type.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/browse?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col justify-between rounded-card border border-brand-100 bg-surface p-5 shadow-sm transition-all hover:border-brand-500 hover:shadow-md"
            >
              <div>
                <h3 className="text-lg font-bold text-brand-700">{cat.name}</h3>
                <p className="mt-1 text-xs text-muted">{cat.desc}</p>
              </div>
              <span className="mt-4 text-xs font-semibold text-brand-700">
                Explore &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. For service providers band */}
      <section className="rounded-card bg-brand-900 px-6 py-12 text-white shadow-md sm:px-12 sm:py-16">
        <div className="max-w-3xl space-y-4">
          <span className="inline-block rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold tracking-wide text-white">
            For Service Providers
          </span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Stop losing bookings to WhatsApp and paper diaries.
          </h2>
          <p className="text-base text-white/80 sm:text-lg">
            ServiceFlow SA gives independent South African service pros the tools
            to look professional and get booked smoothly.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-1">
            <h3 className="font-bold text-white">One shareable link</h3>
            <p className="text-sm text-white/75">
              Share your custom booking link on Instagram, WhatsApp and TikTok.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white">No double-bookings</h3>
            <p className="text-sm text-white/75">
              Database exclusion constraints block overlapping client requests automatically.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white">All in one dashboard</h3>
            <p className="text-sm text-white/75">
              Confirm or decline bookings, edit services and set working hours with ease.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            to="/signup"
            className="inline-block rounded-card bg-accent-500 px-6 py-3.5 text-base font-bold text-brand-700 transition-colors hover:bg-accent-600"
          >
            Create your provider profile
          </Link>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="rounded-card border border-brand-100 bg-surface px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
        <h2 className="text-3xl font-bold text-brand-700 sm:text-4xl">
          Ready to book?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink">
          Browse verified providers across South Africa and reserve your appointment in seconds.
        </p>
        <div className="mt-8">
          <Link
            to="/browse"
            className="inline-block rounded-card bg-accent-500 px-8 py-3.5 text-base font-bold text-brand-700 shadow-sm transition-colors hover:bg-accent-600"
          >
            Find a provider
          </Link>
        </div>
      </section>
    </div>
  )
}
