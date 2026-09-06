import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "../../api/auth"; // Sửa lại đường dẫn nếu cần

import maleAvatar from "../../assets/avatars/male_blank_avatar.png";
import femaleAvatar from "../../assets/avatars/female_blank_avatar.png";

import { getLevel, formatDate } from "../../utils/profile.utils";
import type { UserProfile, ProfileForm } from "../../types/profile.types";

export function ProfileMessage({ type, message }: { type: "loading" | "error" | "info"; message: string }) {
  return <div className={`profile-message ${type}`}>{message}</div>;
}

export function ProfileAvatarButton({
  profile, avatarUrl, uploading, onClick,
}: {
  profile: UserProfile; avatarUrl?: string; uploading: boolean; onClick: () => void;
}) {
  const fallbackAvatar = profile.gender === "MALE" ? maleAvatar : femaleAvatar;
  const [avatarSrc, setAvatarSrc] = useState(avatarUrl ?? profile.avatarUrl ?? fallbackAvatar);
  
  useEffect(() => {
    setAvatarSrc(avatarUrl ?? profile.avatarUrl ?? fallbackAvatar);
  }, [avatarUrl, profile.avatarUrl, fallbackAvatar]);
  
  const avatarText = profile.username.charAt(0).toUpperCase();

  return (
    <button className="profile-avatar-button" type="button" onClick={onClick} disabled={uploading}>
      {avatarUrl || profile.avatarUrl ? (
        <img src={avatarSrc} alt={profile.username} onError={() => { if (avatarSrc !== fallbackAvatar) setAvatarSrc(fallbackAvatar); }} />
      ) : (
        <span>{avatarText}</span>
      )}
      <span className="profile-avatar-overlay"><span>Upload</span></span>
    </button>
  );
}

export function ProfileHero({
  profile, avatarUrl, editing, uploading, onAvatarClick, onEditToggle, onSave,
}: {
  profile: UserProfile; avatarUrl?: string; editing: boolean; uploading: boolean;
  onAvatarClick: () => void; onEditToggle: () => void; onSave: () => void;
}) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try { await logoutRequest(); navigate("/"); } 
    catch (error) { navigate("/"); }
  };

  return (
    <section className="profile-hero">
      <ProfileAvatarButton profile={profile} avatarUrl={avatarUrl} uploading={uploading} onClick={onAvatarClick} />
      <div className="profile-hero-content">
        <span className="profile-eyebrow">Player Profile</span>
        <h2>{profile.username}</h2>
        <p>Level {getLevel(profile.exp)}</p>
      </div>
      <div className="profile-actions">
        <button type="button" onClick={editing ? onSave : onEditToggle} disabled={uploading}>
          {editing ? "Save Profile" : "Edit Profile"}
        </button>
        {editing && <button type="button" className="secondary" onClick={onEditToggle}>Cancel</button>}
        {!editing && <button type="button" className="secondary" onClick={handleLogout}>Sign out</button>}
      </div>
    </section>
  );
}

export function ProfileField({ label, value }: { label: string; value: string | number }) {
  return <div className="profile-field"><span>{label}</span><strong>{value}</strong></div>;
}

export function AccountPanel({
  profile, form, editing, onChange,
}: {
  profile: UserProfile; form: ProfileForm; editing: boolean;
  onChange: (field: keyof ProfileForm) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
          {editing ? <input type="email" value={form.email} onChange={onChange("email")} /> : <strong>{profile.email || "Not updated."}</strong>}
        </label>
        <label className="profile-field">
          <span>Birthday</span>
          {editing ? <input type="date" value={form.birthday} onChange={onChange("birthday")} /> : <strong>{formatDate(profile.birthday)}</strong>}
        </label>
        <label className="profile-field">
          <span>Gender</span>
          {editing ? (
            <select value={form.gender} onChange={onChange("gender")}>
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          ) : <strong>{profile.gender ? (profile.gender === "MALE" ? "Male" : "Female") : "Not updated."}</strong>}
        </label>
        <ProfileField label="Joined at" value={formatDate(profile.createdAt)} />
      </div>
    </section>
  );
}

export function StatisticsPanel({ profile }: { profile: UserProfile }) {
  const stats = [
    { label: "Level", value: getLevel(profile.exp) },
    { label: "Experience", value: profile.exp.toLocaleString() },
    { label: "Total Fish", value: 0 },
    { label: "Marketplace Sales", value: 0 },
  ];
  return (
    <section className="profile-panel-card">
      <div className="profile-section-header"><span className="profile-eyebrow">Progress</span><h3>Statistics</h3></div>
      <div className="profile-stat-grid">
        {stats.map((s) => <div className="profile-stat" key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}
      </div>
    </section>
  );
}

export function AchievementsPanel() {
  const achievements = ["First Sale", "Koi Collector", "Top Seller"];
  return (
    <section className="profile-panel-card">
      <div className="profile-section-header"><span className="profile-eyebrow">Milestones</span><h3>Achievements</h3></div>
      <div className="achievement-list">
        {achievements.map((a) => <div className="achievement-item" key={a}><span>🏆</span><strong>{a}</strong></div>)}
      </div>
    </section>
  );
}

export function FavoriteKoiPanel() {
  const favoriteKoi = ["Kohaku", "Showa", "Sanke"];
  return (
    <section className="profile-favorite-koi">
      <div className="profile-section-header"><span className="profile-eyebrow">Collection</span><h3>Your Favorite Koi</h3></div>
      <div className="profile-koi-grid">
        {favoriteKoi.map((name, i) => (
          <div className="profile-koi-card" key={name}><div className="profile-koi-image">🐟</div><strong>{name}</strong><span>Lv. {18 + i}</span></div>
        ))}
      </div>
    </section>
  );
}