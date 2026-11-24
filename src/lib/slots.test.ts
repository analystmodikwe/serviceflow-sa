import { describe, expect, it } from 'vitest'
import { generateSlots } from './slots'

describe('generateSlots', () => {
  const availability = [
    { weekday: 1, start_time: '09:00', end_time: '17:00' }, // Monday
    { weekday: 0, start_time: '10:00', end_time: '14:00' }, // Sunday
  ]

  it('generates slots on a normal day', () => {
    // 2026-11-23 is Monday (weekday 1)
    // 09:00 SAST is 07:00 UTC
    // 17:00 SAST is 15:00 UTC
    const now = new Date('2026-11-20T00:00:00Z') // past
    const slots = generateSlots({
      date: '2026-11-23',
      availability,
      durationMin: 60,
      busy: [],
      now,
      stepMin: 60,
    })

    // 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00 (ends 17:00) -> 8 slots
    expect(slots.length).toBe(8)
    expect(slots[0].toISOString()).toBe('2026-11-23T07:00:00.000Z')
    expect(slots[7].toISOString()).toBe('2026-11-23T14:00:00.000Z')
  })

  it('returns no slots on a day off', () => {
    // 2026-11-24 is Tuesday (weekday 2), not in availability
    const slots = generateSlots({
      date: '2026-11-24',
      availability,
      durationMin: 30,
      busy: [],
      now: new Date('2026-11-20T00:00:00Z'),
    })
    expect(slots).toEqual([])
  })

  it('removes slots that overlap busy ranges', () => {
    // Busy from 10:00 to 11:00 SAST (08:00 to 09:00 UTC)
    // Overlap condition: slotStart < busyEnd and slotEnd > busyStart
    const busy = [
      {
        start_at: '2026-11-23T08:00:00.000Z',
        end_at: '2026-11-23T09:00:00.000Z',
      },
    ]

    const slots = generateSlots({
      date: '2026-11-23',
      availability,
      durationMin: 60,
      busy,
      now: new Date('2026-11-20T00:00:00Z'),
      stepMin: 30,
    })

    // Check that no slot overlaps with 08:00-09:00 UTC
    for (const slot of slots) {
      const slotStart = slot.getTime()
      const slotEnd = slotStart + 60 * 60 * 1000
      const busyStart = new Date('2026-11-23T08:00:00.000Z').getTime()
      const busyEnd = new Date('2026-11-23T09:00:00.000Z').getTime()
      const overlaps = slotStart < busyEnd && slotEnd > busyStart
      expect(overlaps).toBe(false)
    }
  })

  it('allows a slot ending exactly at closing time', () => {
    // Availability ends at 17:00 SAST (15:00 UTC)
    // 60 min slot starting at 16:00 SAST (14:00 UTC) ends at 17:00 SAST
    const slots = generateSlots({
      date: '2026-11-23',
      availability,
      durationMin: 60,
      busy: [],
      now: new Date('2026-11-20T00:00:00Z'),
      stepMin: 60,
    })

    const lastSlot = slots[slots.length - 1]
    expect(lastSlot.toISOString()).toBe('2026-11-23T14:00:00.000Z') // 16:00 SAST
  })

  it('returns none if service duration is longer than the availability window', () => {
    // Monday window is 09:00 to 17:00 = 8 hours (480 min)
    const slots = generateSlots({
      date: '2026-11-23',
      availability,
      durationMin: 500,
      busy: [],
      now: new Date('2026-11-20T00:00:00Z'),
    })
    expect(slots).toEqual([])
  })

  it('excludes past slots for today', () => {
    // Now is 11:15 SAST (09:15 UTC) on 2026-11-23
    // Slots at 09:00, 10:00, 11:00 SAST are in past or at now
    const now = new Date('2026-11-23T09:15:00.000Z')
    const slots = generateSlots({
      date: '2026-11-23',
      availability,
      durationMin: 60,
      busy: [],
      now,
      stepMin: 60,
    })

    // First slot should be 12:00 SAST (10:00 UTC)
    expect(slots[0].toISOString()).toBe('2026-11-23T10:00:00.000Z')
    for (const slot of slots) {
      expect(slot.getTime()).toBeGreaterThan(now.getTime())
    }
  })

  it('correctly maps Sunday weekday (0)', () => {
    // 2026-11-29 is Sunday (weekday 0)
    // Available 10:00 to 14:00 SAST (08:00 to 12:00 UTC)
    const slots = generateSlots({
      date: '2026-11-29',
      availability,
      durationMin: 60,
      busy: [],
      now: new Date('2026-11-20T00:00:00Z'),
      stepMin: 60,
    })

    // 10:00, 11:00, 12:00, 13:00 (ends 14:00) -> 4 slots
    expect(slots.length).toBe(4)
    expect(slots[0].toISOString()).toBe('2026-11-29T08:00:00.000Z')
    expect(slots[3].toISOString()).toBe('2026-11-29T11:00:00.000Z')
  })
})
