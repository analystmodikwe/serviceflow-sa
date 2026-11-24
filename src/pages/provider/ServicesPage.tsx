import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import {
  createProviderService,
  getProviderProfile,
  getProviderServices,
  updateProviderService,
} from '../../lib/providerApi'
import { formatRands, randsToCents } from '../../lib/providerHelpers'
import type { ProviderRow, ServiceRow } from '../../types/db'

export default function ServicesPage() {
  const { session } = useAuth()
  const [provider, setProvider] = useState<ProviderRow | null>(null)
  const [services, setServices] = useState<ServiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<ServiceRow | null>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')

  async function loadServices(providerId: string) {
    const result = await getProviderServices(providerId)
    setServices(result.services)
    setError(result.error || '')
  }

  useEffect(() => {
    if (!session) return
    void getProviderProfile(session.user.id).then(async (result) => {
      setProvider(result.provider)
      setError(result.error || '')
      if (result.provider) await loadServices(result.provider.id)
      setLoading(false)
    })
  }, [session])

  function openAddForm() {
    setEditing(null)
    setName('')
    setPrice('')
    setDuration('')
    setError('')
    setShowForm(true)
  }

  function openEditForm(service: ServiceRow) {
    setEditing(service)
    setName(service.name)
    setPrice((service.price_cents / 100).toString())
    setDuration(service.duration_min.toString())
    setError('')
    setShowForm(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Enter a service name.')
      return
    }
    const priceCents = randsToCents(price)
    const durationMin = Number(duration)
    if (priceCents === null) {
      setError('Enter a price greater than zero.')
      return
    }
    if (!Number.isInteger(durationMin) || durationMin <= 0) {
      setError('Duration must be a whole number greater than zero.')
      return
    }
    if (!provider) return

    setSaving(true)
    const result = editing
      ? await updateProviderService(editing.id, {
          name: name.trim(),
          price_cents: priceCents,
          duration_min: durationMin,
        })
      : await createProviderService(provider.id, {
          name: name.trim(),
          price_cents: priceCents,
          duration_min: durationMin,
        })
    setSaving(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setShowForm(false)
    await loadServices(provider.id)
  }

  async function toggleActive(service: ServiceRow) {
    setError('')
    const result = await updateProviderService(service.id, {
      is_active: !service.is_active,
    })
    if (result.error) setError(result.error)
    if (provider) await loadServices(provider.id)
  }

  if (loading) {
    return <p role="status" className="text-sm text-brand-700">Loading services...</p>
  }

  if (!provider) {
    return (
      <section>
        <h1 className="text-3xl font-bold text-brand-700">Services</h1>
        <div className="mt-5 rounded-card border border-brand-100 bg-surface p-5 shadow-sm">
          <p>Set up your business profile before adding services.</p>
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
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-brand-700">Services</h1>
        <button
          type="button"
          onClick={openAddForm}
          className="rounded-card bg-accent-500 px-4 py-2 font-semibold text-ink transition-colors hover:bg-accent-600"
        >
          Add service
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {showForm && (
        <form
          className="mt-5 grid max-w-2xl gap-4 rounded-card border border-brand-100 bg-surface p-5 shadow-sm sm:grid-cols-3"
          onSubmit={handleSubmit}
        >
          <label className="block text-sm font-medium sm:col-span-3" htmlFor="service-name">
            Service name
            <input
              id="service-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium" htmlFor="service-price">
            Price (R)
            <input
              id="service-price"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium" htmlFor="service-duration">
            Duration (minutes)
            <input
              id="service-duration"
              type="number"
              min="1"
              step="1"
              required
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
            />
          </label>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-card bg-brand-700 px-4 py-2 font-semibold text-surface transition-colors hover:bg-brand-600 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editing ? 'Save service' : 'Create service'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-card border border-brand-100 px-4 py-2 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {services.length === 0 ? (
        <p className="mt-5 rounded-card border border-brand-100 p-5 text-sm text-brand-700">
          No services yet. Add your first service.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="flex flex-col gap-3 rounded-card border border-brand-100 bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-semibold">{service.name}</h2>
                <p className="text-sm text-brand-700">
                  {formatRands(service.price_cents)} · {service.duration_min} min
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(service)}
                  className="rounded-card border border-brand-100 px-3 py-2 text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void toggleActive(service)}
                  className="rounded-card border border-brand-100 px-3 py-2 text-sm font-semibold"
                >
                  {service.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
