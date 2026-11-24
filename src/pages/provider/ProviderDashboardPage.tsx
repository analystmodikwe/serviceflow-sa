import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import {
  formatSastBookingRange,
  isSameSastDay,
  startOfSastWeek,
} from '../../lib/dates'
import {
  getProviderBookings,
  getProviderProfile,
  updateBookingStatus,
} from '../../lib/providerApi'
import type { BookingRow, BookingStatus, ProviderRow } from '../../types/db'

function StatusChip({ status }: { status: BookingStatus }) {
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

export default function ProviderDashboardPage() {
  const { session } = useAuth()
  const [provider, setProvider] = useState<ProviderRow | null>(null)
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function loadBookings(providerId: string) {
    const result = await getProviderBookings(providerId)
    if (result.error) {
      setError(result.error)
    } else {
      setBookings(result.bookings)
    }
  }

  useEffect(() => {
    if (!session) return

    void getProviderProfile(session.user.id).then(async (result) => {
      setProvider(result.provider)
      if (result.error) setError(result.error)
      if (result.provider) {
        await loadBookings(result.provider.id)
      }
      setLoading(false)
    })
  }, [session])

  async function copyPublicLink() {
    if (!provider) return
    await navigator.clipboard.writeText(
      `${window.location.origin}/p/${provider.slug}`,
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleStatusChange(bookingId: string, newStatus: BookingStatus) {
    setError('')
    setUpdatingId(bookingId)
    const result = await updateBookingStatus(bookingId, newStatus)
    setUpdatingId(null)

    if (result.error) {
      setError(result.error)
    } else if (provider) {
      await loadBookings(provider.id)
    }
  }

  if (loading) {
    return <p role="status" className="text-sm text-brand-700">Loading dashboard...</p>
  }

  if (!provider) {
    return (
      <section>
        <h1 className="text-3xl font-bold text-brand-700">Dashboard</h1>
        <div className="mt-5 rounded-card border border-brand-100 bg-surface p-5 shadow-sm">
          <p>Set up your business profile before viewing your dashboard.</p>
          <Link
            to="/provider/profile"
            className="mt-3 inline-block rounded-card bg-accent-500 px-4 py-2 font-semibold text-ink transition-colors hover:bg-accent-600"
          >
            Set up profile
          </Link>
        </div>
      </section>
    )
  }

  // Compute stats in SAST
  const now = new Date()
  const weekStart = startOfSastWeek(now)
  // End of week is next Monday 00:00:00 SAST
  const nextWeekStart = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

  const pendingCount = bookings.filter((b) => b.status === 'pending').length

  const todayCount = bookings.filter((b) => {
    // Check if start_at is same SAST day as today
    return isSameSastDay(b.start_at, now)
  }).length

  const weekCount = bookings.filter((b) => {
    const bookingTime = new Date(b.start_at).getTime()
    return bookingTime >= weekStart.getTime() && bookingTime < nextWeekStart.getTime()
  }).length

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-700">Dashboard</h1>
          <p className="text-sm text-muted">
            Overview of your schedule, appointments, and booking link.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Public Booking Link Card */}
      <div className="flex flex-col gap-2 rounded-card border border-brand-100 bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Public booking link
          </p>
          <p className="break-all text-sm font-medium text-brand-900">
            {window.location.origin}/p/{provider.slug}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void copyPublicLink()}
          className="rounded-card bg-brand-700 px-4 py-2 text-sm font-semibold text-surface transition-colors hover:bg-brand-600"
        >
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-brand-100 bg-surface p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Pending requests
          </p>
          <p className="mt-2 text-3xl font-bold text-brand-700">{pendingCount}</p>
        </div>
        <div className="rounded-card border border-brand-100 bg-surface p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Bookings today
          </p>
          <p className="mt-2 text-3xl font-bold text-brand-700">{todayCount}</p>
        </div>
        <div className="rounded-card border border-brand-100 bg-surface p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Bookings this week
          </p>
          <p className="mt-2 text-3xl font-bold text-brand-700">{weekCount}</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-brand-700">Appointments</h2>

        {bookings.length === 0 ? (
          <div className="rounded-card border border-brand-100 bg-surface p-6 text-center text-sm text-muted">
            No bookings yet. Share your booking link to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const isUpdating = updatingId === booking.id
              const customerName = booking.customer?.full_name || 'Customer'
              const serviceName = booking.service?.name || 'Service'

              return (
                <article
                  key={booking.id}
                  className="flex flex-col gap-4 rounded-card border border-brand-100 bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-brand-900">
                        {customerName}
                      </span>
                      <span className="text-muted">·</span>
                      <span className="text-sm font-medium text-brand-700">
                        {serviceName}
                      </span>
                      <StatusChip status={booking.status} />
                    </div>
                    <p className="text-sm text-muted">
                      {formatSastBookingRange(booking.start_at, booking.end_at)}
                    </p>
                    {booking.notes && (
                      <p className="text-xs italic text-muted">Note: {booking.notes}</p>
                    )}
                  </div>

                  {/* Actions depending on booking status */}
                  <div className="flex flex-wrap items-center gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => void handleStatusChange(booking.id, 'confirmed')}
                          className="rounded-card bg-brand-700 px-3 py-1.5 text-xs font-semibold text-surface transition-colors hover:bg-brand-600 disabled:opacity-60"
                        >
                          {isUpdating ? 'Saving...' : 'Confirm'}
                        </button>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => void handleStatusChange(booking.id, 'declined')}
                          className="rounded-card border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                        >
                          {isUpdating ? 'Saving...' : 'Decline'}
                        </button>
                      </>
                    )}

                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => void handleStatusChange(booking.id, 'completed')}
                          className="rounded-card bg-brand-700 px-3 py-1.5 text-xs font-semibold text-surface transition-colors hover:bg-brand-600 disabled:opacity-60"
                        >
                          {isUpdating ? 'Saving...' : 'Mark completed'}
                        </button>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => void handleStatusChange(booking.id, 'cancelled')}
                          className="rounded-card border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                        >
                          {isUpdating ? 'Saving...' : 'Cancel'}
                        </button>
                      </>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
