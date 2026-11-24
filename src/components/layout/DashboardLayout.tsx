import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import Logo from '../Logo'

interface DashboardLayoutProps {
  title: string
  items: { to: string; label: string; end?: boolean }[]
}

function NavigationLink({
  to,
  label,
  end,
  children,
}: {
  to: string
  label: string
  end?: boolean
  children?: ReactNode
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `min-w-0 flex-1 rounded-card px-3 py-2 font-medium transition-colors ${
          isActive ? 'bg-brand-500 text-brand-900' : 'text-surface hover:bg-brand-700'
        }`
      }
    >
      {children ?? label}
    </NavLink>
  )
}

export default function DashboardLayout({ title, items }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-60 shrink-0 flex-col gap-6 bg-brand-900 p-6 text-surface md:flex">
        <NavLink to="/" aria-label="ServiceFlow SA home">
          <Logo variant="white" />
        </NavLink>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {profile && <p className="text-sm text-white">{profile.full_name}</p>}
        <nav aria-label={`${title} navigation`} className="flex flex-col gap-2">
          {items.map((item) => (
            <NavigationLink key={item.to} {...item} />
          ))}
        </nav>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-auto rounded-card border border-brand-100 px-3 py-2 text-sm font-semibold transition-colors hover:border-accent-500 hover:text-accent-400"
        >
          Log out
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between bg-brand-900 px-4 py-3 text-surface md:hidden">
          <NavLink to="/" aria-label="ServiceFlow SA home">
            <Logo variant="white" showText />
          </NavLink>
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-card bg-accent-500 px-3 py-2 text-sm font-semibold text-ink"
          >
            Log out
          </button>
        </header>
        {/* Bottom padding keeps page content clear of the fixed mobile tab bar. */}
        <main className="mx-auto max-w-6xl px-4 py-8 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label={`${title} navigation`}
        className="fixed inset-x-0 bottom-0 z-10 flex border-t border-brand-100 bg-brand-900 p-2 md:hidden"
      >
        {items.map((item) => (
          <NavigationLink key={item.to} {...item}>
            <span className="block truncate text-center text-xs">{item.label}</span>
          </NavigationLink>
        ))}
      </nav>
    </div>
  )
}
