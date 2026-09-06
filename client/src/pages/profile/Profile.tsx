import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

import maleAvatar from "../../assets/avatars/male_blank_avatar.png";
import femaleAvatar from "../../assets/avatars/female_blank_avatar.png";

import ImageEditor from "./ImageEditor";

import { useNavigate } from "react-router-dom";

import { logoutRequest } from "../../api/auth";

type Gender = "MALE" | "FEMALE" | "";

type UserProfile = {
  id: number;
  username: string;
  email: string;
  birthday: string | null;
  gender: Gender | null;
  role?: "USER" | "ADMIN" | null;
  exp: number;
  avatarUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ProfileForm = {
  email: string;
  birthday: string;
  gender: Gender;
};

// Avatar upload response handled dynamically; backend may return wrapped or plain object

type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

const ACCEPTED_AVATAR_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];

function getProfileUserId(
  userId: string | undefined,
  currentUserId: number | null,
) {
  const idFromRoute =
    userId ?? new URLSearchParams(window.location.search).get("id");
  const parsedId = Number(idFromRoute ?? currentUserId);

  return Number.isFinite(parsedId) && parsedId > 0 ? parsedId : currentUserId;
}

function getLevel(exp = 0) {
  return Math.max(1, Math.floor(exp / 100));
}

function formatDate(dateInput?: string | null) {
  if (!dateInput) return "Not updated.";

  const dateObj = new Date(dateInput);
  if (Number.isNaN(dateObj.getTime())) return "Invalid date.";

  return dateObj.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function toDateInputValue(dateInput?: string | null) {
  if (!dateInput) return "";
  return dateInput.includes("T") ? dateInput.split("T")[0] : dateInput;
}

function ProfileMessage({
  type,
  message,
}: {
  type: "loading" | "error" | "info";
  message: string;
}) {
  return <div className={`profile-message ${type}`}>{message}</div>;
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
  profile: UserProfile;
  avatarUrl?: string;
  editing: boolean;
  uploading: boolean;
  onAvatarClick: () => void;
  onEditToggle: () => void;
  onSave: () => void;
}) {
  const fallbackAvatar = profile.gender === "MALE" ? maleAvatar : femaleAvatar;
  const [avatarSrc, setAvatarSrc] = useState(
    avatarUrl ?? profile.avatarUrl ?? fallbackAvatar,
  );
  const navigate = useNavigate();
  // Keep local src in sync when parent provides a new avatarUrl (cache-busting query param)
  useEffect(() => {
    setAvatarSrc(avatarUrl ?? profile.avatarUrl ?? fallbackAvatar);
  }, [avatarUrl, profile.avatarUrl, fallbackAvatar]);
  const avatarText = profile.username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logoutRequest();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/");
    }
  };
  return (
    <section className="profile-hero">
      <button
        className="profile-avatar-button"
        type="button"
        onClick={onAvatarClick}
        disabled={uploading}
        aria-label="Upload avatar"
        title="Upload avatar"
      >
        {avatarUrl ? (
          <img
            src={avatarSrc}
            alt={profile.username}
            onError={() => {
              if (avatarSrc !== fallbackAvatar) {
                setAvatarSrc(fallbackAvatar);
              }
            }}
          />
        ) : (
          <span>{avatarText}</span>
        )}
        <span className="profile-avatar-overlay">
          <span>Upload</span>
        </span>
      </button>

      <div className="profile-hero-content">
        <span className="profile-eyebrow">Player Profile</span>
        <h2>{profile.username}</h2>
        <p>Level {getLevel(profile.exp)}</p>
      </div>

      <div className="profile-actions">
        <button
          type="button"
          onClick={editing ? onSave : onEditToggle}
          disabled={uploading}
        >
          {editing ? "Save Profile" : "Edit Profile"}
        </button>
        {editing && (
          <button type="button" className="secondary" onClick={onEditToggle}>
            Cancel
          </button>
        )}
        {!editing && (
          <button type="button" className="secondary" onClick={handleLogout}>
            Sign out
          </button>
        )}
      </div>
    </section>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="profile-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AccountPanel({
  profile,
  form,
  editing,
  onChange,
}: {
  profile: UserProfile;
  form: ProfileForm;
  editing: boolean;
  onChange: (
    field: keyof ProfileForm,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
            <input
              type="email"
              value={form.email}
              onChange={onChange("email")}
            />
          ) : (
            <strong>{profile.email || "Not updated."}</strong>
          )}
        </label>

        <label className="profile-field">
          <span>Birthday</span>
          {editing ? (
            <input
              type="date"
              value={form.birthday}
              onChange={onChange("birthday")}
            />
          ) : (
            <strong>{formatDate(profile.birthday)}</strong>
          )}
        </label>

        <label className="profile-field">
          <span>Gender</span>
          {editing ? (
            <select value={form.gender} onChange={onChange("gender")}>
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          ) : (
            <strong>
              {profile.gender
                ? profile.gender === "MALE"
                  ? "Male"
                  : "Female"
                : "Not updated."}
            </strong>
          )}
        </label>

        <ProfileField label="Joined at" value={formatDate(profile.createdAt)} />
      </div>
    </section>
  );
}

function StatisticsPanel({ profile }: { profile: UserProfile }) {
  const stats = [
    { label: "Level", value: getLevel(profile.exp) },
    { label: "Experience", value: profile.exp.toLocaleString() },
    { label: "Total Fish", value: 0 },
    { label: "Marketplace Sales", value: 0 },
  ];

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
  );
}

function AchievementsPanel() {
  const achievements = ["First Sale", "Koi Collector", "Top Seller"];

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
  );
}

function FavoriteKoiPanel() {
  const favoriteKoi = ["Kohaku", "Showa", "Sanke"];

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
  );
}

export default function Profile() {
  const { userId: routeUserId } = useParams();
  const { currentUserId, setAuthenticatedUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    email: "",
    birthday: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [avatarVersion, setAvatarVersion] = useState(0);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastObjectUrlRef = useRef<string | null>(null);
  const previousAvatarRef = useRef<string | null>(null);

  const cleanupSelectedImage = () => {
    if (lastObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(lastObjectUrlRef.current);
      } catch (e) {
        // ignore
      }
      lastObjectUrlRef.current = null;
    }

    setSelectedImage(null);
    setShowEditor(false);
    previousAvatarRef.current = null;
  };

  // expose cleanup to be used when editor cancels

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getProfileUserId(routeUserId, currentUserId);
        if (!userId) return;

        const response = await apiClient.get<ApiResponse<UserProfile>>(
          "/users/profile",
          {
            params: { id: userId },
          },
        );
        const user = response.data.data;
        if (cancelled) return;

        setProfile(user);
        setForm({
          email: user.email ?? "",
          birthday: toDateInputValue(user.birthday),
          gender: user.gender ?? "",
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Cannot load profile.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [currentUserId, routeUserId]);

  const avatarUrl = profile?.avatarUrl
    ? `${profile.avatarUrl}${profile.avatarUrl.includes("?") ? "&" : "?"}v=${avatarVersion}`
    : undefined;

  const handleSaveCroppedImage = async (blob: Blob) => {
    try {
      setUploading(true);

      // Lấy định dạng của blob (mặc định là image/jpeg nếu không có)
      const fileType = blob.type || "image/jpeg";

      // 1. Kiểm tra xem định dạng file có hợp lệ không
      if (!ACCEPTED_AVATAR_TYPES.includes(fileType)) {
        throw new Error("Định dạng file không được hỗ trợ.");
      }

      // 2. Xác định đuôi file (extension) dựa trên fileType
      let extension = "jpg";
      if (fileType === "image/png") extension = "png";
      else if (fileType === "image/svg+xml") extension = "svg";
      // 'image/jpeg' và 'image/jpg' dùng chung đuôi 'jpg'

      const fileName = `avatar.${extension}`;

      // 3. Truyền định dạng và tên file động vào constructor của File
      const file = new File([blob], fileName, {
        type: fileType,
      });

      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post("/users/avatar", formData, {
        params: { id: profile!.id },
        headers: { "Content-Type": "multipart/form-data" },
      });

      const respData = res.data as any;
      const uploadedUrl =
        respData?.data?.avatarUrl ??
        respData?.data?.url ??
        respData?.avatarUrl ??
        respData?.url;
      if (!uploadedUrl) throw new Error("Cannot read uploaded avatar URL.");

      setProfile((current) =>
        current ? { ...current, avatarUrl: uploadedUrl } : current,
      );
      setAvatarVersion((current) => current + 1);

      // Đóng editor
      setShowEditor(false);
      setSelectedImage(null);

      setNotice("Avatar updated successfully.");
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);

      // Hiển thị thông báo lỗi cụ thể nếu sai định dạng, ngược lại báo lỗi chung chung
      const errorMessage =
        error.message === "Định dạng file không được hỗ trợ."
          ? error.message
          : "Failed to upload avatar.";

      setNotice(errorMessage);
    } finally {
      setUploading(false);
    }
  };
  const handleChange =
    (field: keyof ProfileForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleEditToggle = () => {
    if (profile) {
      setForm({
        email: profile.email ?? "",
        birthday: toDateInputValue(profile.birthday),
        gender: profile.gender ?? "",
      });
    }

    setNotice(null);
    setEditing((current) => !current);
  };

  const handleSave = () => {
    if (!profile) return;

    const saveProfile = async () => {
      try {
        setSaving(true);
        setError(null);
        setNotice(null);

        const response = await apiClient.put<ApiResponse<UserProfile>>(
          "/users/profile",
          {
            email: form.email,
            birthday: form.birthday || null,
            gender: form.gender || null,
          },
          {
            params: { id: profile.id },
          },
        );

        const updatedProfile = response.data.data;
        setProfile(updatedProfile);
        if (updatedProfile.id === currentUserId) {
          setAuthenticatedUser({
            ...updatedProfile,
            gender: updatedProfile.gender || null,
            role: updatedProfile.role ?? "USER",
            createdAt: updatedProfile.createdAt ?? "",
            updatedAt: updatedProfile.updatedAt ?? "",
          });
        }
        setEditing(false);
        setNotice("Profile updated successfully.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Cannot save profile.");
      } finally {
        setSaving(false);
      }
    };

    void saveProfile();
  };

  const handleAvatarClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setError("Only PNG, JPG, JPEG, SVG files are allowed.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    lastObjectUrlRef.current = imageUrl;

    // remember current avatar so underlying UI doesn't show preview
    previousAvatarRef.current = profile?.avatarUrl ?? null;

    setSelectedImage(imageUrl);
    setShowEditor(true);

    // clear file input so same file can be re-selected later
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <section className="title-section">
        <div className="wood-sign">
          <h1>PROFILE</h1>
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
              accept={ACCEPTED_AVATAR_TYPES.join(",")}
              onChange={handleImageSelect}
              hidden
            />

            <ProfileHero
              profile={profile}
              avatarUrl={
                showEditor
                  ? previousAvatarRef.current
                    ? `${previousAvatarRef.current}${previousAvatarRef.current.includes("?") ? "&" : "?"}v=${avatarVersion}`
                    : undefined
                  : avatarUrl
              }
              editing={editing}
              uploading={uploading || saving}
              onAvatarClick={handleAvatarClick}
              onEditToggle={handleEditToggle}
              onSave={handleSave}
            />

            {notice && <ProfileMessage type="info" message={notice} />}

            <div className="profile-dashboard">
              <AccountPanel
                profile={profile}
                form={form}
                editing={editing}
                onChange={handleChange}
              />

              <StatisticsPanel profile={profile} />

              <AchievementsPanel />
            </div>

            <FavoriteKoiPanel />

            {/* Image Editor */}
            {showEditor && selectedImage && (
              <ImageEditor
                image={selectedImage}
                onCancel={cleanupSelectedImage}
                onSave={(blob) => {
                  // when saving, upload and then cleanup object URL
                  void handleSaveCroppedImage(blob).then(() =>
                    cleanupSelectedImage(),
                  );
                }}
              />
            )}
          </>
        ) : (
          <ProfileMessage type="info" message="No profile data available." />
        )}
      </main>
    </>
  );
}
