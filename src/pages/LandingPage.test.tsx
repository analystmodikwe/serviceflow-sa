// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LandingPage from './LandingPage'

const auth = vi.hoisted(() => ({
  session: null as null | { user: { id: string } },
  role: null as null | string,
}))

const api = vi.hoisted(() => ({
  listProviders: vi.fn(),
}))

vi.mock('../auth/useAuth', () => ({
  useAuth: () => auth,
}))

vi.mock('../lib/bookingApi', () => api)

afterEach(cleanup)

describe('LandingPage', () => {
  it('renders headline, Find a provider link to /browse, and signed-out provider button', async () => {
    auth.session = null
    auth.role = null
    api.listProviders.mockResolvedValue({
      providers: [
        {
          id: 'prov-1',
          business_name: 'Test Barber',
          slug: 'test-barber',
          category: 'Barbers',
          bio: 'Great fades',
          status: 'active',
          is_verified: true,
          created_at: '2026-01-01',
          services: [
            {
              id: 'srv-1',
              provider_id: 'prov-1',
              name: 'Fade',
              price_cents: 10000,
              duration_min: 30,
              is_active: true,
              created_at: '2026-01-01',
            },
          ],
        },
      ],
      error: null,
    })

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    // Check main headline
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Book trusted local services in seconds.',
      }),
    ).toBeInTheDocument()

    // Check "Find a provider" links to /browse
    const findButtons = screen.getAllByRole('link', { name: 'Find a provider' })
    expect(findButtons[0]).toHaveAttribute('href', '/browse')

    // Signed out shows "I'm a provider"
    expect(
      screen.getByRole('link', { name: "I'm a provider" }),
    ).toHaveAttribute('href', '/signup')

    // Check featured provider is loaded and rendered
    expect(await screen.findByText('Test Barber')).toBeInTheDocument()
  })

  it('renders dashboard button when signed in', async () => {
    auth.session = { user: { id: 'cust-1' } }
    auth.role = 'customer'
    api.listProviders.mockResolvedValue({
      providers: [],
      error: null,
    })

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('link', { name: 'Go to your dashboard' }),
    ).toHaveAttribute('href', '/my-bookings')
  })
})
