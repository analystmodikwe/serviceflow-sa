import { NavLink, Outlet } from 'react-router-dom'
import { homePathForRole } from '../../auth/AuthContext'
import { useAuth } from '../../auth/useAuth'
import Logo from '../Logo'

export default function PublicLayout() {
  const { session, role, signOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-brand-100 bg-surface/95 shadow-sm backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:py-4">
          <NavLink to="/" aria-label="ServiceFlow SA home" className="shrink-0">
            <Logo />
          </NavLink>
          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/browse"
              className={({ isActive }) =>
                `rounded-card px-2 py-2 text-sm font-medium sm:px-3 ${
                  isActive ? 'bg-brand-100 text-brand-700' : 'text-ink hover:bg-brand-50'
                }`
              }
            >
              Browse
            </NavLink>
            {session && role ? (
              <>
                <NavLink
                  to={homePathForRole(role)}
                  className="rounded-card px-2 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-50 sm:px-3"
                >
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="rounded-card bg-accent-500 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-accent-600"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `rounded-card px-2 py-2 text-sm font-medium sm:px-3 ${
                      isActive ? 'bg-brand-100 text-brand-700' : 'text-ink hover:bg-brand-50'
                    }`
                  }
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `rounded-card bg-accent-500 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-accent-600 ${
                      isActive ? 'ring-2 ring-brand-700' : ''
                    }`
                  }
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-brand-900 px-4 py-8 text-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <Logo variant="white" />
            <p className="mt-2 text-sm text-brand-100">
              Book trusted local services across South Africa.
            </p>
          </div>
          <p className="text-sm text-brand-100">
            &copy; {new Date().getFullYear()} ServiceFlow SA
          </p>
        </div>
      </footer>
    </div>
  )
}
