import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function JobsPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{t('jobs.title')}</h1>
          <p className="mt-2 text-neutral-600">{t('jobs.subtitle')}</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <Input
              placeholder={t('jobs.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">{t('jobs.search.filters')}</Button>
        </div>

        {/* Results count */}
        <p className="text-sm text-neutral-600">
          {t('jobs.search.results', { count: 0 })}
        </p>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Job Title Placeholder</CardTitle>
                  <CardDescription className="mt-1">Company Name</CardDescription>
                </div>
                <Badge variant="success">Remote</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-neutral-600 line-clamp-3">
                  Job description placeholder. This would show a brief summary of the job...
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Full-time</Badge>
                  <Badge variant="outline">Engineering</Badge>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="text-sm text-neutral-500">Posted 2 days ago</span>
                  <Button size="sm" asChild>
                    <Link to="/jobs/1">View Details</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {false && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-neutral-100 p-4">
              <svg className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">{t('jobs.search.noResults')}</h3>
            <p className="mt-2 text-neutral-600">{t('jobs.search.adjustFilters')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
