export const SAST_TIMEZONE = 'Africa/Johannesburg'

/**
 * Returns the parts of a date in SAST (year, month 1-12, day, hour, minute, second, dayOfWeek 0=Sun..6=Sat).
 */
export function getSastParts(date: Date): {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  dayOfWeek: number
} {
  const formatter = new Intl.DateTimeFormat('en-ZA', {
    timeZone: SAST_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    weekday: 'short',
    hourCycle: 'h23',
  })

  const parts = formatter.formatToParts(date)
  let year = 0
  let month = 0
  let day = 0
  let hour = 0
  let minute = 0
  let second = 0
  let weekdayStr = ''

  for (const part of parts) {
    if (part.type === 'year') year = Number(part.value)
    else if (part.type === 'month') month = Number(part.value)
    else if (part.type === 'day') day = Number(part.value)
    else if (part.type === 'hour') hour = Number(part.value)
    else if (part.type === 'minute') minute = Number(part.value)
    else if (part.type === 'second') second = Number(part.value)
    else if (part.type === 'weekday') weekdayStr = part.value
  }

  // Map weekday to 0=Sun..6=Sat
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  const dayOfWeek = weekdayMap[weekdayStr] ?? 0

  return { year, month, day, hour, minute, second, dayOfWeek }
}

/**
 * Returns a Date representing 00:00:00.000 SAST for the day of the given date (SAST is UTC+2).
 */
export function startOfSastDay(date: Date = new Date()): Date {
  const parts = getSastParts(date)
  // Construct UTC timestamp corresponding to YYYY-MM-DD 00:00:00 SAST (UTC+2 => subtract 2 hours from UTC)
  const utcMs = Date.UTC(parts.year, parts.month - 1, parts.day, 0 - 2, 0, 0, 0)
  return new Date(utcMs)
}

/**
 * Returns a Date representing 00:00:00.000 SAST for the start of the week (Monday) containing the date.
 */
export function startOfSastWeek(date: Date = new Date()): Date {
  const dayStart = startOfSastDay(date)
  const parts = getSastParts(date)
  // Monday is 1, Sunday is 0. If Sunday, days since Monday = 6. Else dayOfWeek - 1.
  const daysSinceMonday = parts.dayOfWeek === 0 ? 6 : parts.dayOfWeek - 1
  return new Date(dayStart.getTime() - daysSinceMonday * 24 * 60 * 60 * 1000)
}

/**
 * Checks if two dates fall on the same day in SAST.
 */
export function isSameSastDay(a: Date | string, b: Date | string): boolean {
  const dateA = typeof a === 'string' ? new Date(a) : a
  const dateB = typeof b === 'string' ? new Date(b) : b
  const partsA = getSastParts(dateA)
  const partsB = getSastParts(dateB)

  return (
    partsA.year === partsB.year &&
    partsA.month === partsB.month &&
    partsA.day === partsB.day
  )
}

/**
 * Formats a booking start and end ISO timestamp into a human-readable SAST date and time range.
 * e.g., "Mon, 24 Nov 2026, 09:00 – 10:00"
 */
export function formatSastBookingRange(startAt: string | Date, endAt: string | Date): string {
  const start = typeof startAt === 'string' ? new Date(startAt) : startAt
  const end = typeof endAt === 'string' ? new Date(endAt) : endAt

  const dateFormatter = new Intl.DateTimeFormat('en-ZA', {
    timeZone: SAST_TIMEZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const timeFormatter = new Intl.DateTimeFormat('en-ZA', {
    timeZone: SAST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })

  const datePart = dateFormatter.format(start)
  const startTime = timeFormatter.format(start)
  const endTime = timeFormatter.format(end)

  return `${datePart}, ${startTime} – ${endTime}`
}
