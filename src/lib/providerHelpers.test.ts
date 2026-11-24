import { describe, expect, it } from 'vitest'
import {
  formatRands,
  randsToCents,
  slugify,
  validateSlug,
} from './providerHelpers'

describe('provider helpers', () => {
  it('creates a database-safe slug', () => {
    expect(slugify("Thandi's Braids")).toBe('thandi-s-braids')
  })

  it('validates slugs', () => {
    expect(validateSlug('thandis-braids')).toBeNull()
    expect(validateSlug('Thandi Braids')).toBe(
      'Use lowercase letters, numbers and hyphens only.',
    )
  })

  it('converts rands to cents and formats cents as rands', () => {
    expect(randsToCents('180.50')).toBe(18050)
    expect(randsToCents('0')).toBeNull()
    expect(formatRands(18050)).toContain('180')
  })
})
