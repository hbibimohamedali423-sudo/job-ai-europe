import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingScreen } from '@/components/feedback/LoadingScreen'
import {
  ExperienceCard,
  EducationCard,
  CertificationCard,
  LanguageCard,
  SkillBadge,
  ExperienceFormModal,
  EducationFormModal,
  CertificationFormModal,
  LanguageFormModal,
  SkillSelectModal,
  ProfileEditModal,
  ProfilePhotoUpload,
} from '../components'
import type { Experience, Education, Certification, Language, Skill } from '@/services/profile'

export function ProfilePage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const {
    profile,
    experiences,
    education,
    certifications,
    languages,
    skills,
    allSkills,
    loading,
    initialized,
    initialize,
    updateProfile,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addCertification,
    updateCertification,
    deleteCertification,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    addSkill,
    removeSkill,
    calculateCompletion,
  } = useProfileStore()

  const [completion, setCompletion] = useState(0)

  const handleAvatarUpload = async (url: string) => {
    await updateProfile({ avatar_url: url })
  }

  const handleAvatarDelete = async () => {
    await updateProfile({ avatar_url: null })
  }

  // Modals state
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [experienceModalOpen, setExperienceModalOpen] = useState(false)
  const [educationModalOpen, setEducationModalOpen] = useState(false)
  const [certificationModalOpen, setCertificationModalOpen] = useState(false)
  const [languageModalOpen, setLanguageModalOpen] = useState(false)
  const [skillModalOpen, setSkillModalOpen] = useState(false)

  // Edit state
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null)

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialize, initialized])

  useEffect(() => {
    if (initialized) {
      setCompletion(calculateCompletion())
    }
  }, [profile, experiences, education, certifications, languages, skills, initialized, calculateCompletion])

  if (!initialized || !user) {
    return <LoadingScreen />
  }

  const handleProfileUpdate = async (data: Partial<typeof profile>) => {
    if (data) {
      await updateProfile(data)
      setProfileModalOpen(false)
    }
  }

  const handleExperienceSubmit = async (data: Omit<Experience, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => {
    if (editingExperience) {
      await updateExperience(editingExperience.id, data)
    } else {
      await addExperience(data)
    }
    setExperienceModalOpen(false)
    setEditingExperience(null)
  }

  const handleEducationSubmit = async (data: Omit<Education, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => {
    if (editingEducation) {
      await updateEducation(editingEducation.id, data)
    } else {
      await addEducation(data)
    }
    setEducationModalOpen(false)
    setEditingEducation(null)
  }

  const handleCertificationSubmit = async (data: Omit<Certification, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => {
    if (editingCertification) {
      await updateCertification(editingCertification.id, data)
    } else {
      await addCertification(data)
    }
    setCertificationModalOpen(false)
    setEditingCertification(null)
  }

  const handleLanguageSubmit = async (data: Omit<Language, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => {
    if (editingLanguage) {
      await updateLanguage(editingLanguage.id, data)
    } else {
      await addLanguage(data)
    }
    setLanguageModalOpen(false)
    setEditingLanguage(null)
  }

  const handleSkillSelect = async (skill: Skill) => {
    await addSkill(skill.id)
    setSkillModalOpen(false)
  }

  const handleDeleteExperience = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      await deleteExperience(id)
    }
  }

  const handleDeleteEducation = async (id: string) => {
    if (confirm('Are you sure you want to delete this education?')) {
      await deleteEducation(id)
    }
  }

  const handleDeleteCertification = async (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      await deleteCertification(id)
    }
  }

  const handleDeleteLanguage = async (id: string) => {
    if (confirm('Are you sure you want to delete this language?')) {
      await deleteLanguage(id)
    }
  }

  const handleRemoveSkill = async (skillId: string) => {
    if (confirm('Are you sure you want to remove this skill?')) {
      await removeSkill(skillId)
    }
  }

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{t('profile.title')}</h1>
            <p className="mt-2 text-neutral-600">{t('profile.subtitle')}</p>
          </div>
          <Button onClick={() => setProfileModalOpen(true)}>{t('common.edit')}</Button>
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
                <span>{t('profile.completion.complete', { percent: completion })}</span>
                <span className="font-medium">{completion}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-200">
                <div
                  className="h-2 rounded-full bg-primary-600 transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('profile.personal.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <ProfilePhotoUpload
                  userId={user.id}
                  currentAvatarUrl={profile?.avatar_url || null}
                  onUploadComplete={handleAvatarUpload}
                  onDeleteComplete={handleAvatarDelete}
                />
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 flex-1">
                <div>
                  <p className="text-sm text-neutral-500">{t('profile.personal.fullName')}</p>
                  <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">{t('profile.personal.email')}</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">{t('profile.personal.phone')}</p>
                  <p className="font-medium">{profile?.phone || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">{t('profile.personal.country')}</p>
                  <p className="font-medium">{profile?.country || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">{t('profile.personal.city')}</p>
                  <p className="font-medium">{profile?.city || 'Not set'}</p>
                </div>
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
              <p className="font-medium">{profile?.professional_title || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">{t('profile.professional.summary')}</p>
              <p className="font-medium">{profile?.summary || 'Not set'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('profile.skills.title')}</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setSkillModalOpen(true)}>
                {t('profile.skills.add')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <SkillBadge
                    key={skill.skill_id}
                    skill={skill}
                    onRemove={() => handleRemoveSkill(skill.skill_id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-neutral-500">{t('profile.skills.noSkills')}</p>
            )}
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('profile.experience.title')}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingExperience(null)
                  setExperienceModalOpen(true)
                }}
              >
                {t('profile.experience.add')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  onEdit={(e) => {
                    setEditingExperience(e)
                    setExperienceModalOpen(true)
                  }}
                  onDelete={handleDeleteExperience}
                />
              ))
            ) : (
              <p className="text-neutral-500">{t('profile.experience.noExperience')}</p>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('profile.education.title')}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingEducation(null)
                  setEducationModalOpen(true)
                }}
              >
                {t('profile.education.add')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {education.length > 0 ? (
              education.map((edu) => (
                <EducationCard
                  key={edu.id}
                  education={edu}
                  onEdit={(e) => {
                    setEditingEducation(e)
                    setEducationModalOpen(true)
                  }}
                  onDelete={handleDeleteEducation}
                />
              ))
            ) : (
              <p className="text-neutral-500">{t('profile.education.noEducation')}</p>
            )}
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('profile.languages.title')}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingLanguage(null)
                  setLanguageModalOpen(true)
                }}
              >
                {t('profile.languages.add')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {languages.length > 0 ? (
              languages.map((lang) => (
                <LanguageCard
                  key={lang.id}
                  language={lang}
                  onEdit={(l) => {
                    setEditingLanguage(l)
                    setLanguageModalOpen(true)
                  }}
                  onDelete={handleDeleteLanguage}
                />
              ))
            ) : (
              <p className="text-neutral-500">{t('profile.languages.noLanguages')}</p>
            )}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('profile.certifications.title')}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingCertification(null)
                  setCertificationModalOpen(true)
                }}
              >
                {t('profile.certifications.add')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.length > 0 ? (
              certifications.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  certification={cert}
                  onEdit={(c) => {
                    setEditingCertification(c)
                    setCertificationModalOpen(true)
                  }}
                  onDelete={handleDeleteCertification}
                />
              ))
            ) : (
              <p className="text-neutral-500">{t('profile.certifications.noCertifications')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ProfileEditModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSubmit={handleProfileUpdate}
        profile={profile}
        loading={loading}
      />

      <ExperienceFormModal
        isOpen={experienceModalOpen}
        onClose={() => {
          setExperienceModalOpen(false)
          setEditingExperience(null)
        }}
        onSubmit={handleExperienceSubmit}
        experience={editingExperience}
        loading={loading}
      />

      <EducationFormModal
        isOpen={educationModalOpen}
        onClose={() => {
          setEducationModalOpen(false)
          setEditingEducation(null)
        }}
        onSubmit={handleEducationSubmit}
        education={editingEducation}
        loading={loading}
      />

      <CertificationFormModal
        isOpen={certificationModalOpen}
        onClose={() => {
          setCertificationModalOpen(false)
          setEditingCertification(null)
        }}
        onSubmit={handleCertificationSubmit}
        certification={editingCertification}
        loading={loading}
      />

      <LanguageFormModal
        isOpen={languageModalOpen}
        onClose={() => {
          setLanguageModalOpen(false)
          setEditingLanguage(null)
        }}
        onSubmit={handleLanguageSubmit}
        language={editingLanguage}
        loading={loading}
      />

      <SkillSelectModal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        onSelect={handleSkillSelect}
        skills={allSkills}
        selectedSkillIds={skills.map((s) => s.skill_id)}
      />
    </div>
  )
}
