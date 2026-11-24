// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AdminDashboardPage from './AdminDashboardPage'
import * as adminApi from '../../lib/adminApi'

vi.mock('../../lib/adminApi', () => ({
  listAllProviders: vi.fn(),
  listRecentBookings: vi.fn(),
  setProviderStatus: vi.fn(),
  setProviderVerified: vi.fn(),
}))

afterEach(cleanup)

beforeEach(() => {
  vi.clearAllMocks()

  vi.mocked(adminApi.listAllProviders).mockResolvedValue({
    providers: [
      {
        id: 'prov-1',
        profile_id: 'user-1',
        business_name: "Thandi's Braids",
        slug: 'thandis-braids',
        category: 'Braiders',
        bio: 'Knotless braids',
        status: 'active',
        is_verified: true,
        created_at: '2026-01-01T00:00:00Z',
        owner: { id: 'user-1', full_name: 'Thandi Mokoena' },
        booking_count: 4,
      },
    ],
    error: null,
  })

  vi.mocked(adminApi.listRecentBookings).mockResolvedValue({
    bookings: [],
    error: null,
  })

  vi.mocked(adminApi.setProviderStatus).mockResolvedValue({
    provider: {
      id: 'prov-1',
      profile_id: 'user-1',
      business_name: "Thandi's Braids",
      slug: 'thandis-braids',
      category: 'Braiders',
      bio: 'Knotless braids',
      status: 'suspended',
      is_verified: true,
      created_at: '2026-01-01T00:00:00Z',
    },
    error: null,
  })
})

describe('AdminDashboardPage', () => {
  it('shows confirmation when clicking Suspend and calls setProviderStatus on confirm', async () => {
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    )

    const suspendButtons = await screen.findAllByRole('button', { name: 'Suspend' })
    fireEvent.click(suspendButtons[0])

    expect(
      screen.getByRole('dialog'),
    ).toBeTruthy()
    expect(
      screen.getByText(/disappear from public browse immediately/i),
    ).toBeTruthy()

    const confirmBtn = screen.getByRole('button', { name: 'Confirm suspend' })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(adminApi.setProviderStatus).toHaveBeenCalledWith('prov-1', 'suspended')
    })
  })
})
