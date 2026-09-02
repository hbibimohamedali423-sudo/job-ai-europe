import { useTranslation } from 'react-i18next'

export function LoadingScreen() {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="text-neutral-600">{t('loading.description')}</p>
      </div>
    </div>
  )
}
