import { supabase } from './supabase'
import type {
  AvailabilityInput,
  AvailabilityRow,
  BookingRow,
  BookingStatus,
  ProviderRow,
  ProviderUpsert,
  ServiceInput,
  ServiceRow,
} from '../types/db'

export function errorMessage(error: { message?: string } | null): string {
  return error?.message || 'Something went wrong. Please try again.'
}

export async function getProviderProfile(
  profileId: string,
): Promise<{ provider: ProviderRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('profile_id', profileId)
    .maybeSingle()

  return {
    provider: error ? null : (data as ProviderRow | null),
    error: error ? errorMessage(error) : null,
  }
}

export async function slugExists(
  slug: string,
  excludeProviderId?: string,
): Promise<{ exists: boolean; error: string | null }> {
  let query = supabase
    .from('providers')
    .select('id')
    .eq('slug', slug)
    .limit(1)

  if (excludeProviderId) query = query.neq('id', excludeProviderId)
  const { data, error } = await query

  return {
    exists: Boolean(data && data.length > 0),
    error: error ? errorMessage(error) : null,
  }
}

export async function upsertProviderProfile(
  input: ProviderUpsert,
  providerId?: string,
): Promise<{ provider: ProviderRow | null; error: string | null }> {
  const query = providerId
    ? supabase
        .from('providers')
        .update({
          business_name: input.business_name,
          category: input.category,
          bio: input.bio,
          slug: input.slug,
        })
        .eq('id', providerId)
        .select('*')
        .single()
    : supabase
        .from('providers')
        .insert(input)
        .select('*')
        .single()

  const { data, error } = await query
  return {
    provider: error ? null : (data as ProviderRow),
    error: error ? errorMessage(error) : null,
  }
}

export async function getProviderServices(
  providerId: string,
): Promise<{ services: ServiceRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: true })

  return {
    services: error ? [] : (data as ServiceRow[]),
    error: error ? errorMessage(error) : null,
  }
}

export async function createProviderService(
  providerId: string,
  input: ServiceInput,
): Promise<{ service: ServiceRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('services')
    .insert({ provider_id: providerId, ...input })
    .select('*')
    .single()

  return {
    service: error ? null : (data as ServiceRow),
    error: error ? errorMessage(error) : null,
  }
}

export async function updateProviderService(
  serviceId: string,
  input: Partial<ServiceInput>,
): Promise<{ service: ServiceRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('services')
    .update(input)
    .eq('id', serviceId)
    .select('*')
    .single()

  return {
    service: error ? null : (data as ServiceRow),
    error: error ? errorMessage(error) : null,
  }
}

export async function getProviderAvailability(
  providerId: string,
): Promise<{ availability: AvailabilityRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('provider_id', providerId)
    .order('weekday', { ascending: true })

  return {
    availability: error ? [] : (data as AvailabilityRow[]),
    error: error ? errorMessage(error) : null,
  }
}

/**
 * Saves availability for a provider by upserting enabled days and deleting disabled days.
 */
export async function saveProviderAvailability(
  providerId: string,
  enabledDays: AvailabilityInput[],
  disabledWeekdays: number[],
): Promise<{ success: boolean; error: string | null }> {
  if (disabledWeekdays.length > 0) {
    const { error: delError } = await supabase
      .from('availability')
      .delete()
      .eq('provider_id', providerId)
      .in('weekday', disabledWeekdays)

    if (delError) {
      return { success: false, error: errorMessage(delError) }
    }
  }

  if (enabledDays.length > 0) {
    const rows = enabledDays.map((day) => ({
      provider_id: providerId,
      weekday: day.weekday,
      start_time: day.start_time,
      end_time: day.end_time,
    }))

    const { error: upsertError } = await supabase
      .from('availability')
      .upsert(rows, { onConflict: 'provider_id,weekday' })

    if (upsertError) {
      return { success: false, error: errorMessage(upsertError) }
    }
  }

  return { success: true, error: null }
}

export async function getProviderBookings(
  providerId: string,
): Promise<{ bookings: BookingRow[]; error: string | null }> {
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
      customer:profiles!bookings_customer_id_fkey(id, full_name, phone),
      service:services!bookings_service_id_fkey(id, name, price_cents, duration_min)
    `)
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })

  return {
    bookings: error ? [] : (data as unknown as BookingRow[]),
    error: error ? errorMessage(error) : null,
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  return {
    success: !error,
    error: error ? errorMessage(error) : null,
  }
}
