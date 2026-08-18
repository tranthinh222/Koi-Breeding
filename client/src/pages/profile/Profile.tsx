import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { CURRENT_USER_ID } from '../../api/currentUser'
import { apiClient } from '../../api/client'
import { getUser } from '../../api/user'

type Gender = 'MALE' | 'FEMALE' | ''

type UserProfile = {
  id: number
  username: string
  email: string
  birthday: string | null
  gender: Gender | null
  exp: number
  avatarUrl: string | null
  createdAt?: string
}

type ProfileForm = {
  email: string
  birthday: string
  gender: Gender
}

type AvatarUploadResponse = {
  url?: string
  avatarUrl?: string
}

const ACCEPTED_AVATAR_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
]

function getProfileUserId() {
  const idFromUrl = new URLSearchParams(window.location.search).get('id')
  return Number(idFromUrl ?? CURRENT_USER_ID)
}

function getLevel(exp = 0) {
  return Math.max(1, Math.floor(exp / 100))
}

function formatDate(dateInput?: string | null) {
  if (!dateInput) return 'Not updated.'

  const dateObj = new Date(dateInput)
  if (Number.isNaN(dateObj.getTime())) return 'Invalid date.'

  return dateObj.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function toDateInputValue(dateInput?: string | null) {
  if (!dateInput) return ''
  return dateInput.includes('T') ? dateInput.split('T')[0] : dateInput
}

function ProfileMessage({
  type,
  message,
}: {
  type: 'loading' | 'error' | 'info'
  message: string
}) {
  return <div className={`profile-message ${type}`}>{message}</div>
}

function ProfileHero({
  profile,
  avatarUrl,
  editing,
  uploading,
  onAvatarClick,
  onEditToggle,
  onSave,
}: {
  profile: UserProfile
  avatarUrl?: string
  editing: boolean
  uploading: boolean
  onAvatarClick: () => void
  onEditToggle: () => void
  onSave: () => void
}) {
  const avatarText = profile.username.charAt(0).toUpperCase()

  return (
    <section className="profile-hero">
      <button
        className="profile-avatar-button"
        type="button"
        onClick={onAvatarClick}
        disabled={uploading}
        aria-label="Upload avatar"
      >
        {avatarUrl ? <img src={avatarUrl} alt={profile.username} /> : <span>{avatarText}</span>}
      </button>

      <div className="profile-hero-content">
        <span className="profile-eyebrow">Player Profile</span>
        <h2>{profile.username}</h2>
        <p>Level {getLevel(profile.exp)}</p>
      </div>

      <div className="profile-actions">
        <button type="button" onClick={editing ? onSave : onEditToggle} disabled={uploading}>
          {editing ? 'Save Profile' : 'Edit Profile'}
        </button>
        {editing && (
          <button type="button" className="secondary" onClick={onEditToggle}>
            Cancel
          </button>
        )}
      </div>
    </section>
  )
}

function ProfileField({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="profile-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function AccountPanel({
  profile,
  form,
  editing,
  onChange,
}: {
  profile: UserProfile
  form: ProfileForm
  editing: boolean
  onChange: (field: keyof ProfileForm) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}) {
  return (
    <section className="profile-panel-card">
      <div className="profile-section-header">
        <span className="profile-eyebrow">Account</span>
        <h3>Personal information</h3>
      </div>

      <div className="profile-field-list">
        <ProfileField label="Username" value={profile.username} />

        <label className="profile-field">
          <span>Email</span>
          {editing ? (
            <input type="email" value={form.email} onChange={onChange('email')} />
          ) : (
            <strong>{profile.email || 'Not updated.'}</strong>
          )}
        </label>

        <label className="profile-field">
          <span>Birthday</span>
          {editing ? (
            <input type="date" value={form.birthday} onChange={onChange('birthday')} />
          ) : (
            <strong>{formatDate(profile.birthday)}</strong>
          )}
        </label>

        <label className="profile-field">
          <span>Gender</span>
          {editing ? (
            <select value={form.gender} onChange={onChange('gender')}>
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          ) : (
            <strong>{profile.gender ? (profile.gender === 'MALE' ? 'Male' : 'Female') : 'Not updated.'}</strong>
          )}
        </label>

        <ProfileField label="Joined at" value={formatDate(profile.createdAt)} />
      </div>
    </section>
  )
}

function StatisticsPanel({ profile }: { profile: UserProfile }) {
  const stats = [
    { label: 'Level', value: getLevel(profile.exp) },
    { label: 'Experience', value: profile.exp.toLocaleString() },
    { label: 'Total Fish', value: 0 },
    { label: 'Marketplace Sales', value: 0 },
  ]

  return (
    <section className="profile-panel-card">
      <div className="profile-section-header">
        <span className="profile-eyebrow">Progress</span>
        <h3>Statistics</h3>
      </div>

      <div className="profile-stat-grid">
        {stats.map((stat) => (
          <div className="profile-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function AchievementsPanel() {
  const achievements = ['First Sale', 'Koi Collector', 'Top Seller']

  return (
    <section className="profile-panel-card">
      <div className="profile-section-header">
        <span className="profile-eyebrow">Milestones</span>
        <h3>Achievements</h3>
      </div>

      <div className="achievement-list">
        {achievements.map((achievement) => (
          <div className="achievement-item" key={achievement}>
            <span>🏆</span>
            <strong>{achievement}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function FavoriteKoiPanel() {
  const favoriteKoi = ['Kohaku', 'Showa', 'Sanke']

  return (
    <section className="profile-favorite-koi">
      <div className="profile-section-header">
        <span className="profile-eyebrow">Collection</span>
        <h3>Your Favorite Koi</h3>
      </div>

      <div className="profile-koi-grid">
        {favoriteKoi.map((name, index) => (
          <div className="profile-koi-card" key={name}>
            <div className="profile-koi-image">🐟</div>
            <strong>{name}</strong>
            <span>Lv. {18 + index}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [form, setForm] = useState<ProfileForm>({
    email: '',
    birthday: '',
    gender: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [avatarVersion, setAvatarVersion] = useState(0)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const user = await getUser(getProfileUserId())
        if (cancelled) return

        setProfile(user)
        setForm({
          email: user.email ?? '',
          birthday: toDateInputValue(user.birthday),
          gender: user.gender ?? '',
        })
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Cannot load profile.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [])

  const avatarUrl = profile?.avatarUrl
    ? `${profile.avatarUrl}${profile.avatarUrl.includes('?') ? '&' : '?'}v=${avatarVersion}`
    : undefined

  const handleChange = (field: keyof ProfileForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }

  const handleEditToggle = () => {
    if (profile) {
      setForm({
        email: profile.email ?? '',
        birthday: toDateInputValue(profile.birthday),
        gender: profile.gender ?? '',
      })
    }

    setNotice(null)
    setEditing((current) => !current)
  }

  const handleSave = () => {
    if (!profile) return

    setSaving(true)
    setProfile({
      ...profile,
      email: form.email,
      birthday: form.birthday || null,
      gender: form.gender || null,
    })
    setEditing(false)
    setNotice('Profile changes are updated on this page. Backend update endpoint is not available yet.')
    setSaving(false)
  }

  const handleAvatarClick = () => {
    if (!uploading) fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!profile) return

    const file = event.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setError('Only PNG, JPG, JPEG, SVG files are allowed.')
      return
    }

    try {
      setUploading(true)
      setError(null)
      setNotice(null)

      const body = new FormData()
      body.append('file', file)

      const response = await apiClient.post<AvatarUploadResponse>('/upload/avatar', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const uploadedUrl = response.data.avatarUrl ?? response.data.url
      if (!uploadedUrl) throw new Error('Cannot read uploaded avatar URL.')

      setProfile((current) => (current ? { ...current, avatarUrl: uploadedUrl } : current))
      setAvatarVersion((current) => current + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cannot upload avatar.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <section className="title-section">
        <div className="wood-sign">
          <h1>PROFILE</h1>
          <p>Koi Garden</p>
        </div>
      </section>

      <main className="profile-page">
        {loading ? (
          <ProfileMessage type="loading" message="Loading user profile..." />
        ) : error ? (
          <ProfileMessage type="error" message={error} />
        ) : profile ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_AVATAR_TYPES.join(',')}
              onChange={handleFileChange}
              hidden
            />

            <ProfileHero
              profile={profile}
              avatarUrl={avatarUrl}
              editing={editing}
              uploading={uploading || saving}
              onAvatarClick={handleAvatarClick}
              onEditToggle={handleEditToggle}
              onSave={handleSave}
            />

            {notice && <ProfileMessage type="info" message={notice} />}

            <div className="profile-dashboard">
              <AccountPanel profile={profile} form={form} editing={editing} onChange={handleChange} />
              <StatisticsPanel profile={profile} />
              <AchievementsPanel />
            </div>

            <FavoriteKoiPanel />
          </>
        ) : (
          <ProfileMessage type="info" message="No profile data available." />
        )}
      </main>
    </>
  )
}
