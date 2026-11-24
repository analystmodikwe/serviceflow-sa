// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./lib/providerApi', () => ({
  getProviderProfile: vi.fn().mockResolvedValue({
    provider: {
      id: 'provider-1',
      profile_id: 'test-user',
      business_name: 'Test Barber',
      slug: 'test-barber',
      category: 'Barbers',
      bio: '',
      status: 'active',
      is_verified: true,
      created_at: '2026-01-01',
    },
    error: null,
  }),
  getProviderBookings: vi.fn().mockResolvedValue({
    bookings: [],
    error: null,
  }),
  getProviderAvailability: vi.fn().mockResolvedValue({
    availability: [],
    error: null,
  }),
  getProviderServices: vi.fn().mockResolvedValue({
    services: [],
    error: null,
  }),
}))

vi.mock('./lib/bookingApi', () => ({
  listProviders: vi.fn().mockResolvedValue({
    providers: [],
    error: null,
  }),
}))

const auth = vi.hoisted(() => ({
  session: null as null | { user: { id: string } },
  profile: null as null | {
    id: string
    role: string
    full_name: string
  },
  role: null as string | null,
  loading: false,
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('./auth/useAuth', () => ({
  useAuth: () => auth,
}))

afterEach(cleanup)

beforeEach(() => {
  auth.session = { user: { id: 'test-user' } }
  auth.profile = {
    id: 'test-user',
    role: 'customer',
    full_name: 'Test Customer',
  }
  auth.role = 'customer'
})

describe('app routes', () => {
  it('renders browse page', async () => {
    render(
      <MemoryRouter initialEntries={['/browse']}>
        <App />
      </MemoryRouter>,
    )
    expect(
      await screen.findByRole('heading', { name: 'Browse Providers' }),
    ).toBeTruthy()
  })

  it.each([
    ['/', 'Landing'],
    ['/p/sample-provider', 'Provider profile and booking'],
    ['/booking-confirmed', 'Booking confirmed'],
    ['/my-bookings', 'My bookings'],
    ['/not-found', 'Page not found'],
  ])('renders %s as %s', (path, title) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: title })).toBeTruthy()
  })

  it('renders browse page', async () => {
    render(
      <MemoryRouter initialEntries={['/browse']}>
        <App />
      </MemoryRouter>,
    )
    expect(
      await screen.findByRole('heading', { name: 'Browse Providers' }),
    ).toBeTruthy()
  })

  it.each([
    ['/login', 'Log in'],
    ['/signup', 'Create an account'],
  ])('renders public auth route %s for signed-out users', (path, title) => {
    auth.session = null
    auth.profile = null
    auth.role = null

    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: title })).toBeTruthy()
  })

  it('renders provider routes for a signed-in provider', async () => {
    auth.role = 'provider'
    auth.profile = {
      id: 'test-user',
      role: 'provider',
      full_name: 'Test Provider',
    }

    render(
      <MemoryRouter initialEntries={['/provider']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeTruthy()
  })

  it('renders admin routes for a signed-in admin', () => {
    auth.role = 'admin'
    auth.profile = {
      id: 'test-user',
      role: 'admin',
      full_name: 'Test Admin',
    }

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Providers' })).toBeTruthy()
  })
})
