import { redirect } from 'next/navigation'
import { verifyAdminSession, getAdminToken } from '@/lib/admin-auth'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = getAdminToken()
  // Login page doesn't require auth
  // We'll handle redirect in middleware instead, so layout just passes through
  // But we still verify for the protected section
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
