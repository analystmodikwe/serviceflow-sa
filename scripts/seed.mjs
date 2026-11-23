import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run: node --env-file=.env.local scripts/seed.mjs',
  )
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const password = 'ServiceFlow!2026'

const demoUsers = [
  {
    email: 'customer@example.com',
    role: 'customer',
    fullName: 'Test Customer',
  },
  {
    email: 'provider@example.com',
    role: 'provider',
    fullName: 'Thandi Mokoena',
  },
  {
    email: 'provider2@example.com',
    role: 'provider',
    fullName: 'Sipho Dlamini',
  },
  {
    email: 'admin@example.com',
    role: 'admin',
    fullName: 'Test Admin',
  },
]

function requireData(operation, { data, error }) {
  if (error) throw new Error(`${operation}: ${error.message}`)
  return data
}

async function findOrCreateUser({ email, role, fullName }) {
  const { data: listData, error: listError } =
    await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })

  if (listError) throw new Error(`List auth users: ${listError.message}`)

  const existing = listData.users.find((user) => user.email === email)
  if (existing) return existing

  const result = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      full_name: fullName,
    },
  })

  return requireData(`Create auth user ${email}`, result)
}

const users = {}
for (const demoUser of demoUsers) {
  users[demoUser.email] = await findOrCreateUser(demoUser)
}

const adminUpdate = await supabase
  .from('profiles')
  .update({ role: 'admin' })
  .eq('id', users['admin@example.com'].id)

requireData('Set admin role', adminUpdate)

const providerDefinitions = [
  {
    email: 'provider@example.com',
    businessName: "Thandi's Braids",
    slug: 'thandis-braids',
    category: 'Braiders',
    bio: 'Protective styles and custom braided looks in Johannesburg.',
    isVerified: true,
  },
  {
    email: 'provider2@example.com',
    businessName: "Sipho's Cuts",
    slug: 'siphos-cuts',
    category: 'Barbers',
    bio: 'Fresh fades, classic cuts, and beard grooming.',
    isVerified: false,
  },
]

const providerRows = {}
for (const provider of providerDefinitions) {
  const result = await supabase
    .from('providers')
    .upsert(
      {
        profile_id: users[provider.email].id,
        business_name: provider.businessName,
        slug: provider.slug,
        category: provider.category,
        bio: provider.bio,
        status: 'active',
        is_verified: provider.isVerified,
      },
      { onConflict: 'slug' },
    )
    .select('id, slug')
    .single()

  providerRows[provider.slug] = requireData(
    `Upsert provider ${provider.businessName}`,
    result,
  )
}

const serviceDefinitions = {
  'thandis-braids': [
    { name: 'Knotless Braids', price_cents: 85000, duration_min: 180 },
    { name: 'Box Braids', price_cents: 65000, duration_min: 150 },
    { name: 'Cornrows', price_cents: 45000, duration_min: 90 },
  ],
  'siphos-cuts': [
    { name: "Men's Cut", price_cents: 18000, duration_min: 45 },
    { name: 'Beard Trim', price_cents: 12000, duration_min: 30 },
    { name: 'Fade and Line-up', price_cents: 22000, duration_min: 60 },
  ],
}

const firstThandiService = {}
for (const [slug, services] of Object.entries(serviceDefinitions)) {
  const providerId = providerRows[slug].id
  const existingResult = await supabase
    .from('services')
    .select('id, name')
    .eq('provider_id', providerId)

  const existingServices = requireData(`Read services for ${slug}`, existingResult)
  const existingNames = new Set(existingServices.map((service) => service.name))

  for (const service of services) {
    if (existingNames.has(service.name)) {
      const existing = existingServices.find((item) => item.name === service.name)
      if (slug === 'thandis-braids' && service === services[0]) {
        firstThandiService.id = existing.id
      }
      continue
    }

    const insertResult = await supabase
      .from('services')
      .insert({ provider_id: providerId, ...service })
      .select('id, name')
      .single()

    const inserted = requireData(`Create service ${service.name}`, insertResult)
    if (slug === 'thandis-braids' && service === services[0]) {
      firstThandiService.id = inserted.id
    }
  }
}

for (const provider of Object.values(providerRows)) {
  for (let weekday = 1; weekday <= 6; weekday += 1) {
    const result = await supabase
      .from('availability')
      .upsert(
        {
          provider_id: provider.id,
          weekday,
          start_time: '09:00',
          end_time: '17:00',
        },
        { onConflict: 'provider_id,weekday' },
      )

    requireData(`Set availability for ${provider.slug}`, result)
  }
}

const nextMonday = new Date()
const daysUntilMonday = (8 - nextMonday.getUTCDay()) % 7 || 7
nextMonday.setUTCDate(nextMonday.getUTCDate() + daysUntilMonday)
nextMonday.setUTCHours(10, 0, 0, 0)

const placeholderEnd = new Date(nextMonday.getTime() + 60 * 60 * 1000)

const existingBookingResult = await supabase
  .from('bookings')
  .select('id')
  .eq('customer_id', users['customer@example.com'].id)
  .eq('provider_id', providerRows['thandis-braids'].id)
  .eq('service_id', firstThandiService.id)
  .eq('status', 'pending')
  .eq('start_at', nextMonday.toISOString())
  .limit(1)

const existingBookings = requireData('Read demo booking', existingBookingResult)
if (existingBookings.length === 0) {
  const bookingResult = await supabase.from('bookings').insert({
    customer_id: users['customer@example.com'].id,
    provider_id: providerRows['thandis-braids'].id,
    service_id: firstThandiService.id,
    start_at: nextMonday.toISOString(),
    end_at: placeholderEnd.toISOString(),
    status: 'pending',
  })

  requireData('Create demo booking', bookingResult)
}

console.log('\nServiceFlow demo logins')
console.log('Password for all accounts: ServiceFlow!2026')
for (const demoUser of demoUsers) {
  const label =
    demoUser.role === 'admin'
      ? 'Admin'
      : demoUser.role === 'provider'
        ? 'Provider'
        : 'Customer'
  console.log(`${label}: ${demoUser.email}`)
}
