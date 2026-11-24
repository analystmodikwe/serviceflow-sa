import { Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import PublicLayout from './components/layout/PublicLayout'
import PagePlaceholder from './pages/PagePlaceholder'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './auth/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<PagePlaceholder title="Landing" />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="browse" element={<PagePlaceholder title="Browse providers" />} />
        <Route path="p/:slug" element={<PagePlaceholder title="Provider profile and booking" />} />
        <Route path="booking-confirmed" element={<PagePlaceholder title="Booking confirmed" />} />
        <Route path="*" element={<PagePlaceholder title="Page not found" />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route
          path="my-bookings"
          element={
            <DashboardLayout
              title="My account"
              items={[{ to: '/my-bookings', label: 'My bookings', end: true }]}
            />
          }
        >
          <Route index element={<PagePlaceholder title="My bookings" />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['provider']} />}>
        <Route
          path="provider"
          element={
            <DashboardLayout
              title="Provider"
              items={[
                { to: '/provider', label: 'Bookings', end: true },
                { to: '/provider/services', label: 'Services' },
                { to: '/provider/availability', label: 'Availability' },
                { to: '/provider/profile', label: 'Profile' },
              ]}
            />
          }
        >
          <Route index element={<PagePlaceholder title="Bookings" />} />
          <Route path="services" element={<PagePlaceholder title="Services" />} />
          <Route path="availability" element={<PagePlaceholder title="Availability" />} />
          <Route path="profile" element={<PagePlaceholder title="Profile" />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route
          path="admin"
          element={
            <DashboardLayout
              title="Admin"
              items={[{ to: '/admin', label: 'Providers', end: true }]}
            />
          }
        >
          <Route index element={<PagePlaceholder title="Providers" />} />
        </Route>
      </Route>
    </Routes>
  )
}
