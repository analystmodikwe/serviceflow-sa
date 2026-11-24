import { describe, expect, it } from 'vitest'
import {
  formatSastBookingRange,
  getSastParts,
  isSameSastDay,
  startOfSastDay,
  startOfSastWeek,
} from './dates'

describe('dates in SAST', () => {
  it('correctly retrieves SAST parts for UTC date', () => {
    // 2026-11-24T09:00:00Z is 11:00:00 SAST (UTC+2)
    const date = new Date('2026-11-24T09:00:00Z')
    const parts = getSastParts(date)
    expect(parts.year).toBe(2026)
    expect(parts.month).toBe(11)
    expect(parts.day).toBe(24)
    expect(parts.hour).toBe(11)
    expect(parts.minute).toBe(0)
    expect(parts.dayOfWeek).toBe(2) // Tuesday
  })

  it('determines if two timestamps are on the same SAST day across UTC midnight boundary', () => {
    // 2026-11-24T22:30:00Z is 2026-11-25T00:30:00 SAST
    // 2026-11-25T02:00:00Z is 2026-11-25T04:00:00 SAST
    expect(
      isSameSastDay('2026-11-24T22:30:00Z', '2026-11-25T02:00:00Z'),
    ).toBe(true)

    // 2026-11-24T21:00:00Z is 2026-11-24T23:00:00 SAST (previous day)
    expect(
      isSameSastDay('2026-11-24T21:00:00Z', '2026-11-24T22:30:00Z'),
    ).toBe(false)
  })

  it('computes start of SAST day and week (week starts Monday)', () => {
    // 2026-11-24 is a Tuesday
    const date = new Date('2026-11-24T12:00:00Z')
    const dayStart = startOfSastDay(date)
    const dayParts = getSastParts(dayStart)
    expect(dayParts.year).toBe(2026)
    expect(dayParts.month).toBe(11)
    expect(dayParts.day).toBe(24)
    expect(dayParts.hour).toBe(0)
    expect(dayParts.minute).toBe(0)

    const weekStart = startOfSastWeek(date)
    const weekParts = getSastParts(weekStart)
    expect(weekParts.day).toBe(23) // Monday 23 Nov 2026
    expect(weekParts.dayOfWeek).toBe(1)
    expect(weekParts.hour).toBe(0)
  })

  it('formats booking date and time range in SAST', () => {
    const formatted = formatSastBookingRange(
      '2026-11-24T07:00:00Z',
      '2026-11-24T08:00:00Z',
    )
    // 07:00 UTC = 09:00 SAST, 08:00 UTC = 10:00 SAST
    expect(formatted).toContain('09:00 – 10:00')
    expect(formatted).toContain('2026')
  })
})
