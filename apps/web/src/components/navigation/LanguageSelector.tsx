import { useTranslation } from 'react-i18next'
import { languages, getLanguageDir } from '@/lib/i18n'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Button } from '@/components/ui/Button'
import { useEffect } from 'react'

export function LanguageSelector() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.dir = getLanguageDir(i18n.language)
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="text-lg">{currentLang.code === 'en' ? '🇬🇧' : currentLang.code === 'de' ? '🇩🇪' : currentLang.code === 'fr' ? '🇫🇷' : currentLang.code === 'ar' ? '🇸🇦' : currentLang.code === 'it' ? '🇮🇹' : '🇪🇸'}</span>
          <span className="hidden sm:inline">{currentLang.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              i18n.changeLanguage(lang.code)
              document.documentElement.dir = lang.dir
              document.documentElement.lang = lang.code
            }}
            className={i18n.language === lang.code ? 'bg-neutral-100' : ''}
          >
            <span className="mr-2">
              {lang.code === 'en' ? '🇬🇧' : lang.code === 'de' ? '🇩🇪' : lang.code === 'fr' ? '🇫🇷' : lang.code === 'ar' ? '🇸🇦' : lang.code === 'it' ? '🇮🇹' : '🇪🇸'}
            </span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
