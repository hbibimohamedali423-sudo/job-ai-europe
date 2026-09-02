import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function AdminUsers() {
  const { t } = useTranslation()

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{t('admin.users.title')}</h1>
        <p className="mt-2 text-neutral-600">{t('admin.users.subtitle')}</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input placeholder={t('admin.users.search')} />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.users.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="py-3 text-left text-sm font-medium text-neutral-600">{t('admin.users.name')}</th>
                  <th className="py-3 text-left text-sm font-medium text-neutral-600">{t('admin.users.email')}</th>
                  <th className="py-3 text-left text-sm font-medium text-neutral-600">{t('admin.users.role')}</th>
                  <th className="py-3 text-left text-sm font-medium text-neutral-600">{t('admin.users.status')}</th>
                  <th className="py-3 text-left text-sm font-medium text-neutral-600">{t('admin.users.created')}</th>
                  <th className="py-3 text-left text-sm font-medium text-neutral-600">{t('admin.users.actions')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-100">
                  <td className="py-4 text-sm">-</td>
                  <td className="py-4 text-sm">-</td>
                  <td className="py-4 text-sm">-</td>
                  <td className="py-4 text-sm">-</td>
                  <td className="py-4 text-sm">-</td>
                  <td className="py-4 text-sm">
                    <Button size="sm" variant="ghost">{t('common.edit')}</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
