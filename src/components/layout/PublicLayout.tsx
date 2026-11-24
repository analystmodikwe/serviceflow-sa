import { NavLink, Outlet } from 'react-router-dom'
import { homePathForRole } from '../../auth/AuthContext'
import { useAuth } from '../../auth/useAuth'
import Logo from '../Logo'

export default function PublicLayout() {
  const { session, role, signOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-brand-100 bg-surface">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:gap-4">
         {/* The logo links home; shrink-0 stops it being squashed on small screens */}
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
                  className="rounded-card px-2 py-2 text-sm font-medium text-ink hover:bg-brand-50 sm:px-3"
                >
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="rounded-card bg-accent-500 px-3 py-2 text-sm font-semibold text-ink hover:bg-accent-600"
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
                    `rounded-card bg-accent-500 px-3 py-2 text-sm font-semibold text-ink hover:bg-accent-600 ${
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

      <footer className="border-t border-brand-100 px-4 py-5 text-center text-sm text-ink">
        &copy; {new Date().getFullYear()} ServiceFlow SA
      </footer>
    </div>
  )
}
