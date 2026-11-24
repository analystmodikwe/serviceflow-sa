import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import {
  createBooking,
  getBusySlots,
  getProviderBySlug,
  type ProviderDetail,
} from '../lib/bookingApi'
import { getSastParts } from '../lib/dates'
import { formatRands } from '../lib/providerHelpers'
import { generateSlots } from '../lib/slots'
import type { ServiceRow } from '../types/db'

// Generates YYYY-MM-DD for a date offset in days from today in SAST
function getSastDateString(offsetDays = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  const parts = getSastParts(date)
  const y = parts.year
  const m = String(parts.month).padStart(2, '0')
  const d = String(parts.day).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Formats a slot (UTC Date) to HH:mm in SAST
function formatSlotTimeSast(date: Date): string {
  const parts = getSastParts(date)
  const hh = String(parts.hour).padStart(2, '0')
  const mm = String(parts.minute).padStart(2, '0')
  return `${hh}:${mm}`
}

export default function ProviderPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { session, role } = useAuth()

  const [provider, setProvider] = useState<ProviderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedService, setSelectedService] = useState<ServiceRow | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(getSastDateString(0))
  const [openSlots, setOpenSlots] = useState<Date[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Min and max date attributes
  const minDate = getSastDateString(0)
  const maxDate = getSastDateString(30)

  // Load provider details
  useEffect(() => {
    if (!slug) return
    setLoading(true)
    void getProviderBySlug(slug).then((res) => {
      if (res.error) {
        setError(res.error)
      } else {
        setProvider(res.provider)
        if (res.provider && res.provider.services.length > 0) {
          setSelectedService(res.provider.services[0])
        }
      }
      setLoading(false)
    })
  }, [slug])

  // Load slots whenever service, date, or provider changes
  useEffect(() => {
    if (!provider || !selectedService || !selectedDate) {
      setOpenSlots([])
      setSelectedSlot(null)
      return
    }

    setSlotsLoading(true)
    setSelectedSlot(null)

    // SAST day range in UTC: YYYY-MM-DD 00:00:00 SAST is (00 - 2) = -02:00 UTC
    // and next day 00:00:00 SAST is 22:00 UTC
    const [year, month, day] = selectedDate.split('-').map(Number)
    const fromUtc = new Date(Date.UTC(year, month - 1, day, -2, 0, 0)).toISOString()
    const toUtc = new Date(Date.UTC(year, month - 1, day, 22, 0, 0)).toISOString()

    void getBusySlots(provider.id, fromUtc, toUtc).then((res) => {
      if (res.error) {
        setError(res.error)
        setOpenSlots([])
      } else {
        const slots = generateSlots({
          date: selectedDate,
          availability: provider.availability,
          durationMin: selectedService.duration_min,
          busy: res.busy,
          now: new Date(),
        })
        setOpenSlots(slots)
      }
      setSlotsLoading(false)
    })
  }, [provider, selectedService, selectedDate])

  async function handleBookingSubmit() {
    if (!selectedService || !selectedSlot || !provider) return
    if (!session) return

    setSubmitting(true)
    setError('')

    const startAt = selectedSlot.toISOString()
    const endAt = new Date(
      selectedSlot.getTime() + selectedService.duration_min * 60 * 1000,
    ).toISOString()

    const result = await createBooking({
      customer_id: session.user.id,
      provider_id: provider.id,
      service_id: selectedService.id,
      start_at: startAt,
      end_at: endAt,
      notes: notes.slice(0, 300),
    })

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      // Refresh slots if there was a conflict
      if (result.isConflict) {
        // Trigger slots re-fetch
        setSelectedSlot(null)
        setSlotsLoading(true)
        const [year, month, day] = selectedDate.split('-').map(Number)
        const fromUtc = new Date(Date.UTC(year, month - 1, day, -2, 0, 0)).toISOString()
        const toUtc = new Date(Date.UTC(year, month - 1, day, 22, 0, 0)).toISOString()
        void getBusySlots(provider.id, fromUtc, toUtc).then((bRes) => {
          if (!bRes.error) {
            setOpenSlots(
              generateSlots({
                date: selectedDate,
                availability: provider.availability,
                durationMin: selectedService.duration_min,
                busy: bRes.busy,
                now: new Date(),
              }),
            )
          }
          setSlotsLoading(false)
        })
      }
      return
    }

    if (result.booking) {
      navigate('/booking-confirmed', {
        state: {
          booking: result.booking,
          provider: {
            business_name: provider.business_name,
            slug: provider.slug,
          },
          service: selectedService,
          start_at: startAt,
          end_at: endAt,
        },
      })
    }
  }

  if (loading) {
    return <p role="status" className="text-sm text-brand-700">Loading provider...</p>
  }

  if (!provider) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-brand-700">Provider not found</h1>
        <p className="text-sm text-muted">
          The service provider you are looking for does not exist or is inactive.
        </p>
        <Link
          to="/browse"
          className="inline-block rounded-card bg-accent-500 px-4 py-2 font-semibold text-ink transition-colors hover:bg-accent-600"
        >
          Browse providers
        </Link>
      </section>
    )
  }

  // Check if provider has availability configured for selectedDate
  const [sYear, sMonth, sDay] = selectedDate.split('-').map(Number)
  const currentWeekday = new Date(Date.UTC(sYear, sMonth - 1, sDay, 12, 0, 0)).getUTCDay()
  const hasAvailabilityForDay = provider.availability.some(
    (a) => a.weekday === currentWeekday,
  )

  const isCustomer = session && role === 'customer'
  const isButtonDisabled =
    !selectedService || !selectedSlot || submitting || !isCustomer

  return (
    <section className="space-y-6">
      {/* Header Info */}
      <div className="rounded-card border border-brand-100 bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-brand-900">
            {provider.business_name}
          </h1>
          {provider.is_verified && (
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 border border-brand-100">
              Verified
            </span>
          )}
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            {provider.category}
          </span>
        </div>
        {provider.bio && <p className="mt-3 text-sm text-muted">{provider.bio}</p>}
      </div>

      {error && (
        <p role="alert" className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Main Booking Area: Grid on desktop */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Services, Date, Slots, Notes */}
        <div className="space-y-6 lg:col-span-2">
          {/* 1. Services */}
          <div>
            <h2 className="text-xl font-bold text-brand-700">1. Select a service</h2>
            {provider.services.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No active services offered.</p>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {provider.services.map((service) => {
                  const isSelected = selectedService?.id === service.id
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className={`flex flex-col justify-between rounded-card border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500'
                          : 'border-brand-100 bg-surface hover:border-brand-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-brand-900">{service.name}</p>
                        <p className="text-xs text-muted">
                          {service.duration_min} minutes
                        </p>
                      </div>
                      <p className="mt-3 text-sm font-bold text-brand-700">
                        {formatRands(service.price_cents)}
                      </p>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* 2. Date Picker */}
          <div>
            <h2 className="text-xl font-bold text-brand-700">2. Choose a date</h2>
            <div className="mt-3">
              <input
                type="date"
                id="booking-date"
                min={minDate}
                max={maxDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full max-w-xs rounded-card border border-brand-100 bg-surface px-4 py-2.5 text-sm font-medium"
              />
            </div>
          </div>

          {/* 3. Slot Picker */}
          <div>
            <h2 className="text-xl font-bold text-brand-700">3. Select a time slot</h2>
            {slotsLoading ? (
              <p className="mt-3 text-sm text-muted">Checking available times...</p>
            ) : !hasAvailabilityForDay ? (
              <p className="mt-3 rounded-card border border-brand-100 bg-surface p-4 text-sm italic text-muted">
                Not available on this day
              </p>
            ) : openSlots.length === 0 ? (
              <p className="mt-3 rounded-card border border-brand-100 bg-surface p-4 text-sm text-muted">
                No open slots remaining for this date.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {openSlots.map((slot) => {
                  const timeLabel = formatSlotTimeSast(slot)
                  const isSelected =
                    selectedSlot?.toISOString() === slot.toISOString()
                  return (
                    <button
                      key={slot.toISOString()}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-card py-2 px-3 text-center text-sm font-semibold transition-all ${
                        isSelected
                          ? 'bg-brand-700 text-surface shadow'
                          : 'border border-brand-100 bg-surface text-brand-900 hover:bg-brand-50'
                      }`}
                    >
                      {timeLabel}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* 4. Notes Textarea */}
          <div>
            <label
              htmlFor="booking-notes"
              className="block text-sm font-semibold text-brand-700"
            >
              Notes for the provider (optional)
            </label>
            <textarea
              id="booking-notes"
              rows={3}
              maxLength={300}
              placeholder="Any specific requests or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 w-full rounded-card border border-brand-100 bg-surface p-3 text-sm focus:outline-none"
            />
            <span className="text-xs text-muted">{notes.length}/300 characters</span>
          </div>
        </div>

        {/* Right Col: Booking Summary & Action */}
        <aside className="sticky top-6 rounded-card border border-brand-100 bg-surface p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-700">Booking Summary</h3>

          <div className="space-y-3 divide-y divide-brand-100 text-sm">
            <div className="pt-2">
              <span className="text-xs text-muted">Provider</span>
              <p className="font-semibold text-brand-900">{provider.business_name}</p>
            </div>
            <div className="pt-2">
              <span className="text-xs text-muted">Service</span>
              <p className="font-semibold text-brand-900">
                {selectedService ? selectedService.name : 'None selected'}
              </p>
              {selectedService && (
                <p className="text-xs text-muted">{selectedService.duration_min} min</p>
              )}
            </div>
            <div className="pt-2">
              <span className="text-xs text-muted">Date & Time</span>
              <p className="font-semibold text-brand-900">
                {selectedSlot
                  ? `${selectedDate} at ${formatSlotTimeSast(selectedSlot)}`
                  : selectedDate || 'No date selected'}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="font-semibold text-brand-900">Total Price</span>
              <span className="text-lg font-bold text-brand-700">
                {selectedService ? formatRands(selectedService.price_cents) : 'R0.00'}
              </span>
            </div>
          </div>

          {/* Auth guards & Submit button */}
          <div className="pt-4 border-t border-brand-100 space-y-3">
            {!session ? (
              <div className="rounded-card bg-brand-50 border border-brand-100 p-3 text-xs text-brand-900 space-y-1">
                <p>Log in or sign up as a customer to book.</p>
                <div className="flex gap-2 font-semibold">
                  <Link to="/login" className="underline hover:text-brand-700">
                    Log in
                  </Link>
                  <span>·</span>
                  <Link to="/signup" className="underline hover:text-brand-700">
                    Sign up
                  </Link>
                </div>
              </div>
            ) : role !== 'customer' ? (
              <p className="rounded-card bg-amber-50 p-3 text-xs text-amber-800">
                Only customer accounts can make bookings.
              </p>
            ) : null}

            <button
              type="button"
              disabled={isButtonDisabled}
              onClick={() => void handleBookingSubmit()}
              className="w-full rounded-card bg-accent-500 py-3 font-semibold text-ink transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Requesting booking...' : 'Request booking'}
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}
