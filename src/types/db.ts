export type ProviderStatus = 'active' | 'suspended'
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'declined'
  | 'cancelled'
  | 'completed'

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

export interface AvailabilityRow {
  id: string
  provider_id: string
  weekday: number // 0=Sunday..6=Saturday
  start_time: string // HH:mm:ss or HH:mm
  end_time: string // HH:mm:ss or HH:mm
}

export interface AvailabilityInput {
  weekday: number
  start_time: string
  end_time: string
}

export interface BookingRow {
  id: string
  customer_id: string
  provider_id: string
  service_id: string
  start_at: string
  end_at: string
  status: BookingStatus
  notes: string | null
  created_at: string
  customer?: {
    id: string
    full_name: string
    phone?: string | null
  } | null
  service?: {
    id: string
    name: string
    price_cents: number
    duration_min: number
  } | null
}

export interface AdminProviderRow extends ProviderRow {
  owner: {
    id: string
    full_name: string
  } | null
  booking_count: number
}

export interface AdminBookingRow {
  id: string
  customer_id: string
  provider_id: string
  service_id: string
  start_at: string
  end_at: string
  status: BookingStatus
  notes: string | null
  created_at: string
  provider: {
    id: string
    business_name: string
    slug: string
  } | null
  customer: {
    id: string
    full_name: string
  } | null
  service: {
    id: string
    name: string
  } | null
}

export interface ProviderSummary {
  total: number
  active: number
  suspended: number
  verified: number
}
