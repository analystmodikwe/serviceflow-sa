import { Link, useLocation, Navigate } from 'react-router-dom'
import { formatSastBookingRange } from '../lib/dates'
import { formatRands } from '../lib/providerHelpers'
import type { BookingRow, ServiceRow } from '../types/db'

interface ConfirmationState {
  booking: BookingRow
  provider: {
    business_name: string
    slug: string
  }
  service: ServiceRow
  start_at: string
  end_at: string
}

export default function BookingConfirmedPage() {
  const location = useLocation()
  const state = location.state as ConfirmationState | null

  if (!state || !state.booking) {
    return <Navigate to="/my-bookings" replace />
  }

  const { provider, service, start_at, end_at, booking } = state

  return (
    <section className="mx-auto max-w-lg space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-status-confirmed">
        <svg
          className="h-10 w-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-brand-700">Booking Requested!</h1>
        <p className="mt-2 text-sm text-muted">
          Your appointment request has been sent to the service provider.
        </p>
      </div>

      <div className="rounded-card border border-brand-100 bg-surface p-6 text-left shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-brand-100 pb-3">
          <span className="text-xs font-semibold uppercase text-muted">Status</span>
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-status-pending">
            Pending provider confirmation
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="text-xs text-muted">Provider</span>
            <p className="font-semibold text-brand-900">{provider.business_name}</p>
          </div>
          <div>
            <span className="text-xs text-muted">Service</span>
            <p className="font-semibold text-brand-900">{service.name}</p>
            <p className="text-xs text-muted">{service.duration_min} minutes · {formatRands(service.price_cents)}</p>
          </div>
          <div>
            <span className="text-xs text-muted">Date & Time</span>
            <p className="font-semibold text-brand-900">
              {formatSastBookingRange(start_at, end_at)}
            </p>
          </div>
          {booking.notes && (
            <div>
              <span className="text-xs text-muted">Notes</span>
              <p className="italic text-muted">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/my-bookings"
          className="rounded-card bg-brand-700 px-5 py-2.5 font-semibold text-surface transition-colors hover:bg-brand-600 text-sm"
        >
          View my bookings
        </Link>
        <Link
          to="/browse"
          className="rounded-card border border-brand-100 bg-surface px-5 py-2.5 font-semibold text-brand-900 transition-colors hover:bg-brand-50 text-sm"
        >
          Browse more providers
        </Link>
      </div>
    </section>
  )
}
