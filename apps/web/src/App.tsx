import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getLanguageDir } from '@/lib/i18n'

import { useAuthStore } from '@/stores/auth'
import { Layout } from '@/components/layout/Layout'
import { LoadingScreen } from '@/components/feedback/LoadingScreen'

import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { JobsPage } from '@/features/jobs/pages/JobsPage'
import { JobDetailsPage } from '@/features/jobs/pages/JobDetailsPage'
import { SavedJobsPage } from '@/features/jobs/pages/SavedJobsPage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { ApplicationsPage } from '@/features/applications/pages/ApplicationsPage'
import { AssistantPage } from '@/features/assistant/pages/AssistantPage'
import { AdminDashboard } from '@/features/admin/pages/AdminDashboard'
import { AdminUsers } from '@/features/admin/pages/AdminUsers'
import { AdminJobs } from '@/features/admin/pages/AdminJobs'
import { AdminSources } from '@/features/admin/pages/AdminSources'
import { AdminAI } from '@/features/admin/pages/AdminAI'
import { AdminSettings } from '@/features/admin/pages/AdminSettings'
import { AdminAuditLogs } from '@/features/admin/pages/AdminAuditLogs'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading, isAdmin } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(isAdmin ? 'admin' : 'user')) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  const { i18n } = useTranslation()
  const { initialize, loading } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const dir = getLanguageDir(i18n.language)
    document.documentElement.dir = dir
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:jobId" element={<JobDetailsPage />} />
        <Route path="saved-jobs" element={
          <ProtectedRoute>
            <SavedJobsPage />
          </ProtectedRoute>
        } />

        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        <Route path="applications" element={
          <ProtectedRoute>
            <ApplicationsPage />
          </ProtectedRoute>
        } />

        <Route path="assistant" element={
          <ProtectedRoute>
            <AssistantPage />
          </ProtectedRoute>
        } />

        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="admin/jobs" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminJobs />
          </ProtectedRoute>
        } />
        <Route path="admin/sources" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminSources />
          </ProtectedRoute>
        } />
        <Route path="admin/ai" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminAI />
          </ProtectedRoute>
        } />
        <Route path="admin/settings" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <AdminSettings />
          </ProtectedRoute>
        } />
        <Route path="admin/audit" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminAuditLogs />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
