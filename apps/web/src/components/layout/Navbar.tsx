import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { LanguageSelector } from '@/components/navigation/LanguageSelector'

export function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, isAdmin, logout } = useAuthStore()

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/jobs', label: t('nav.jobs') },
  ]

  const userLinks = user
    ? [
        { href: '/applications', label: t('nav.applications') },
        { href: '/profile', label: t('nav.profile') },
        { href: '/assistant', label: t('nav.assistant') },
      ]
    : []

  const adminLinks = isAdmin
    ? [{ href: '/admin', label: t('nav.admin') }]
    : []

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary-600">Job AI</span>
              <span className="text-xl font-medium text-neutral-600">Europe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    location.pathname === link.href
                      ? 'text-primary-600'
                      : 'text-neutral-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {userLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    location.pathname === link.href
                      ? 'text-primary-600'
                      : 'text-neutral-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    location.pathname.startsWith(link.href)
                      ? 'text-primary-600'
                      : 'text-neutral-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">{t('nav.profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">{t('nav.settings')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">{t('nav.register')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
