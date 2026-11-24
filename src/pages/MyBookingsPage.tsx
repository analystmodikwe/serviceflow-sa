import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { cancelBooking, listMyBookings, type CustomerBookingRow } from '../lib/bookingApi'
import { formatSastBookingRange } from '../lib/dates'
import { formatRands } from '../lib/providerHelpers'
import type { BookingStatus } from '../types/db'

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

export default function MyBookingsPage() {
  const { session } = useAuth()
  const [bookings, setBookings] = useState<CustomerBookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  // Cancellation state
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    let isMounted = true
    void listMyBookings(session.user.id).then((res) => {
      if (!isMounted) return
      if (res.error) {
        setError(res.error)
      } else {
        setBookings(res.bookings)
      }
      setLoading(false)
    })
    return () => {
      isMounted = false
    }
  }, [session])

  async function handleConfirmCancel(bookingId: string) {
    setCancellingId(bookingId)
    setError('')
    const res = await cancelBooking(bookingId)
    setCancellingId(null)
    setConfirmCancelId(null)

    if (res.error) {
      setError(res.error)
    } else if (session) {
      const refreshed = await listMyBookings(session.user.id)
      if (refreshed.error) setError(refreshed.error)
      else setBookings(refreshed.bookings)
    }
  }

  if (loading) {
    return <p role="status" className="text-sm text-brand-700">Loading your bookings...</p>
  }

  // Upcoming: end_at in the future and status is 'pending' or 'confirmed'
  const upcomingBookings = bookings.filter((b) => {
    const isFuture = b.end_at > new Date().toISOString()
    return isFuture && (b.status === 'pending' || b.status === 'confirmed')
  })

  // Past: everything else
  const pastBookings = bookings.filter((b) => {
    const isFuture = b.end_at > new Date().toISOString()
    return !(isFuture && (b.status === 'pending' || b.status === 'confirmed'))
  })

  const currentList = activeTab === 'upcoming' ? upcomingBookings : pastBookings

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">My Bookings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your upcoming appointments and past booking history.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Tabs */}
      <div className="flex border-b border-brand-100">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`border-b-2 px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === 'upcoming'
              ? 'border-brand-700 text-brand-700'
              : 'border-transparent text-muted hover:text-brand-900'
          }`}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`border-b-2 px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === 'past'
              ? 'border-brand-700 text-brand-700'
              : 'border-transparent text-muted hover:text-brand-900'
          }`}
        >
          Past ({pastBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      {currentList.length === 0 ? (
        <div className="rounded-card border border-brand-100 bg-surface p-8 text-center space-y-4 shadow-sm">
          <p className="text-sm text-muted">
            {activeTab === 'upcoming'
              ? 'You have no upcoming bookings.'
              : 'You have no past bookings.'}
          </p>
          <div>
            <Link
              to="/browse"
              className="inline-block rounded-card bg-accent-500 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-accent-600"
            >
              Find a provider
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((booking) => {
            const providerName =
              booking.provider?.business_name || 'Service Provider'
            const providerSlug = booking.provider?.slug
            const serviceName = booking.service
              ? booking.service.name
              : 'Service no longer available'
            const price = booking.service
              ? formatRands(booking.service.price_cents)
              : null

            const isPendingOrConfirmed =
              booking.status === 'pending' || booking.status === 'confirmed'
            const canCancel = activeTab === 'upcoming' && isPendingOrConfirmed
            const isConfirmingThis = confirmCancelId === booking.id
            const isCancellingThis = cancellingId === booking.id

            return (
              <article
                key={booking.id}
                className="flex flex-col gap-4 rounded-card border border-brand-100 bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {providerSlug ? (
                      <Link
                        to={`/p/${providerSlug}`}
                        className="font-bold text-brand-900 hover:underline"
                      >
                        {providerName}
                      </Link>
                    ) : (
                      <span className="font-bold text-brand-900">
                        {providerName}
                      </span>
                    )}
                    <span className="text-muted">·</span>
                    <span className="text-sm font-medium text-brand-700">
                      {serviceName}
                    </span>
                    <BookingStatusChip status={booking.status} />
                  </div>

                  <p className="text-sm text-muted">
                    {formatSastBookingRange(booking.start_at, booking.end_at)}
                  </p>

                  {price && (
                    <p className="text-xs font-semibold text-brand-700">
                      Price: {price}
                    </p>
                  )}

                  {booking.notes && (
                    <p className="text-xs italic text-muted">
                      Note: {booking.notes}
                    </p>
                  )}
                </div>

                {/* Cancel action */}
                {canCancel && (
                  <div className="shrink-0">
                    {isConfirmingThis ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-red-700">
                          Cancel booking?
                        </span>
                        <button
                          type="button"
                          disabled={isCancellingThis}
                          onClick={() => void handleConfirmCancel(booking.id)}
                          className="rounded-card bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                        >
                          {isCancellingThis ? 'Cancelling...' : 'Yes, cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(null)}
                          className="rounded-card border border-brand-100 px-3 py-1.5 text-xs font-semibold text-brand-900 transition-colors hover:bg-brand-50"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmCancelId(booking.id)}
                        className="rounded-card border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        Cancel booking
                      </button>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
