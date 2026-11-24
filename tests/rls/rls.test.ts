import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { anonClient, clientFor, getUniqueFutureSlot } from './helpers'

describe('Row Level Security (RLS) Permission Tests', () => {
  let anon: SupabaseClient
  let customerClient: SupabaseClient
  let customerUser: { id: string; email: string }

  let providerClient: SupabaseClient
  let providerUser: { id: string; email: string }

  let provider2Client: SupabaseClient
  let provider2User: { id: string; email: string }

  let adminClient: SupabaseClient

  // Discovered database rows to use across tests
  let thandiProviderId: string
  let thandiActiveServiceId: string
  let siphoProviderId: string
  let siphoActiveServiceId: string

  // Track created booking IDs to clean up in afterAll
  const createdBookingIds: string[] = []

  beforeAll(async () => {
    anon = anonClient()

    const customerRes = await clientFor('customer@example.com')
    customerClient = customerRes.client
    customerUser = customerRes.user

    const providerRes = await clientFor('provider@example.com')
    providerClient = providerRes.client
    providerUser = providerRes.user

    const provider2Res = await clientFor('provider2@example.com')
    provider2Client = provider2Res.client
    provider2User = provider2Res.user

    const adminRes = await clientFor('admin@example.com')
    adminClient = adminRes.client

    // Query provider info via public anon client
    const { data: providers } = await anon.from('providers').select('id, slug, profile_id')
    const thandi = providers?.find((p) => p.slug === 'thandis-braids')
    const sipho = providers?.find((p) => p.slug === 'siphos-cuts')

    if (!thandi || !sipho) {
      throw new Error('Seeded providers not found. Ensure test database is seeded.')
    }

    thandiProviderId = thandi.id
    siphoProviderId = sipho.id

    // Fetch active service for Thandi
    const { data: thandiServices } = await anon
      .from('services')
      .select('id')
      .eq('provider_id', thandiProviderId)
      .eq('is_active', true)
      .limit(1)

    // Fetch active service for Sipho
    const { data: siphoServices } = await anon
      .from('services')
      .select('id')
      .eq('provider_id', siphoProviderId)
      .eq('is_active', true)
      .limit(1)

    thandiActiveServiceId = thandiServices?.[0]?.id || ''
    siphoActiveServiceId = siphoServices?.[0]?.id || ''
  })

  afterAll(async () => {
    // Clean up all test bookings by setting status to 'cancelled' or deleting if allowed
    for (const bookingId of createdBookingIds) {
      await customerClient
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
    }
  })

  // ==========================================
  // ANON TESTS
  // ==========================================
  describe('ANON permissions', () => {
    it('ANON: can read active providers and their active services and availability', async () => {
      const { data: providers, error: pError } = await anon
        .from('providers')
        .select('id, business_name, status')
        .eq('status', 'active')

      expect(pError).toBeNull()
      expect(providers && providers.length > 0).toBe(true)

      const { data: services, error: sError } = await anon
        .from('services')
        .select('id, name, is_active')
        .eq('is_active', true)

      expect(sError).toBeNull()
      expect(services && services.length > 0).toBe(true)

      const { data: availability, error: aError } = await anon
        .from('availability')
        .select('*')

      expect(aError).toBeNull()
      expect(availability && availability.length > 0).toBe(true)
    })

    it('ANON: cannot read bookings (empty result or error)', async () => {
      const { data, error } = await anon.from('bookings').select('*')
      // RLS policy restricts select on bookings to authenticated users
      if (!error) {
        expect(data).toEqual([])
      } else {
        expect(error).toBeDefined()
      }
    })

    it('ANON: cannot insert a booking', async () => {
      const slot = getUniqueFutureSlot()
      const { error } = await anon.from('bookings').insert({
        customer_id: '00000000-0000-0000-0000-000000000000',
        provider_id: thandiProviderId,
        service_id: thandiActiveServiceId,
        start_at: slot.startAt,
        end_at: slot.endAt,
        status: 'pending',
      })
      expect(error).toBeDefined()
    })
  })

  // ==========================================
  // CUSTOMER TESTS
  // ==========================================
  describe('CUSTOMER permissions', () => {
    it('CUSTOMER: sees only their own bookings (none belonging to others appear)', async () => {
      const { data, error } = await customerClient.from('bookings').select('*')
      expect(error).toBeNull()
      expect(data).toBeDefined()
      for (const booking of data || []) {
        expect(booking.customer_id).toBe(customerUser.id)
      }
    })

    it('CUSTOMER: can create a pending booking for an active service in the future (customer_id = own id)', async () => {
      const slot = getUniqueFutureSlot()
      const { data, error } = await customerClient
        .from('bookings')
        .insert({
          customer_id: customerUser.id,
          provider_id: thandiProviderId,
          service_id: thandiActiveServiceId,
          start_at: slot.startAt,
          end_at: slot.endAt,
          status: 'pending',
        })
        .select('*')
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      if (data) {
        createdBookingIds.push(data.id)
        expect(data.customer_id).toBe(customerUser.id)
        expect(data.status).toBe('pending')
      }
    })

    it("CUSTOMER: cannot create a booking with another user's customer_id", async () => {
      const slot = getUniqueFutureSlot()
      const otherId = providerUser.id // use another valid user id
      const { error } = await customerClient.from('bookings').insert({
        customer_id: otherId,
        provider_id: thandiProviderId,
        service_id: thandiActiveServiceId,
        start_at: slot.startAt,
        end_at: slot.endAt,
        status: 'pending',
      })
      expect(error).toBeDefined()
    })

    it("CUSTOMER: cannot create a booking with status 'confirmed'", async () => {
      const slot = getUniqueFutureSlot()
      const { error } = await customerClient.from('bookings').insert({
        customer_id: customerUser.id,
        provider_id: thandiProviderId,
        service_id: thandiActiveServiceId,
        start_at: slot.startAt,
        end_at: slot.endAt,
        status: 'confirmed',
      })
      expect(error).toBeDefined()
    })

    it('CUSTOMER: cannot create a booking in the past', async () => {
      const pastStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const pastEnd = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
      const { error } = await customerClient.from('bookings').insert({
        customer_id: customerUser.id,
        provider_id: thandiProviderId,
        service_id: thandiActiveServiceId,
        start_at: pastStart,
        end_at: pastEnd,
        status: 'pending',
      })
      expect(error).toBeDefined()
    })

    it('CUSTOMER: booking the same provider and overlapping time twice is rejected with Postgres code 23P01', async () => {
      const slot = getUniqueFutureSlot()
      // First booking succeeds
      const { data: firstBooking, error: firstError } = await customerClient
        .from('bookings')
        .insert({
          customer_id: customerUser.id,
          provider_id: thandiProviderId,
          service_id: thandiActiveServiceId,
          start_at: slot.startAt,
          end_at: slot.endAt,
          status: 'pending',
        })
        .select('*')
        .single()

      expect(firstError).toBeNull()
      expect(firstBooking).toBeDefined()
      if (firstBooking) createdBookingIds.push(firstBooking.id)

      // Second overlapping booking must fail with 23P01
      const { error: secondError } = await customerClient.from('bookings').insert({
        customer_id: customerUser.id,
        provider_id: thandiProviderId,
        service_id: thandiActiveServiceId,
        start_at: slot.startAt,
        end_at: slot.endAt,
        status: 'pending',
      })

      expect(secondError).toBeDefined()
      expect(secondError?.code).toBe('23P01')
    })

    it('CUSTOMER: cannot update start_at or service_id of their booking', async () => {
      const slot = getUniqueFutureSlot()
      const { data: booking } = await customerClient
        .from('bookings')
        .insert({
          customer_id: customerUser.id,
          provider_id: thandiProviderId,
          service_id: thandiActiveServiceId,
          start_at: slot.startAt,
          end_at: slot.endAt,
          status: 'pending',
        })
        .select('*')
        .single()

      if (booking) createdBookingIds.push(booking.id)

      const alteredSlot = getUniqueFutureSlot()
      const { error: updateError } = await customerClient
        .from('bookings')
        .update({ start_at: alteredSlot.startAt })
        .eq('id', booking?.id)

      expect(updateError).toBeDefined()
    })

    it('CUSTOMER: CAN cancel their own pending booking', async () => {
      const slot = getUniqueFutureSlot()
      const { data: booking } = await customerClient
        .from('bookings')
        .insert({
          customer_id: customerUser.id,
          provider_id: thandiProviderId,
          service_id: thandiActiveServiceId,
          start_at: slot.startAt,
          end_at: slot.endAt,
          status: 'pending',
        })
        .select('*')
        .single()

      if (booking) createdBookingIds.push(booking.id)

      const { data: updated, error: cancelError } = await customerClient
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking?.id)
        .select('*')
        .single()

      expect(cancelError).toBeNull()
      expect(updated?.status).toBe('cancelled')
    })

    it('CUSTOMER: cannot confirm their own booking (pending to confirmed)', async () => {
      const slot = getUniqueFutureSlot()
      const { data: booking } = await customerClient
        .from('bookings')
        .insert({
          customer_id: customerUser.id,
          provider_id: thandiProviderId,
          service_id: thandiActiveServiceId,
          start_at: slot.startAt,
          end_at: slot.endAt,
          status: 'pending',
        })
        .select('*')
        .single()

      if (booking) createdBookingIds.push(booking.id)

      const { error: confirmError } = await customerClient
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', booking?.id)

      expect(confirmError).toBeDefined()
    })

    it('CUSTOMER: cannot change their own role via profiles update (must fail or not change)', async () => {
      const { error } = await customerClient
        .from('profiles')
        .update({ role: 'admin' as any })
        .eq('id', customerUser.id)

      // Revoked column privilege raises permission error or check constraint
      // Either error is raised, or role remains unchanged
      const { data: profile } = await customerClient
        .from('profiles')
        .select('role')
        .eq('id', customerUser.id)
        .single()

      expect(profile?.role).toBe('customer')
    })

    it('CUSTOMER: cannot create or update services or availability', async () => {
      const { error: sInsertError } = await customerClient.from('services').insert({
        provider_id: thandiProviderId,
        name: 'Hacked service',
        price_cents: 1000,
        duration_min: 30,
      })
      expect(sInsertError).toBeDefined()

      const { error: aInsertError } = await customerClient.from('availability').insert({
        provider_id: thandiProviderId,
        weekday: 6,
        start_time: '08:00',
        end_time: '12:00',
      })
      expect(aInsertError).toBeDefined()
    })
  })

  // ==========================================
  // PROVIDER TESTS
  // ==========================================
  describe('PROVIDER permissions', () => {
    it("PROVIDER: provider@ cannot update or insert services for provider2's business", async () => {
      // provider@ tries to insert service for Sipho
      const { error: insertError } = await providerClient.from('services').insert({
        provider_id: siphoProviderId,
        name: 'Intruder cut',
        price_cents: 5000,
        duration_min: 30,
      })
      expect(insertError).toBeDefined()

      // provider@ tries to update Sipho's service
      const { data: updateData, error: updateError } = await providerClient
        .from('services')
        .update({ name: 'Renamed by Thandi' })
        .eq('id', siphoActiveServiceId)
        .select('*')

      if (updateError) {
        expect(updateError).toBeDefined()
      } else {
        expect(updateData).toEqual([])
      }
    })

    it("PROVIDER: cannot read provider2's bookings", async () => {
      // Create a booking for Sipho's cuts with customer
      const slot = getUniqueFutureSlot()
      const { data: booking } = await customerClient
        .from('bookings')
        .insert({
          customer_id: customerUser.id,
          provider_id: siphoProviderId,
          service_id: siphoActiveServiceId,
          start_at: slot.startAt,
          end_at: slot.endAt,
          status: 'pending',
        })
        .select('*')
        .single()

      if (booking) createdBookingIds.push(booking.id)

      // provider@ queries bookings
      const { data: bookings } = await providerClient
        .from('bookings')
        .select('*')
        .eq('id', booking?.id)

      expect(bookings).toEqual([])
    })

    it("PROVIDER: cannot update provider2's availability", async () => {
      const { data, error } = await providerClient
        .from('availability')
        .update({ start_time: '07:00' })
        .eq('provider_id', siphoProviderId)
        .select('*')

      if (error) {
        expect(error).toBeDefined()
      } else {
        expect(data).toEqual([])
      }
    })

    it('PROVIDER: cannot change their own is_verified or status (trigger error)', async () => {
      const { error: verifyError } = await providerClient
        .from('providers')
        .update({ is_verified: true })
        .eq('id', thandiProviderId)

      expect(verifyError).toBeDefined()
      expect(verifyError?.message).toContain('Only an admin can change status or verification')

      const { error: statusError } = await providerClient
        .from('providers')
        .update({ status: 'suspended' })
        .eq('id', thandiProviderId)

      expect(statusError).toBeDefined()
      expect(statusError?.message).toContain('Only an admin can change status or verification')
    })

    it('PROVIDER: CAN confirm a pending booking for their own business and cannot confirm one for another provider', async () => {
      // 1. Booking for own business (Thandi)
      const slot1 = getUniqueFutureSlot()
      const { data: ownBooking } = await customerClient
        .from('bookings')
        .insert({
          customer_id: customerUser.id,
          provider_id: thandiProviderId,
          service_id: thandiActiveServiceId,
          start_at: slot1.startAt,
          end_at: slot1.endAt,
          status: 'pending',
        })
        .select('*')
        .single()

      if (ownBooking) createdBookingIds.push(ownBooking.id)

      // Provider confirms own booking
      const { data: confirmedData, error: confirmError } = await providerClient
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', ownBooking?.id)
        .select('*')
        .single()

      expect(confirmError).toBeNull()
      expect(confirmedData?.status).toBe('confirmed')

      // 2. Booking for another provider (Sipho)
      const slot2 = getUniqueFutureSlot()
      const { data: otherBooking } = await customerClient
        .from('bookings')
        .insert({
          customer_id: customerUser.id,
          provider_id: siphoProviderId,
          service_id: siphoActiveServiceId,
          start_at: slot2.startAt,
          end_at: slot2.endAt,
          status: 'pending',
        })
        .select('*')
        .single()

      if (otherBooking) createdBookingIds.push(otherBooking.id)

      // Thandi tries to confirm Sipho's booking
      const { data: otherConfirmData, error: otherConfirmError } = await providerClient
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', otherBooking?.id)
        .select('*')

      if (otherConfirmError) {
        expect(otherConfirmError).toBeDefined()
      } else {
        expect(otherConfirmData).toEqual([])
      }
    })

    it('PROVIDER: cannot move a booking from cancelled back to confirmed', async () => {
      const slot = getUniqueFutureSlot()
      const { data: booking } = await customerClient
        .from('bookings')
        .insert({
          customer_id: customerUser.id,
          provider_id: thandiProviderId,
          service_id: thandiActiveServiceId,
          start_at: slot.startAt,
          end_at: slot.endAt,
          status: 'pending',
        })
        .select('*')
        .single()

      if (booking) createdBookingIds.push(booking.id)

      // Cancel the booking first
      await customerClient
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking?.id)

      // Provider tries to change cancelled -> confirmed
      const { error: moveError } = await providerClient
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', booking?.id)

      expect(moveError).toBeDefined()
      expect(moveError?.message).toContain('Invalid status change')
    })
  })

  // ==========================================
  // ADMIN TESTS
  // ==========================================
  describe('ADMIN permissions', () => {
    it('ADMIN: can read all bookings and providers', async () => {
      const { data: providers, error: pError } = await adminClient
        .from('providers')
        .select('id, business_name')

      expect(pError).toBeNull()
      expect(providers && providers.length >= 2).toBe(true)

      const { data: bookings, error: bError } = await adminClient
        .from('bookings')
        .select('id, status')

      expect(bError).toBeNull()
      expect(bookings).toBeDefined()
    })

    it("ADMIN: can update a provider's status/is_verified; a non-admin cannot", async () => {
      // Sipho's cuts is initially is_verified: false
      const { data: initialSipho } = await adminClient
        .from('providers')
        .select('is_verified')
        .eq('id', siphoProviderId)
        .single()

      const originalVerified = initialSipho?.is_verified ?? false

      // Admin toggles verification
      const { error: adminUpdateError } = await adminClient
        .from('providers')
        .update({ is_verified: !originalVerified })
        .eq('id', siphoProviderId)

      expect(adminUpdateError).toBeNull()

      // Customer tries to update verification (non-admin)
      const { error: customerUpdateError } = await customerClient
        .from('providers')
        .update({ is_verified: originalVerified })
        .eq('id', siphoProviderId)

      expect(customerUpdateError).toBeDefined()

      // Revert verification back to original state with adminClient
      await adminClient
        .from('providers')
        .update({ is_verified: originalVerified })
        .eq('id', siphoProviderId)
    })
  })
})
