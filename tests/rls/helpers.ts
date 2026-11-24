import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

export function getRequiredEnv(): { url: string; anonKey: string } {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Make sure .env.local exists and is passed to node with --env-file=.env.local.',
    )
  }
  return { url: supabaseUrl, anonKey: supabaseAnonKey }
}

export function anonClient(): SupabaseClient {
  const { url, anonKey } = getRequiredEnv()
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function clientFor(
  email: string,
  password = 'ServiceFlow!2026',
): Promise<{ client: SupabaseClient; user: { id: string; email: string } }> {
  const { url, anonKey } = getRequiredEnv()
  const client = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    throw new Error(`Failed to sign in as ${email}: ${error?.message || 'No user returned'}`)
  }

  return {
    client,
    user: {
      id: data.user.id,
      email: data.user.email || email,
    },
  }
}

let slotCounter = 0

/**
 * Returns a unique future start and end time (ISO strings) on a weekday in March 2027
 * to avoid colliding with seed data or parallel tests.
 */
export function getUniqueFutureSlot(durationMin = 60): {
  startAt: string
  endAt: string
} {
  slotCounter += 1
  // March 2027: March 1, 2027 is a Monday.
  // Spread across days and hours
  const day = 1 + (Math.floor(slotCounter / 8) % 20) // March 1 to 20
  const hour = 8 + (slotCounter % 8) // 08:00 to 15:00 UTC
  const minute = (slotCounter * 5) % 60

  const dayStr = String(day).padStart(2, '0')
  const hourStr = String(hour).padStart(2, '0')
  const minStr = String(minute).padStart(2, '0')

  const startDate = new Date(`2027-03-${dayStr}T${hourStr}:${minStr}:00.000Z`)
  const endDate = new Date(startDate.getTime() + durationMin * 60 * 1000)

  return {
    startAt: startDate.toISOString(),
    endAt: endDate.toISOString(),
  }
}
