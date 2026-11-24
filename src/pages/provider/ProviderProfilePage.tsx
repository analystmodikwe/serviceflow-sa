import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../../auth/useAuth'
import {
  getProviderProfile,
  slugExists,
  upsertProviderProfile,
} from '../../lib/providerApi'
import { slugify, validateSlug } from '../../lib/providerHelpers'
import type { ProviderRow } from '../../types/db'

const categories = ['Barbers', 'Braiders', 'Nail techs', 'Car wash', 'Other']

export default function ProviderProfilePage() {
  const { session } = useAuth()
  const [provider, setProvider] = useState<ProviderRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (!session) return
    void getProviderProfile(session.user.id).then((result) => {
      setError(result.error || '')
      setProvider(result.provider)
      if (result.provider) {
        setBusinessName(result.provider.business_name)
        setSlug(result.provider.slug)
        setCategory(result.provider.category)
        setBio(result.provider.bio)
      }
      setLoading(false)
    })
  }, [session])

  function handleBusinessName(value: string) {
    setBusinessName(value)
    if (!provider) setSlug(slugify(value))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!businessName.trim()) {
      setError('Enter your business name.')
      return
    }
    const slugError = validateSlug(slug)
    if (slugError) {
      setError(slugError)
      return
    }
    if (!session) return

    setSaving(true)
    const availability = await slugExists(slug, provider?.id)
    if (availability.error) {
      setError(availability.error)
      setSaving(false)
      return
    }
    if (availability.exists) {
      setError('That public link is already taken. Try a different slug.')
      setSaving(false)
      return
    }

    const result = await upsertProviderProfile(
      {
        profile_id: session.user.id,
        business_name: businessName.trim(),
        slug,
        category,
        bio: bio.trim(),
      },
      provider?.id,
    )
    setSaving(false)
    if (result.error) setError(result.error)
    if (result.provider) {
      setProvider(result.provider)
      setError('')
    }
  }

  async function copyPublicLink() {
    if (!provider) return
    await navigator.clipboard.writeText(`${window.location.origin}/p/${provider.slug}`)
    setCopied(true)
  }

  if (loading) {
    return <p role="status" className="text-sm text-brand-700">Loading business profile...</p>
  }

  return (
    <section>
      <h1 className="text-3xl font-bold text-brand-700">
        {provider ? 'Business profile' : 'Set up your business'}
      </h1>

      {provider && (
        <div className="mt-5 flex flex-col gap-2 rounded-card border border-brand-100 bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-700">Public link</p>
            <p className="break-all text-sm">/p/{provider.slug}</p>
          </div>
          <button
            type="button"
            onClick={() => void copyPublicLink()}
            className="rounded-card bg-brand-700 px-4 py-2 text-sm font-semibold text-surface transition-colors hover:bg-brand-600"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-5 rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form className="mt-6 max-w-xl space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium" htmlFor="business-name">
          Business name
          <input
            id="business-name"
            required
            value={businessName}
            onChange={(event) => handleBusinessName(event.target.value)}
            className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
          />
        </label>

        <label className="block text-sm font-medium" htmlFor="business-category">
          Category
          <select
            id="business-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium" htmlFor="business-bio">
          Bio
          <textarea
            id="business-bio"
            rows={4}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
          />
        </label>

        <label className="block text-sm font-medium" htmlFor="business-slug">
          Public link name
          <input
            id="business-slug"
            required
            value={slug}
            onChange={(event) => setSlug(event.target.value.toLowerCase())}
            className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
          />
          <span className="mt-1 block text-xs text-brand-700">/p/{slugify(slug)}</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-card bg-accent-500 px-5 py-3 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : provider ? 'Save changes' : 'Create business'}
        </button>
      </form>
    </section>
  )
}
