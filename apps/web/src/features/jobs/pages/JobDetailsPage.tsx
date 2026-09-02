import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function JobDetailsPage() {
  const { t } = useTranslation()

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          ← {t('common.back')}
        </Button>

        {/* Job Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Job Title</CardTitle>
                <p className="mt-1 text-lg text-neutral-600">Company Name</p>
              </div>
              <Badge variant="success">Remote</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-neutral-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Location</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Full-time</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <span className="font-medium">€60,000 - €80,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('jobs.details.about')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-neutral max-w-none">
              <p>Job description would appear here. This is a placeholder for the job details page.</p>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('jobs.details.requirements')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Requirement 1</li>
              <li>Requirement 2</li>
              <li>Requirement 3</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button size="lg" className="flex-1">
            {t('jobs.card.apply')}
          </Button>
          <Button size="lg" variant="outline">
            {t('jobs.card.save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
