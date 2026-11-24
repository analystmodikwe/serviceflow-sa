import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listProviders, type ProviderWithServices } from '../lib/bookingApi'
import { formatRands } from '../lib/providerHelpers'

const CATEGORIES = ['All', 'Barbers', 'Braiders', 'Nail techs', 'Car wash', 'Other']

export default function BrowsePage() {
  const [providers, setProviders] = useState<ProviderWithServices[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    void listProviders().then((res) => {
      if (res.error) {
        setError(res.error)
      } else {
        setProviders(res.providers)
      }
      setLoading(false)
    })
  }, [])

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const matchesCategory =
        selectedCategory === 'All' || provider.category === selectedCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        provider.business_name
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [providers, selectedCategory, searchQuery])

  function getMinPrice(provider: ProviderWithServices): number | null {
    if (!provider.services || provider.services.length === 0) return null
    return Math.min(...provider.services.map((s) => s.price_cents))
  }

  if (loading) {
    return <p role="status" className="text-sm text-brand-700">Loading providers...</p>
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">Browse Providers</h1>
        <p className="mt-1 text-sm text-muted">
          Find and book trusted local service providers in your area.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div>
          <label htmlFor="search-providers" className="sr-only">
            Search providers
          </label>
          <input
            id="search-providers"
            type="search"
            placeholder="Search by business name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md rounded-card border border-brand-100 bg-surface px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-brand-700 text-surface'
                    : 'border border-brand-100 bg-surface text-brand-700 hover:bg-brand-50'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Provider List */}
      {filteredProviders.length === 0 ? (
        <div className="rounded-card border border-brand-100 bg-surface p-8 text-center text-sm text-muted">
          No providers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map((provider) => {
            const minPriceCents = getMinPrice(provider)
            return (
              <article
                key={provider.id}
                className="flex flex-col justify-between rounded-card border border-brand-100 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-brand-900">
                      {provider.business_name}
                    </h2>
                    {provider.is_verified && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 border border-brand-100">
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                    {provider.category}
                  </span>
                  {provider.bio ? (
                    <p className="line-clamp-2 text-sm text-muted">{provider.bio}</p>
                  ) : (
                    <p className="text-sm italic text-muted">No description provided.</p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-brand-100 pt-4">
                  <div>
                    {minPriceCents !== null ? (
                      <p className="text-xs text-muted">
                        From{' '}
                        <span className="text-base font-bold text-brand-700">
                          {formatRands(minPriceCents)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-muted">No active services</p>
                    )}
                  </div>
                  <Link
                    to={`/p/${provider.slug}`}
                    className="rounded-card bg-brand-700 px-3.5 py-1.5 text-xs font-semibold text-surface transition-colors hover:bg-brand-600"
                  >
                    View and book
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
