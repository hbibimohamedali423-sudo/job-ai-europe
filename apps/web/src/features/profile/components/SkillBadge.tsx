import { Badge } from '@/components/ui/Badge'
import type { ProfileSkill } from '@/services/profile'

interface SkillBadgeProps {
  skill: ProfileSkill
  onRemove?: () => void
}

export function SkillBadge({ skill, onRemove }: SkillBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1">
      <span>{skill.skill?.name || 'Unknown'}</span>
      {skill.level && <span className="text-neutral-400">({skill.level})</span>}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-error-600"
          aria-label="Remove skill"
        >
          ×
        </button>
      )}
    </Badge>
  )
}
