import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'

export function AdminDashboard() {
  const { t } = useTranslation()

  const stats = [
    { label: t('admin.dashboard.users'), value: '0', color: 'text-primary-600' },
    { label: t('admin.dashboard.jobs'), value: '0', color: 'text-success-600' },
    { label: t('admin.dashboard.applications'), value: '0', color: 'text-warning-600' },
    { label: t('admin.dashboard.sources'), value: '0', color: 'text-secondary-600' },
  ]

  const menuItems = [
    { href: '/admin/users', label: t('admin.users.title'), icon: '👥' },
    { href: '/admin/jobs', label: t('admin.jobs.title'), icon: '💼' },
    { href: '/admin/sources', label: t('admin.sources.title'), icon: '🔗' },
    { href: '/admin/ai', label: t('admin.ai.title'), icon: '🤖' },
    { href: '/admin/audit', label: t('admin.audit.title'), icon: '📋' },
  ]

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{t('admin.dashboard.title')}</h1>
        <p className="mt-2 text-neutral-600">{t('admin.dashboard.subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-2 text-neutral-600">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Menu */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <Card className="hover:border-primary-300 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-lg font-medium">{item.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
