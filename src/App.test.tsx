// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

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
  it.each([
    ['/', 'Landing'],
    ['/browse', 'Browse providers'],
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

  it('renders provider routes for a signed-in provider', () => {
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

    expect(screen.getByRole('heading', { name: 'Bookings' })).toBeTruthy()
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
