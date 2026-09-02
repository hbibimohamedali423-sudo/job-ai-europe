import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAssistantStore } from '@/stores/assistant'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import type { AssistantSuggestion, AssistantIntent } from '@/types/assistant'

const SUGGESTIONS: AssistantSuggestion[] = [
  { key: 'helpProfile', icon: '👤', intent: 'profile_help', labelKey: 'assistant.suggestions.helpProfile' },
  { key: 'explainJob', icon: '💼', intent: 'job_explanation', labelKey: 'assistant.suggestions.explainJob' },
  { key: 'improveCV', icon: '📄', intent: 'cv_help', labelKey: 'assistant.suggestions.improveCV' },
  { key: 'prepareInterview', icon: '🎯', intent: 'interview_prep', labelKey: 'assistant.suggestions.prepareInterview' },
  { key: 'careerGuidance', icon: '🚀', intent: 'career_guidance', labelKey: 'assistant.suggestions.careerGuidance' },
  { key: 'translate', icon: '🌍', intent: 'translation', labelKey: 'assistant.suggestions.translate' },
]

export function AssistantPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const {
    messages,
    loading,
    error,
    currentContext,
    sendMessage,
    clearMessages,
    clearContext,
  } = useAssistantStore()

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = useCallback(async () => {
    if (!user || !inputValue.trim() || loading) return
    const messageToSend = inputValue.trim()
    setInputValue('')
    await sendMessage(user.id, messageToSend)
  }, [user, inputValue, loading, sendMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const handleSuggestionClick = useCallback(async (suggestion: AssistantSuggestion) => {
    if (!user || loading) return
    
    // Clear previous context when clicking suggestion
    clearContext()
    
    // Generate appropriate message based on intent
    const message = getSuggestionMessage(suggestion.intent)
    await sendMessage(user.id, message)
  }, [user, loading, clearContext, sendMessage])

  const handleNewChat = useCallback(() => {
    clearMessages()
    clearContext()
  }, [clearMessages, clearContext])

  if (!user) {
    return (
      <div className="container-page py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-neutral-900">{t('assistant.authRequired.title')}</h2>
          <p className="mt-2 text-neutral-600">{t('assistant.authRequired.message')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{t('assistant.title')}</h1>
            <p className="mt-2 text-neutral-600">{t('assistant.subtitle')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleNewChat}>
            {t('assistant.newChat')}
          </Button>
        </div>

        {/* Context Badge */}
        {currentContext && (
          <div className="mb-4">
            <Badge variant="secondary">
              {t(`assistant.context.${currentContext.type}`)}
            </Badge>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4 rounded-lg bg-error-50 p-4 text-error-600">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={() => useAssistantStore.getState().clearError()}>
                {t('common.dismiss')}
              </Button>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <span>💬</span>
              {t('assistant.chatTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[450px]">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        message.role === 'user'
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-secondary-100 text-secondary-600'
                      }`}
                    >
                      {message.role === 'user' ? '👤' : '🤖'}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div
                        className={`mt-1 text-xs ${
                          message.role === 'user' ? 'text-primary-200' : 'text-neutral-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                      🤖
                    </div>
                    <div className="rounded-lg bg-neutral-100 p-4">
                      <Spinner size="sm" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  placeholder={t('assistant.placeholder')}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || loading}>
                  {loading ? <Spinner size="sm" /> : t('assistant.send')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <div className="mb-4">
          <h3 className="mb-3 text-sm font-medium text-neutral-600">
            {t('assistant.quickActions')}
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {SUGGESTIONS.map((suggestion) => (
              <Card
                key={suggestion.key}
                className="cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <span className="text-xl">{suggestion.icon}</span>
                  <span className="text-sm font-medium text-neutral-700">
                    {t(suggestion.labelKey)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-xs text-neutral-500">
          {t('assistant.helpText')}
        </div>
      </div>
    </div>
  )
}

// Helper function to get message text for suggestion
function getSuggestionMessage(intent: AssistantIntent): string {
  switch (intent) {
    case 'profile_help':
      return "Help me improve my professional profile"
    case 'job_explanation':
      return "Explain the job requirements to me"
    case 'cv_help':
      return "How can I improve my CV?"
    case 'interview_prep':
      return "Help me prepare for an interview"
    case 'career_guidance':
      return "Give me some career guidance"
    case 'translation':
      return "I need help with translation"
    case 'match_explanation':
      return "Explain why I matched with this job"
    case 'application_help':
      return "Help me with my job application"
    default:
      return "Can you help me with my job search?"
  }
}

// Helper function to format time
function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
