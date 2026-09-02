import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function AssistantPage() {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')

  const suggestions = [
    { key: 'helpProfile', icon: '👤' },
    { key: 'explainJob', icon: '💼' },
    { key: 'improveCV', icon: '📄' },
    { key: 'prepareInterview', icon: '🎯' },
  ]

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">{t('assistant.title')}</h1>
          <p className="mt-2 text-neutral-600">{t('assistant.subtitle')}</p>
        </div>

        {/* Chat Interface */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[400px]">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-neutral-100">
                    <p className="text-sm text-neutral-700">
                      Hello! I&apos;m your AI career assistant. How can I help you today?
                    </p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  placeholder={t('assistant.placeholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                    }
                  }}
                />
                <Button>{t('common.submit')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {suggestions.map((s) => (
            <Card key={s.key} className="cursor-pointer hover:border-primary-300 transition-colors">
              <CardContent className="flex items-center gap-4 p-4">
                <span className="text-2xl">{s.icon}</span>
                <span className="font-medium text-neutral-700">
                  {t(`assistant.suggestions.${s.key}`)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
