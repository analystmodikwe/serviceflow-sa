import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  listAllProviders,
  listRecentBookings,
  setProviderStatus,
  setProviderVerified,
} from '../../lib/adminApi'
import { filterProviders, summariseProviders } from '../../lib/adminHelpers'
import { formatSastBookingRange } from '../../lib/dates'
import type {
  AdminBookingRow,
  AdminProviderRow,
  BookingStatus,
  ProviderStatus,
} from '../../types/db'

function ProviderStatusChip({ status }: { status: ProviderStatus }) {
  const isActive = status === 'active'
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        isActive
          ? 'bg-green-100 text-status-confirmed'
          : 'bg-red-100 text-status-cancelled'
      }`}
    >
      {status}
    </span>
  )
}

function BookingStatusChip({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    pending: 'bg-amber-100 text-status-pending',
    confirmed: 'bg-green-100 text-status-confirmed',
    cancelled: 'bg-red-100 text-status-cancelled',
    declined: 'bg-red-100 text-status-cancelled',
    completed: 'bg-teal-100 text-status-completed',
  }

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        styles[status] || 'bg-gray-100 text-muted'
      }`}
    >
      {status}
    </span>
  )
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) {
    return <span className="text-xs text-muted">Unverified</span>
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
      <svg
        className="h-3.5 w-3.5 text-brand-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      Verified
    </span>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading admin dashboard">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-20 animate-pulse rounded-card border border-brand-100 bg-surface p-4 shadow-sm"
          >
            <div className="h-3 w-16 rounded bg-brand-100" />
            <div className="mt-3 h-6 w-10 rounded bg-brand-100" />
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-card border border-brand-100 bg-surface p-5 shadow-sm">
        <div className="h-5 w-40 animate-pulse rounded bg-brand-100" />
        <div className="h-12 w-full animate-pulse rounded bg-brand-100" />
        <div className="h-12 w-full animate-pulse rounded bg-brand-100" />
        <div className="h-12 w-full animate-pulse rounded bg-brand-100" />
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [providers, setProviders] = useState<AdminProviderRow[]>([])
  const [bookings, setBookings] = useState<AdminBookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')

  const [activeTab, setActiveTab] = useState<'providers' | 'bookings'>('providers')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ProviderStatus>('all')

  const [savingId, setSavingId] = useState<string | null>(null)
  const [confirmSuspendProvider, setConfirmSuspendProvider] =
    useState<AdminProviderRow | null>(null)

  const fetchDashboardData = useCallback(async () => {
    const [providersRes, bookingsRes] = await Promise.all([
      listAllProviders(),
      listRecentBookings(50),
    ])

    if (providersRes.error) {
      setLoadError(providersRes.error)
      setLoading(false)
      return
    }
    if (bookingsRes.error) {
      setLoadError(bookingsRes.error)
      setLoading(false)
      return
    }

    setProviders(providersRes.providers)
    setBookings(bookingsRes.bookings)
    setLoading(false)
  }, [])

  useEffect(() => {
    let isMounted = true
    void Promise.all([listAllProviders(), listRecentBookings(50)]).then(
      ([providersRes, bookingsRes]) => {
        if (!isMounted) return
        if (providersRes.error) {
          setLoadError(providersRes.error)
          setLoading(false)
          return
        }
        if (bookingsRes.error) {
          setLoadError(bookingsRes.error)
          setLoading(false)
          return
        }
        setProviders(providersRes.providers)
        setBookings(bookingsRes.bookings)
        setLoading(false)
      },
    )
    return () => {
      isMounted = false
    }
  }, [])

  function handleRetry() {
    setLoading(true)
    setLoadError('')
    void fetchDashboardData()
  }

  const summary = useMemo(() => summariseProviders(providers), [providers])
  const filteredProviders = useMemo(
    () => filterProviders(providers, { search, status: statusFilter }),
    [providers, search, statusFilter],
  )

  const totalBookings = useMemo(
    () => providers.reduce((sum, p) => sum + p.booking_count, 0),
    [providers],
  )
  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === 'pending').length,
    [bookings],
  )

  async function handleToggleVerified(provider: AdminProviderRow) {
    setActionError('')
    setSavingId(provider.id)
    const res = await setProviderVerified(provider.id, !provider.is_verified)
    setSavingId(null)

    if (res.error) {
      setActionError(res.error)
      return
    }

    if (res.provider) {
      const updated = res.provider
      setProviders((prev) =>
        prev.map((item) =>
          item.id === updated.id
            ? { ...item, is_verified: updated.is_verified }
            : item,
        ),
      )
    }
  }

  async function handleChangeStatus(
    provider: AdminProviderRow,
    nextStatus: ProviderStatus,
  ) {
    setActionError('')
    setSavingId(provider.id)
    const res = await setProviderStatus(provider.id, nextStatus)
    setSavingId(null)
    setConfirmSuspendProvider(null)

    if (res.error) {
      setActionError(res.error)
      return
    }

    if (res.provider) {
      const updated = res.provider
      setProviders((prev) =>
        prev.map((item) =>
          item.id === updated.id ? { ...item, status: updated.status } : item,
        ),
      )
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Verify providers, manage account status, and monitor recent bookings.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : loadError ? (
        <div
          role="alert"
          className="rounded-card border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm"
        >
          <p className="font-semibold">Could not load admin dashboard</p>
          <p className="mt-1">{loadError}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 rounded-card bg-accent-500 px-4 py-2 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-card border border-brand-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-muted">Providers</p>
              <p className="mt-1 text-2xl font-bold text-brand-700">{summary.total}</p>
            </div>
            <div className="rounded-card border border-brand-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-muted">Active</p>
              <p className="mt-1 text-2xl font-bold text-status-confirmed">
                {summary.active}
              </p>
            </div>
            <div className="rounded-card border border-brand-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-muted">Suspended</p>
              <p className="mt-1 text-2xl font-bold text-status-cancelled">
                {summary.suspended}
              </p>
            </div>
            <div className="rounded-card border border-brand-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-muted">Verified</p>
              <p className="mt-1 text-2xl font-bold text-brand-700">
                {summary.verified}
              </p>
            </div>
            <div className="rounded-card border border-brand-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-muted">Pending bookings</p>
              <p className="mt-1 text-2xl font-bold text-status-pending">
                {pendingBookings}
              </p>
            </div>
            <div className="rounded-card border border-brand-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-muted">Total bookings</p>
              <p className="mt-1 text-2xl font-bold text-brand-700">
                {totalBookings}
              </p>
            </div>
          </div>

          {actionError && (
            <p
              role="alert"
              className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {actionError}
            </p>
          )}

          {/* Tabs */}
          <div className="flex border-b border-brand-100" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'providers'}
              onClick={() => setActiveTab('providers')}
              className={`border-b-2 px-5 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-500 ${
                activeTab === 'providers'
                  ? 'border-brand-700 text-brand-700'
                  : 'border-transparent text-muted hover:text-brand-900'
              }`}
            >
              Providers ({providers.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'bookings'}
              onClick={() => setActiveTab('bookings')}
              className={`border-b-2 px-5 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-500 ${
                activeTab === 'bookings'
                  ? 'border-brand-700 text-brand-700'
                  : 'border-transparent text-muted hover:text-brand-900'
              }`}
            >
              Bookings ({bookings.length})
            </button>
          </div>

          {activeTab === 'providers' ? (
            <div className="space-y-4">
              {/* Search & Status filter */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-sm">
                  <label htmlFor="admin-provider-search" className="sr-only">
                    Search providers
                  </label>
                  <input
                    id="admin-provider-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by business, owner, or category..."
                    className="w-full rounded-card border border-brand-100 bg-white px-3.5 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-brand-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by status">
                  {(['all', 'active', 'suspended'] as const).map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setStatusFilter(statusOption)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-500 ${
                        statusFilter === statusOption
                          ? 'bg-brand-700 text-white'
                          : 'border border-brand-100 bg-white text-brand-700 hover:bg-brand-50'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              </div>

              {filteredProviders.length === 0 ? (
                <div className="rounded-card border border-brand-100 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm font-medium text-ink">
                    No providers match your filters
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden overflow-x-auto rounded-card border border-brand-100 bg-white shadow-sm md:block">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="border-b border-brand-100 bg-surface text-xs font-semibold uppercase tracking-wide text-muted">
                        <tr>
                          <th scope="col" className="px-4 py-3">Business</th>
                          <th scope="col" className="px-4 py-3">Owner</th>
                          <th scope="col" className="px-4 py-3">Category</th>
                          <th scope="col" className="px-4 py-3">Status</th>
                          <th scope="col" className="px-4 py-3">Verification</th>
                          <th scope="col" className="px-4 py-3 text-right">Bookings</th>
                          <th scope="col" className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-100">
                        {filteredProviders.map((provider) => {
                          const isSaving = savingId === provider.id
                          return (
                            <tr
                              key={provider.id}
                              className="transition-colors duration-150 hover:bg-surface/60"
                            >
                              <td className="px-4 py-3 font-semibold text-brand-700">
                                <Link
                                  to={`/p/${provider.slug}`}
                                  className="hover:underline focus-visible:outline-2 focus-visible:outline-brand-500"
                                >
                                  {provider.business_name}
                                </Link>
                              </td>
                              <td className="px-4 py-3 text-ink">
                                {provider.owner?.full_name || '—'}
                              </td>
                              <td className="px-4 py-3 text-muted">{provider.category}</td>
                              <td className="px-4 py-3">
                                <ProviderStatusChip status={provider.status} />
                              </td>
                              <td className="px-4 py-3">
                                <VerifiedBadge verified={provider.is_verified} />
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-ink">
                                {provider.booking_count}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="inline-flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={() => void handleToggleVerified(provider)}
                                    className="rounded-card border border-brand-100 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors duration-150 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-500"
                                  >
                                    {provider.is_verified
                                      ? 'Remove verification'
                                      : 'Verify'}
                                  </button>
                                  {provider.status === 'active' ? (
                                    <button
                                      type="button"
                                      disabled={isSaving}
                                      onClick={() => setConfirmSuspendProvider(provider)}
                                      className="rounded-card border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-status-cancelled transition-colors duration-150 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-500"
                                    >
                                      Suspend
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={isSaving}
                                      onClick={() =>
                                        void handleChangeStatus(provider, 'active')
                                      }
                                      className="rounded-card bg-accent-500 px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-500"
                                    >
                                      Reactivate
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Cards */}
                  <div className="space-y-3 md:hidden">
                    {filteredProviders.map((provider) => {
                      const isSaving = savingId === provider.id
                      return (
                        <article
                          key={provider.id}
                          className="rounded-card border border-brand-100 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Link
                                to={`/p/${provider.slug}`}
                                className="text-base font-bold text-brand-700 hover:underline focus-visible:outline-2 focus-visible:outline-brand-500"
                              >
                                {provider.business_name}
                              </Link>
                              <p className="mt-0.5 text-xs text-muted">
                                {provider.owner?.full_name || '—'} · {provider.category}
                              </p>
                            </div>
                            <ProviderStatusChip status={provider.status} />
                          </div>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <VerifiedBadge verified={provider.is_verified} />
                            <span className="font-medium text-ink">
                              {provider.booking_count}{' '}
                              {provider.booking_count === 1 ? 'booking' : 'bookings'}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => void handleToggleVerified(provider)}
                              className="flex-1 rounded-card border border-brand-100 bg-white px-3 py-2 text-xs font-semibold text-brand-700 transition-colors duration-150 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-500"
                            >
                              {provider.is_verified ? 'Remove verification' : 'Verify'}
                            </button>
                            {provider.status === 'active' ? (
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => setConfirmSuspendProvider(provider)}
                                className="flex-1 rounded-card border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-status-cancelled transition-colors duration-150 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-500"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() =>
                                  void handleChangeStatus(provider, 'active')
                                }
                                className="flex-1 rounded-card bg-accent-500 px-3 py-2 text-xs font-semibold text-ink transition-colors duration-150 hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-500"
                              >
                                Reactivate
                              </button>
                            )}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Bookings Tab */
            <div>
              {bookings.length === 0 ? (
                <div className="rounded-card border border-brand-100 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm font-medium text-ink">No bookings yet.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden overflow-x-auto rounded-card border border-brand-100 bg-white shadow-sm md:block">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="border-b border-brand-100 bg-surface text-xs font-semibold uppercase tracking-wide text-muted">
                        <tr>
                          <th scope="col" className="px-4 py-3">Provider</th>
                          <th scope="col" className="px-4 py-3">Customer</th>
                          <th scope="col" className="px-4 py-3">Service</th>
                          <th scope="col" className="px-4 py-3">Date & Time (SAST)</th>
                          <th scope="col" className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-100">
                        {bookings.map((booking) => (
                          <tr
                            key={booking.id}
                            className="transition-colors duration-150 hover:bg-surface/60"
                          >
                            <td className="px-4 py-3 font-semibold text-brand-700">
                              {booking.provider?.business_name || 'Unknown provider'}
                            </td>
                            <td className="px-4 py-3 text-ink">
                              {booking.customer?.full_name || 'Unknown customer'}
                            </td>
                            <td className="px-4 py-3 text-ink">
                              {booking.service?.name ?? (
                                <span className="italic text-muted">
                                  Service no longer available
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted">
                              {formatSastBookingRange(booking.start_at, booking.end_at)}
                            </td>
                            <td className="px-4 py-3">
                              <BookingStatusChip status={booking.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Cards */}
                  <div className="space-y-3 md:hidden">
                    {bookings.map((booking) => (
                      <article
                        key={booking.id}
                        className="rounded-card border border-brand-100 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-brand-700">
                              {booking.provider?.business_name || 'Unknown provider'}
                            </p>
                            <p className="mt-0.5 text-xs text-ink">
                              Customer: {booking.customer?.full_name || 'Unknown customer'}
                            </p>
                          </div>
                          <BookingStatusChip status={booking.status} />
                        </div>
                        <p className="mt-2 text-xs text-ink">
                          {booking.service?.name ?? (
                            <span className="italic text-muted">
                              Service no longer available
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {formatSastBookingRange(booking.start_at, booking.end_at)}
                        </p>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Suspend Confirmation Modal */}
      {confirmSuspendProvider && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="suspend-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/50 p-4"
        >
          <div className="w-full max-w-md rounded-card border border-brand-100 bg-white p-6 shadow-lg">
            <h2
              id="suspend-dialog-title"
              className="text-lg font-bold text-brand-700"
            >
              Suspend {confirmSuspendProvider.business_name}?
            </h2>
            <p className="mt-2 text-sm text-ink">
              This provider will disappear from public browse immediately and will not
              be able to receive new bookings from customers. You can reactivate them
              anytime.
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={savingId === confirmSuspendProvider.id}
                onClick={() => setConfirmSuspendProvider(null)}
                className="rounded-card border border-brand-100 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition-colors duration-150 hover:bg-brand-50 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-500"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingId === confirmSuspendProvider.id}
                onClick={() =>
                  void handleChangeStatus(confirmSuspendProvider, 'suspended')
                }
                className="rounded-card bg-status-cancelled px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-red-700 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-500"
              >
                {savingId === confirmSuspendProvider.id
                  ? 'Suspending...'
                  : 'Confirm suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
