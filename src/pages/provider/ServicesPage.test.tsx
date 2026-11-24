// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ServicesPage from './ServicesPage'

const auth = vi.hoisted(() => ({
  session: { user: { id: 'provider-user' } },
}))

const api = vi.hoisted(() => ({
  getProviderProfile: vi.fn(),
  getProviderServices: vi.fn(),
  createProviderService: vi.fn(),
  updateProviderService: vi.fn(),
}))

vi.mock('../../auth/useAuth', () => ({
  useAuth: () => auth,
}))

vi.mock('../../lib/providerApi', () => api)

afterEach(cleanup)

describe('ServicesPage', () => {
  it('validates the add-service form', async () => {
    api.getProviderProfile.mockResolvedValue({
      provider: {
        id: 'provider-id',
        profile_id: 'provider-user',
        business_name: 'Test Cuts',
        slug: 'test-cuts',
        category: 'Barbers',
        bio: '',
        status: 'active',
        is_verified: false,
        created_at: '2026-01-01',
      },
      error: null,
    })
    api.getProviderServices.mockResolvedValue({ services: [], error: null })

    render(
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>,
    )

    await screen.findByRole('button', { name: 'Add service' })
    fireEvent.click(screen.getByRole('button', { name: 'Add service' }))
    fireEvent.change(screen.getByLabelText('Service name'), {
      target: { value: 'Haircut' },
    })
    fireEvent.change(screen.getByLabelText('Price (R)'), {
      target: { value: '0' },
    })
    fireEvent.change(screen.getByLabelText('Duration (minutes)'), {
      target: { value: '30' },
    })
    fireEvent.submit(
      screen.getByRole('button', { name: 'Create service' }).closest('form')!,
    )

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Enter a price greater than zero.',
    )
  })
})
