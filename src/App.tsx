import { Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import PublicLayout from './components/layout/PublicLayout'
import PagePlaceholder from './pages/PagePlaceholder'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './auth/ProtectedRoute'
import ProviderProfilePage from './pages/provider/ProviderProfilePage'
import ServicesPage from './pages/provider/ServicesPage'
import AvailabilityPage from './pages/provider/AvailabilityPage'
import ProviderDashboardPage from './pages/provider/ProviderDashboardPage'
import BrowsePage from './pages/BrowsePage'
import ProviderPage from './pages/ProviderPage'
import BookingConfirmedPage from './pages/BookingConfirmedPage'
import MyBookingsPage from './pages/MyBookingsPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="p/:slug" element={<ProviderPage />} />
        <Route path="*" element={<PagePlaceholder title="Page not found" />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="booking-confirmed" element={<BookingConfirmedPage />} />
        <Route
          path="my-bookings"
          element={
            <DashboardLayout
              title="My account"
              items={[{ to: '/my-bookings', label: 'My bookings', end: true }]}
            />
          }
        >
          <Route index element={<MyBookingsPage />} />
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
          <Route index element={<ProviderDashboardPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="availability" element={<AvailabilityPage />} />
          <Route path="profile" element={<ProviderProfilePage />} />
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
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
