// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ProviderPage from './ProviderPage'

const auth = vi.hoisted(() => ({
  session: { user: { id: 'customer-user' } },
  role: 'customer',
}))

const api = vi.hoisted(() => ({
  getProviderBySlug: vi.fn(),
  getBusySlots: vi.fn(),
  createBooking: vi.fn(),
}))

vi.mock('../auth/useAuth', () => ({
  useAuth: () => auth,
}))

vi.mock('../lib/bookingApi', () => api)

afterEach(cleanup)

describe('ProviderPage', () => {
  it('keeps Request booking button disabled until a slot is chosen', async () => {
    api.getProviderBySlug.mockResolvedValue({
      provider: {
        id: 'provider-1',
        profile_id: 'provider-user',
        business_name: 'Super Cuts',
        slug: 'super-cuts',
        category: 'Barbers',
        bio: 'Best cuts',
        status: 'active',
        is_verified: true,
        created_at: '2026-01-01',
        services: [
          {
            id: 'srv-1',
            provider_id: 'provider-1',
            name: 'Haircut',
            price_cents: 15000,
            duration_min: 30,
            is_active: true,
            created_at: '2026-01-01',
          },
        ],
        availability: [
          {
            id: 'avail-1',
            provider_id: 'provider-1',
            weekday: 1,
            start_time: '09:00',
            end_time: '17:00',
          },
        ],
      },
      error: null,
    })

    // Return no slots for today to ensure no slot is selected automatically
    api.getBusySlots.mockResolvedValue({ busy: [], error: null })

    render(
      <MemoryRouter initialEntries={['/p/super-cuts']}>
        <Routes>
          <Route path="/p/:slug" element={<ProviderPage />} />
        </Routes>
      </MemoryRouter>,
    )

    const button = await screen.findByRole('button', { name: 'Request booking' })
    expect(button).toBeDisabled()
  })
})
