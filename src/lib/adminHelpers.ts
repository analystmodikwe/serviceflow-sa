import type {
  AdminProviderRow,
  ProviderStatus,
  ProviderSummary,
} from '../types/db'

export interface ProviderFilterOptions {
  search: string
  status: 'all' | ProviderStatus
}

/**
 * Filters providers by status and case-insensitive search across business name, owner name, or category.
 */
export function filterProviders(
  providers: AdminProviderRow[],
  options: ProviderFilterOptions,
): AdminProviderRow[] {
  const query = options.search.trim().toLowerCase()

  return providers.filter((provider) => {
    if (options.status !== 'all' && provider.status !== options.status) {
      return false
    }

    if (!query) {
      return true
    }

    const businessMatch = provider.business_name.toLowerCase().includes(query)
    const ownerMatch = (provider.owner?.full_name ?? '').toLowerCase().includes(query)
    const categoryMatch = provider.category.toLowerCase().includes(query)

    return businessMatch || ownerMatch || categoryMatch
  })
}

/**
 * Computes summary counts (total, active, suspended, verified) for a list of providers.
 */
export function summariseProviders(providers: AdminProviderRow[]): ProviderSummary {
  let active = 0
  let suspended = 0
  let verified = 0

  for (const provider of providers) {
    if (provider.status === 'active') active += 1
    else if (provider.status === 'suspended') suspended += 1
    if (provider.is_verified) verified += 1
  }

  return {
    total: providers.length,
    active,
    suspended,
    verified,
  }
}
