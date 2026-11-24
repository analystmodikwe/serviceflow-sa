import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export type UserRole = 'customer' | 'provider' | 'admin'

export interface UserProfile {
  id: string
  role: UserRole
  full_name: string
}

export interface AuthContextValue {
  session: Session | null
  profile: UserProfile | null
  role: UserRole | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: Exclude<UserRole, 'admin'>,
  ) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function homePathForRole(role: UserRole | null): string {
  if (role === 'provider') return '/provider'
  if (role === 'admin') return '/admin'
  return '/my-bookings'
}
