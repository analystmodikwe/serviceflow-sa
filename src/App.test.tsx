// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(cleanup)

describe('app routes', () => {
  it.each([
    ['/', 'Landing'],
    ['/login', 'Log in'],
    ['/signup', 'Sign up'],
    ['/browse', 'Browse providers'],
    ['/p/sample-provider', 'Provider profile and booking'],
    ['/booking-confirmed', 'Booking confirmed'],
    ['/my-bookings', 'My bookings'],
    ['/provider', 'Bookings'],
    ['/provider/services', 'Services'],
    ['/provider/availability', 'Availability'],
    ['/provider/profile', 'Profile'],
    ['/admin', 'Providers'],
    ['/not-found', 'Page not found'],
  ])('renders %s as %s', (path, title) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: title })).toBeTruthy()
  })
})
