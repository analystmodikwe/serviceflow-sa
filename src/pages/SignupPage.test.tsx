// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SignupPage from './SignupPage'

const auth = vi.hoisted(() => ({
  session: null,
  role: null,
  loading: false,
  signUp: vi.fn(),
}))

vi.mock('../auth/useAuth', () => ({
  useAuth: () => auth,
}))

afterEach(cleanup)

describe('SignupPage', () => {
  it('validates password length and offers no admin role', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    )

    expect(screen.queryByText(/admin/i)).toBeNull()
    fireEvent.change(screen.getByLabelText('Full name'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'short' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))

    expect(screen.getByRole('alert').textContent).toBe(
      'Password must be at least 8 characters.',
    )
  })
})
