// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AvailabilityPage from './AvailabilityPage'

const auth = vi.hoisted(() => ({
  session: { user: { id: 'provider-user' } },
}))

const api = vi.hoisted(() => ({
  getProviderProfile: vi.fn(),
  getProviderAvailability: vi.fn(),
  saveProviderAvailability: vi.fn(),
}))

vi.mock('../../auth/useAuth', () => ({
  useAuth: () => auth,
}))

vi.mock('../../lib/providerApi', () => api)

afterEach(cleanup)

describe('AvailabilityPage', () => {
  it('validates that start time must be before end time for enabled days', async () => {
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

    api.getProviderAvailability.mockResolvedValue({
      availability: [
        {
          id: 'avail-1',
          provider_id: 'provider-id',
          weekday: 1, // Monday
          start_time: '09:00:00',
          end_time: '17:00:00',
        },
      ],
      error: null,
    })

    render(
      <MemoryRouter>
        <AvailabilityPage />
      </MemoryRouter>,
    )

    await screen.findByRole('button', { name: 'Save availability' })

    // Find Monday start & end inputs and invert them
    const mondayStart = screen.getByLabelText('Monday start time')
    const mondayEnd = screen.getByLabelText('Monday end time')

    fireEvent.change(mondayStart, { target: { value: '18:00' } })
    fireEvent.change(mondayEnd, { target: { value: '09:00' } })

    fireEvent.click(screen.getByRole('button', { name: 'Save availability' }))

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toBe(
      'Start time must be before end time for Monday.',
    )
    expect(api.saveProviderAvailability).not.toHaveBeenCalled()
  })
})
