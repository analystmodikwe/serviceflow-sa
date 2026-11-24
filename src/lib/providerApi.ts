import { supabase } from './supabase'
import type {
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
