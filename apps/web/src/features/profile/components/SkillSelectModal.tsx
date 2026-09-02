import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { Skill } from '@/services/profile'

interface SkillSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (skill: Skill) => void
  skills: Skill[]
  selectedSkillIds: string[]
}

export function SkillSelectModal({ isOpen, onClose, onSelect, skills, selectedSkillIds }: SkillSelectModalProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')

  const filteredSkills = useMemo(() => {
    if (!search) return skills
    const searchLower = search.toLowerCase()
    return skills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(searchLower) ||
        skill.normalized_name.toLowerCase().includes(searchLower)
    )
  }, [skills, search])

  const availableSkills = filteredSkills.filter((skill) => !selectedSkillIds.includes(skill.id))

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('profile.skills.add')}
      footer={
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">{t('common.search')}</Label>
          <Input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {availableSkills.length === 0 ? (
            <p className="text-center text-neutral-500 py-4">
              {search ? 'No skills found' : 'All skills have been added'}
            </p>
          ) : (
            availableSkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-2 rounded hover:bg-neutral-50"
              >
                <div>
                  <p className="font-medium">{skill.name}</p>
                  {skill.category && (
                    <p className="text-sm text-neutral-500">{skill.category}</p>
                  )}
                </div>
                <Button size="sm" onClick={() => onSelect(skill)}>
                  {t('common.add')}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
