// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'

const auth = vi.hoisted(() => ({
  session: null as null | { user: { id: string } },
  profile: null as null | {
    id: string
    role: string
    full_name: string
  },
  role: null as string | null,
  loading: false,
}))

vi.mock('./useAuth', () => ({
  useAuth: () => auth,
}))

afterEach(cleanup)

beforeEach(() => {
  auth.session = null
  auth.profile = null
  auth.role = null
})

describe('ProtectedRoute', () => {
  it('redirects a signed-out user to login', () => {
    render(
      <MemoryRouter initialEntries={['/my-bookings']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/my-bookings" element={<h1>My bookings</h1>} />
          </Route>
          <Route path="/login" element={<h1>Log in</h1>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Log in' })).toBeTruthy()
  })

  it('redirects a customer away from provider routes', () => {
    auth.session = { user: { id: 'customer-id' } }
    auth.profile = { id: 'customer-id', role: 'customer', full_name: 'Test Customer' }
    auth.role = 'customer'

    render(
      <MemoryRouter initialEntries={['/provider']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['provider']} />}>
            <Route path="/provider" element={<h1>Provider bookings</h1>} />
          </Route>
          <Route path="/my-bookings" element={<h1>My bookings</h1>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'My bookings' })).toBeTruthy()
  })
})
