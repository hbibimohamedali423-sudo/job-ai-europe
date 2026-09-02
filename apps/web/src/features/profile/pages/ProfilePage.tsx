import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function ProfilePage() {
  const { t } = useTranslation()

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{t('profile.title')}</h1>
            <p className="mt-2 text-neutral-600">{t('profile.subtitle')}</p>
          </div>
          <Button>{t('common.edit')}</Button>
        </div>

        {/* Profile Completion */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('profile.completion.title')}</CardTitle>
            <CardDescription>{t('profile.completion.improve')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Profile completion</span>
                <span className="font-medium">0%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-200">
                <div className="h-2 w-0 rounded-full bg-primary-600 transition-all" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('profile.personal.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-neutral-500">{t('profile.personal.fullName')}</p>
                <p className="font-medium">Not set</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t('profile.personal.email')}</p>
                <p className="font-medium">user@example.com</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t('profile.personal.country')}</p>
                <p className="font-medium">Not set</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">{t('profile.personal.city')}</p>
                <p className="font-medium">Not set</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('profile.professional.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-neutral-500">{t('profile.professional.professionalTitle')}</p>
              <p className="font-medium">Not set</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">{t('profile.professional.summary')}</p>
              <p className="font-medium">Not set</p>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('profile.skills.title')}</CardTitle>
              <Button size="sm" variant="outline">{t('profile.skills.add')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-500">{t('profile.skills.noSkills')}</p>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('profile.experience.title')}</CardTitle>
              <Button size="sm" variant="outline">{t('profile.experience.add')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-500">{t('profile.experience.noExperience')}</p>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('profile.education.title')}</CardTitle>
              <Button size="sm" variant="outline">{t('profile.education.add')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-500">{t('profile.education.noEducation')}</p>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('profile.languages.title')}</CardTitle>
              <Button size="sm" variant="outline">{t('profile.languages.add')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-500">{t('profile.languages.noLanguages')}</p>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('profile.certifications.title')}</CardTitle>
              <Button size="sm" variant="outline">{t('profile.certifications.add')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-500">{t('profile.certifications.noCertifications')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
