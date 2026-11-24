import { supabase } from './supabase'
import type {
  AdminBookingRow,
  AdminProviderRow,
  ProviderRow,
  ProviderStatus,
} from '../types/db'

function errorMessage(error: { message?: string } | null): string {
  return error?.message || 'Something went wrong. Please try again.'
}

/**
 * Lists all providers (active and suspended) with owner full_name and total booking count.
 */
export async function listAllProviders(): Promise<{
  providers: AdminProviderRow[]
  error: string | null
}> {
  const [providersRes, bookingsRes] = await Promise.all([
    supabase
      .from('providers')
      .select(`
        id,
        profile_id,
        business_name,
        slug,
        category,
        bio,
        status,
        is_verified,
        created_at,
        owner:profiles!providers_profile_id_fkey(id, full_name)
      `)
      .order('business_name', { ascending: true }),
    supabase.from('bookings').select('provider_id'),
  ])

  if (providersRes.error) {
    return { providers: [], error: errorMessage(providersRes.error) }
  }
  if (bookingsRes.error) {
    return { providers: [], error: errorMessage(bookingsRes.error) }
  }

  const countsByProvider = new Map<string, number>()
  for (const row of bookingsRes.data ?? []) {
    const pid = row.provider_id as string
    countsByProvider.set(pid, (countsByProvider.get(pid) ?? 0) + 1)
  }

  const rawProviders = (providersRes.data ?? []) as unknown as Array<
    ProviderRow & {
      owner: { id: string; full_name: string } | { id: string; full_name: string }[] | null
    }
  >

  const providers: AdminProviderRow[] = rawProviders.map((p) => {
    const ownerObj = Array.isArray(p.owner) ? (p.owner[0] ?? null) : p.owner
    return {
      id: p.id,
      profile_id: p.profile_id,
      business_name: p.business_name,
      slug: p.slug,
      category: p.category,
      bio: p.bio,
      status: p.status,
      is_verified: p.is_verified,
      created_at: p.created_at,
      owner: ownerObj,
      booking_count: countsByProvider.get(p.id) ?? 0,
    }
  })

  return { providers, error: null }
}

/**
 * Updates a provider's status ('active' | 'suspended'). Enforced by DB trigger for admins only.
 */
export async function setProviderStatus(
  id: string,
  status: ProviderStatus,
): Promise<{ provider: ProviderRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('providers')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return { provider: null, error: errorMessage(error) }
  }

  return { provider: data as ProviderRow, error: null }
}

/**
 * Updates a provider's verification badge. Enforced by DB trigger for admins only.
 */
export async function setProviderVerified(
  id: string,
  isVerified: boolean,
): Promise<{ provider: ProviderRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('providers')
    .update({ is_verified: isVerified })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return { provider: null, error: errorMessage(error) }
  }

  return { provider: data as ProviderRow, error: null }
}

/**
 * Lists the most recent bookings across the platform for admin oversight.
 */
export async function listRecentBookings(
  limit = 50,
): Promise<{ bookings: AdminBookingRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      customer_id,
      provider_id,
      service_id,
      start_at,
      end_at,
      status,
      notes,
      created_at,
      provider:providers!bookings_provider_id_fkey(id, business_name, slug),
      customer:profiles!bookings_customer_id_fkey(id, full_name),
      service:services!bookings_service_id_fkey(id, name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return { bookings: [], error: errorMessage(error) }
  }

  const rawBookings = (data ?? []) as unknown as Array<
    Omit<AdminBookingRow, 'provider' | 'customer' | 'service'> & {
      provider:
        | { id: string; business_name: string; slug: string }
        | { id: string; business_name: string; slug: string }[]
        | null
      customer: { id: string; full_name: string } | { id: string; full_name: string }[] | null
      service: { id: string; name: string } | { id: string; name: string }[] | null
    }
  >

  const bookings: AdminBookingRow[] = rawBookings.map((b) => ({
    ...b,
    provider: Array.isArray(b.provider) ? (b.provider[0] ?? null) : b.provider,
    customer: Array.isArray(b.customer) ? (b.customer[0] ?? null) : b.customer,
    service: Array.isArray(b.service) ? (b.service[0] ?? null) : b.service,
  }))

  return { bookings, error: null }
}
