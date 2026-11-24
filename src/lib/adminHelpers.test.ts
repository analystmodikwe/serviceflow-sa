import { describe, expect, it } from 'vitest'
import { filterProviders, summariseProviders } from './adminHelpers'
import type { AdminProviderRow } from '../types/db'

const SAMPLE_PROVIDERS: AdminProviderRow[] = [
  {
    id: 'p1',
    profile_id: 'u1',
    business_name: "Thandi's Braids",
    slug: 'thandis-braids',
    category: 'Braiders',
    bio: 'Protective styles',
    status: 'active',
    is_verified: true,
    created_at: '2026-01-01T00:00:00Z',
    owner: { id: 'u1', full_name: 'Thandi Mokoena' },
    booking_count: 12,
  },
  {
    id: 'p2',
    profile_id: 'u2',
    business_name: "Sipho's Cuts",
    slug: 'siphos-cuts',
    category: 'Barbers',
    bio: 'Clean fades',
    status: 'suspended',
    is_verified: false,
    created_at: '2026-01-02T00:00:00Z',
    owner: { id: 'u2', full_name: 'Sipho Dlamini' },
    booking_count: 3,
  },
  {
    id: 'p3',
    profile_id: 'u3',
    business_name: 'Naledi Nails',
    slug: 'naledi-nails',
    category: 'Nail techs',
    bio: 'Gel & acrylics',
    status: 'active',
    is_verified: false,
    created_at: '2026-01-03T00:00:00Z',
    owner: { id: 'u3', full_name: 'Naledi Khumalo' },
    booking_count: 5,
  },
]

describe('filterProviders', () => {
  it('returns all providers when search is empty and status is all', () => {
    expect(filterProviders(SAMPLE_PROVIDERS, { search: '', status: 'all' })).toHaveLength(3)
  })

  it('filters by business name case-insensitively', () => {
    const result = filterProviders(SAMPLE_PROVIDERS, { search: 'thandi', status: 'all' })
    expect(result.map((p) => p.id)).toEqual(['p1'])
  })

  it('filters by owner name case-insensitively', () => {
    const result = filterProviders(SAMPLE_PROVIDERS, { search: 'dlamini', status: 'all' })
    expect(result.map((p) => p.id)).toEqual(['p2'])
  })

  it('filters by category case-insensitively', () => {
    const result = filterProviders(SAMPLE_PROVIDERS, { search: 'nail', status: 'all' })
    expect(result.map((p) => p.id)).toEqual(['p3'])
  })

  it('filters by status and combines with search', () => {
    expect(
      filterProviders(SAMPLE_PROVIDERS, { search: '', status: 'suspended' }).map((p) => p.id),
    ).toEqual(['p2'])

    expect(
      filterProviders(SAMPLE_PROVIDERS, { search: 'braids', status: 'suspended' }),
    ).toEqual([])
  })
})

describe('summariseProviders', () => {
  it('computes total, active, suspended, and verified counts', () => {
    expect(summariseProviders(SAMPLE_PROVIDERS)).toEqual({
      total: 3,
      active: 2,
      suspended: 1,
      verified: 1,
    })
  })

  it('returns zeros for an empty list', () => {
    expect(summariseProviders([])).toEqual({
      total: 0,
      active: 0,
      suspended: 0,
      verified: 0,
    })
  })
})
