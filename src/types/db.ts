export type ProviderStatus = 'active' | 'suspended'

export interface ProviderRow {
  id: string
  profile_id: string
  business_name: string
  slug: string
  category: string
  bio: string
  status: ProviderStatus
  is_verified: boolean
  created_at: string
}

export interface ProviderUpsert {
  profile_id: string
  business_name: string
  slug: string
  category: string
  bio: string
}

export interface ServiceRow {
  id: string
  provider_id: string
  name: string
  price_cents: number
  duration_min: number
  is_active: boolean
  created_at: string
}

export interface ServiceInput {
  name: string
  price_cents: number
  duration_min: number
  is_active?: boolean
}
