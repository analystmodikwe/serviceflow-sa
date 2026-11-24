import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import {
  getProviderAvailability,
  getProviderProfile,
  saveProviderAvailability,
} from '../../lib/providerApi'
import type { AvailabilityInput, ProviderRow } from '../../types/db'

// Seven days Monday..Sunday with weekday 1..6 for Mon..Sat, 0 for Sun
interface DaySchedule {
  weekday: number
  label: string
  enabled: boolean
  start_time: string
  end_time: string
}

const DEFAULT_SCHEDULE: DaySchedule[] = [
  { weekday: 1, label: 'Monday', enabled: true, start_time: '09:00', end_time: '17:00' },
  { weekday: 2, label: 'Tuesday', enabled: true, start_time: '09:00', end_time: '17:00' },
  { weekday: 3, label: 'Wednesday', enabled: true, start_time: '09:00', end_time: '17:00' },
  { weekday: 4, label: 'Thursday', enabled: true, start_time: '09:00', end_time: '17:00' },
  { weekday: 5, label: 'Friday', enabled: true, start_time: '09:00', end_time: '17:00' },
  { weekday: 6, label: 'Saturday', enabled: false, start_time: '09:00', end_time: '17:00' },
  { weekday: 0, label: 'Sunday', enabled: false, start_time: '09:00', end_time: '17:00' },
]

// Normalizes "09:00:00" to "09:00" for standard time inputs
function formatTimeValue(timeStr: string): string {
  if (!timeStr) return '09:00'
  const parts = timeStr.split(':')
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
  }
  return timeStr
}

export default function AvailabilityPage() {
  const { session } = useAuth()
  const [provider, setProvider] = useState<ProviderRow | null>(null)
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!session) return

    void getProviderProfile(session.user.id).then(async (result) => {
      setProvider(result.provider)
      if (result.error) setError(result.error)

      if (result.provider) {
        const availResult = await getProviderAvailability(result.provider.id)
        if (availResult.error) {
          setError(availResult.error)
        } else {
          // Merge loaded rows into default template
          const existingMap = new Map(
            availResult.availability.map((row) => [row.weekday, row]),
          )

          setSchedule(
            DEFAULT_SCHEDULE.map((day) => {
              const existing = existingMap.get(day.weekday)
              if (existing) {
                return {
                  ...day,
                  enabled: true,
                  start_time: formatTimeValue(existing.start_time),
                  end_time: formatTimeValue(existing.end_time),
                }
              }
              return {
                ...day,
                enabled: false,
              }
            }),
          )
        }
      }
      setLoading(false)
    })
  }, [session])

  function handleToggle(weekday: number) {
    setSuccess('')
    setError('')
    setSchedule((prev) =>
      prev.map((day) =>
        day.weekday === weekday ? { ...day, enabled: !day.enabled } : day,
      ),
    )
  }

  function handleTimeChange(
    weekday: number,
    field: 'start_time' | 'end_time',
    value: string,
  ) {
    setSuccess('')
    setError('')
    setSchedule((prev) =>
      prev.map((day) =>
        day.weekday === weekday ? { ...day, [field]: value } : day,
      ),
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    // Validate that start < end for all enabled days
    for (const day of schedule) {
      if (day.enabled) {
        if (!day.start_time || !day.end_time) {
          setError(`Please select both start and end time for ${day.label}.`)
          return
        }
        if (day.start_time >= day.end_time) {
          setError(`Start time must be before end time for ${day.label}.`)
          return
        }
      }
    }

    if (!provider) return

    setSaving(true)
    const enabledDays: AvailabilityInput[] = schedule
      .filter((day) => day.enabled)
      .map((day) => ({
        weekday: day.weekday,
        start_time: day.start_time,
        end_time: day.end_time,
      }))

    const disabledWeekdays = schedule
      .filter((day) => !day.enabled)
      .map((day) => day.weekday)

    const result = await saveProviderAvailability(
      provider.id,
      enabledDays,
      disabledWeekdays,
    )

    setSaving(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Working hours saved successfully.')
    }
  }

  if (loading) {
    return <p role="status" className="text-sm text-brand-700">Loading availability...</p>
  }

  if (!provider) {
    return (
      <section>
        <h1 className="text-3xl font-bold text-brand-700">Availability</h1>
        <div className="mt-5 rounded-card border border-brand-100 bg-surface p-5 shadow-sm">
          <p>Set up your business profile before managing working hours.</p>
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

  return (
    <section>
      <h1 className="text-3xl font-bold text-brand-700">Availability</h1>
      <p className="mt-1 text-sm text-muted">
        Set your weekly working hours when customers can book appointments.
      </p>

      {error && (
        <p role="alert" className="mt-5 rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="mt-5 rounded-card bg-brand-50 border border-brand-100 px-4 py-3 text-sm text-brand-700">
          {success}
        </p>
      )}

      <form className="mt-6 max-w-2xl space-y-3" onSubmit={handleSubmit}>
        <div className="divide-y divide-brand-100 rounded-card border border-brand-100 bg-surface shadow-sm">
          {schedule.map((day) => (
            <div
              key={day.weekday}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3 sm:w-44">
                <input
                  type="checkbox"
                  id={`toggle-${day.weekday}`}
                  checked={day.enabled}
                  onChange={() => handleToggle(day.weekday)}
                  className="h-4 w-4 rounded text-brand-500 focus:ring-brand-500"
                />
                <label
                  htmlFor={`toggle-${day.weekday}`}
                  className="cursor-pointer text-sm font-semibold select-none"
                >
                  {day.label}
                </label>
              </div>

              {day.enabled ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    aria-label={`${day.label} start time`}
                    value={day.start_time}
                    onChange={(e) =>
                      handleTimeChange(day.weekday, 'start_time', e.target.value)
                    }
                    className="rounded-card border border-brand-100 bg-white px-3 py-1.5 text-sm"
                  />
                  <span className="text-sm text-muted">to</span>
                  <input
                    type="time"
                    aria-label={`${day.label} end time`}
                    value={day.end_time}
                    onChange={(e) =>
                      handleTimeChange(day.weekday, 'end_time', e.target.value)
                    }
                    className="rounded-card border border-brand-100 bg-white px-3 py-1.5 text-sm"
                  />
                </div>
              ) : (
                <span className="text-sm italic text-muted">Closed / Unavailable</span>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-card bg-accent-500 px-5 py-3 font-semibold text-ink transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save availability'}
        </button>
      </form>
    </section>
  )
}
