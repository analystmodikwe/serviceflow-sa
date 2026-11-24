import { supabase } from './supabase'
import type {
  AvailabilityRow,
  BookingRow,
  BookingStatus,
  ProviderRow,
  ServiceRow,
} from '../types/db'

export function errorMessage(error: { message?: string } | null): string {
  return error?.message || 'Something went wrong. Please try again.'
}

export interface ProviderWithServices extends ProviderRow {
  services: ServiceRow[]
}

export interface ProviderDetail extends ProviderRow {
  services: ServiceRow[]
  availability: AvailabilityRow[]
}

export interface BusySlot {
  start_at: string
  end_at: string
}

export interface CreateBookingInput {
  customer_id: string
  provider_id: string
  service_id: string
  start_at: string
  end_at: string
  notes?: string | null
}

export interface CustomerBookingRow extends BookingRow {
  provider: {
    id: string
    business_name: string
    slug: string
  } | null
  service: {
    id: string
    name: string
    price_cents: number
    duration_min: number
  } | null
}

/**
 * Lists active providers along with their active services.
 */
export async function listProviders(): Promise<{
  providers: ProviderWithServices[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from('providers')
    .select(`
      *,
      services (*)
    `)
    .eq('status', 'active')
    .eq('services.is_active', true)
    .order('business_name', { ascending: true })

  if (error) {
    return { providers: [], error: errorMessage(error) }
  }

  // Ensure services array is attached
  const providers = (data || []).map((p) => ({
    ...p,
    services: (p.services || []) as ServiceRow[],
  })) as ProviderWithServices[]

  return { providers, error: null }
}

/**
 * Gets an active provider by slug, including active services and availability.
 */
export async function getProviderBySlug(
  slug: string,
): Promise<{ provider: ProviderDetail | null; error: string | null }> {
  const { data: providerData, error: providerError } = await supabase
    .from('providers')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()

  if (providerError) {
    return { provider: null, error: errorMessage(providerError) }
  }

  if (!providerData) {
    return { provider: null, error: null }
  }

  const [servicesRes, availRes] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .eq('provider_id', providerData.id)
      .eq('is_active', true)
      .order('price_cents', { ascending: true }),
    supabase
      .from('availability')
      .select('*')
      .eq('provider_id', providerData.id)
      .order('weekday', { ascending: true }),
  ])

  if (servicesRes.error) {
    return { provider: null, error: errorMessage(servicesRes.error) }
  }
  if (availRes.error) {
    return { provider: null, error: errorMessage(availRes.error) }
  }

  return {
    provider: {
      ...providerData,
      services: (servicesRes.data || []) as ServiceRow[],
      availability: (availRes.data || []) as AvailabilityRow[],
    },
    error: null,
  }
}

/**
 * Fetches busy slot ranges for a provider between two UTC/ISO timestamps via RPC get_busy_slots.
 */
export async function getBusySlots(
  providerId: string,
  fromIso: string,
  toIso: string,
): Promise<{ busy: BusySlot[]; error: string | null }> {
  const { data, error } = await supabase.rpc('get_busy_slots', {
    p_provider_id: providerId,
    p_from: fromIso,
    p_to: toIso,
  })

  if (error) {
    return { busy: [], error: errorMessage(error) }
  }

  return { busy: (data || []) as BusySlot[], error: null }
}

/**
 * Creates a new booking for a customer.
 */
export async function createBooking(
  input: CreateBookingInput,
): Promise<{ booking: BookingRow | null; error: string | null; isConflict?: boolean }> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: input.customer_id,
      provider_id: input.provider_id,
      service_id: input.service_id,
      start_at: input.start_at,
      end_at: input.end_at,
      status: 'pending',
      notes: input.notes?.trim() || null,
    })
    .select('*')
    .single()

  if (error) {
    // 23P01 is PostgreSQL exclusion_violation
    const isConflict = error.code === '23P01'
    const errorMsg = isConflict
      ? 'That time was just taken, please pick another slot'
      : errorMessage(error)
    return { booking: null, error: errorMsg, isConflict }
  }

  return { booking: data as BookingRow, error: null }
}

/**
 * Lists all bookings for the signed-in customer.
 */
export async function listMyBookings(
  customerId: string,
): Promise<{ bookings: CustomerBookingRow[]; error: string | null }> {
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
      service:services!bookings_service_id_fkey(id, name, price_cents, duration_min)
    `)
    .eq('customer_id', customerId)
    .order('start_at', { ascending: false })

  if (error) {
    return { bookings: [], error: errorMessage(error) }
  }

  return { bookings: (data || []) as unknown as CustomerBookingRow[], error: null }
}

/**
 * Cancels a booking (customer-initiated cancellation).
 */
export async function cancelBooking(
  bookingId: string,
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' as BookingStatus })
    .eq('id', bookingId)

  if (error) {
    return { success: false, error: errorMessage(error) }
  }

  return { success: true, error: null }
}
