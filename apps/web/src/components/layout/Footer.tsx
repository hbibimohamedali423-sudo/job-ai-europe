import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="container-page py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold text-primary-600">Job AI</span>
              <span className="text-lg font-medium text-neutral-600">Europe</span>
            </div>
            <p className="text-sm text-neutral-600">
              {t('common.appName')} - AI-powered international job search and application platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-sm text-neutral-600 hover:text-primary-600">
                  {t('nav.jobs')}
                </Link>
              </li>
              <li>
                <Link to="/applications" className="text-sm text-neutral-600 hover:text-primary-600">
                  {t('nav.applications')}
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="text-sm text-neutral-600 hover:text-primary-600">
                  {t('nav.assistant')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-neutral-600 hover:text-primary-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-neutral-600 hover:text-primary-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-neutral-600 hover:text-primary-600">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-neutral-600 hover:text-primary-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-neutral-600 hover:text-primary-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 text-center">
            © {currentYear} {t('common.appName')}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
