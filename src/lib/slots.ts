export interface AvailabilitySlotConfig {
  weekday: number
  start_time: string // 'HH:mm' or 'HH:mm:ss'
  end_time: string // 'HH:mm' or 'HH:mm:ss'
}

export interface BusyRange {
  start_at: string | Date
  end_at: string | Date
}

export interface GenerateSlotsOptions {
  date: string // 'YYYY-MM-DD' in SAST
  availability: AvailabilitySlotConfig[]
  durationMin: number
  busy: BusyRange[]
  now?: Date
  stepMin?: number
}

/**
 * Parses 'HH:mm' or 'HH:mm:ss' into minutes from 00:00.
 */
function parseTimeToMinutes(timeStr: string): number {
  const [hourStr, minStr] = timeStr.split(':')
  return Number(hourStr) * 60 + Number(minStr)
}

/**
 * Returns the SAST weekday (0=Sun..6=Sat) for a calendar date 'YYYY-MM-DD'.
 */
function getSastWeekday(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number)
  // Construct UTC date at 12:00 UTC so it's safely within that day
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  // Sunday is 0, Monday is 1, ..., Saturday is 6
  return date.getUTCDay()
}

/**
 * Converts a SAST calendar date and minute of the day to a UTC Date.
 * SAST is fixed UTC+02:00, so UTC = SAST - 2 hours.
 */
function sastDateAndMinutesToUtc(dateStr: string, minutes: number): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  // Subtract 2 hours to convert SAST to UTC
  const utcMs = Date.UTC(year, month - 1, day, hours - 2, mins, 0, 0)
  return new Date(utcMs)
}

/**
 * Generates open slot start times (as UTC Date objects) for a given SAST date.
 */
export function generateSlots({
  date,
  availability,
  durationMin,
  busy,
  now = new Date(),
  stepMin = 30,
}: GenerateSlotsOptions): Date[] {
  const weekday = getSastWeekday(date)
  const avail = availability.find((a) => a.weekday === weekday)

  if (!avail) {
    return []
  }

  const windowStartMin = parseTimeToMinutes(avail.start_time)
  const windowEndMin = parseTimeToMinutes(avail.end_time)

  // Normalize busy ranges to timestamps
  const busyIntervals = busy.map((b) => ({
    start: (typeof b.start_at === 'string' ? new Date(b.start_at) : b.start_at).getTime(),
    end: (typeof b.end_at === 'string' ? new Date(b.end_at) : b.end_at).getTime(),
  }))

  const slots: Date[] = []
  const durationMs = durationMin * 60 * 1000
  const nowMs = now.getTime()

  for (
    let currentMin = windowStartMin;
    currentMin + durationMin <= windowEndMin;
    currentMin += stepMin
  ) {
    const slotStart = sastDateAndMinutesToUtc(date, currentMin)
    const slotStartMs = slotStart.getTime()
    const slotEndMs = slotStartMs + durationMs

    // Exclude slots starting at or before now
    if (slotStartMs <= nowMs) {
      continue
    }

    // Check overlap with busy intervals: slotStart < busyEnd && slotEnd > busyStart
    const hasOverlap = busyIntervals.some(
      (b) => slotStartMs < b.end && slotEndMs > b.start,
    )

    if (!hasOverlap) {
      slots.push(slotStart)
    }
  }

  return slots
}
