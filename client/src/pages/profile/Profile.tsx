import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useParams } from "react-router-dom";

import { apiClient } from "../../api/client"; // Kiểm tra lại đường dẫn
import { useAuth } from "../../context/AuthContext"; // Kiểm tra lại đường dẫn
import ImageEditor from "../../components/image-preview/ImageEditor"; // Kiểm tra lại đường dẫn

import { ACCEPTED_AVATAR_TYPES } from "../../types/profile.types";
import type { UserProfile, ProfileForm } from "../../types/profile.types";
import { getProfileUserId, toDateInputValue } from "../../utils/profile.utils";
import { useImageCropper } from "../../hooks/useImageCropper";
import { 
  ProfileMessage, ProfileHero, AccountPanel, 
  StatisticsPanel, AchievementsPanel, FavoriteKoiPanel 
} from "../../components/user/ProfileComponents";

export default function Profile() {
  const { userId: routeUserId } = useParams();
  const { currentUserId, setAuthenticatedUser } = useAuth();
  
  // States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<ProfileForm>({ email: "", birthday: "", gender: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [avatarVersion, setAvatarVersion] = useState(0);

  // Load Profile
  useEffect(() => {
    let cancelled = false;
    const loadProfile = async () => {
      try {
        setLoading(true); setError(null);
        const userId = getProfileUserId(routeUserId, currentUserId);
        if (!userId) return;

        const response = await apiClient.get("/users/profile", { params: { id: userId } });
        if (cancelled) return;
        
        const user = response.data.data;
        setProfile(user);
        setForm({
          email: user.email ?? "",
          birthday: toDateInputValue(user.birthday),
          gender: user.gender ?? "",
        });
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Cannot load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadProfile();
    return () => { cancelled = true; };
  }, [currentUserId, routeUserId]);

  // Handle Image Upload bằng Hook
  const imageCropper = useImageCropper({
    onUpload: async (blob) => {
      const fileType = blob.type || "image/jpeg";
      if (!ACCEPTED_AVATAR_TYPES.includes(fileType)) throw new Error("Định dạng file không được hỗ trợ.");
      
      let extension = "jpg";
      if (fileType === "image/png") extension = "png";
      else if (fileType === "image/svg+xml") extension = "svg";

      const file = new File([blob], `avatar.${extension}`, { type: fileType });
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post("/users/avatar", formData, {
        params: { id: profile!.id },
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = res.data?.data?.avatarUrl ?? res.data?.data?.url ?? res.data?.avatarUrl ?? res.data?.url;
      if (!uploadedUrl) throw new Error("Cannot read uploaded avatar URL.");

      setProfile((cur) => cur ? { ...cur, avatarUrl: uploadedUrl } : cur);
      setAvatarVersion((v) => v + 1);
      setNotice("Avatar updated successfully.");
      imageCropper.setError(null);
    }
  });

  // Handle Form changes
  const handleChange = (field: keyof ProfileForm) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((cur) => ({ ...cur, [field]: event.target.value }));
  };

  const handleEditToggle = () => {
    if (profile) setForm({ email: profile.email ?? "", birthday: toDateInputValue(profile.birthday), gender: profile.gender ?? "" });
    setNotice(null);
    setEditing((cur) => !cur);
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true); setError(null); setNotice(null);
      const res = await apiClient.put("/users/profile", form, { params: { id: profile.id } });
      const updatedProfile = res.data.data;
      
      setProfile(updatedProfile);
      if (updatedProfile.id === currentUserId) setAuthenticatedUser({ ...updatedProfile });
      
      setEditing(false);
      setNotice("Profile updated successfully.");
    } catch (err: any) {
      setError(err.message || "Cannot save profile.");
    } finally {
      setSaving(false);
    }
  };

  const finalAvatarUrl = profile?.avatarUrl 
    ? `${profile.avatarUrl}${profile.avatarUrl.includes("?") ? "&" : "?"}v=${avatarVersion}` 
    : undefined;

  return (
    <>
      <section className="title-section"><div className="wood-sign"><h1>PROFILE</h1></div></section>
      <main className="profile-page">
        {loading ? <ProfileMessage type="loading" message="Loading user profile..." /> :
         error ? <ProfileMessage type="error" message={error} /> :
         profile ? (
          <>
            <input
              ref={imageCropper.fileInputRef}
              type="file"
              accept={ACCEPTED_AVATAR_TYPES.join(",")}
              onChange={(e) => imageCropper.handleImageSelect(e, profile?.avatarUrl)}
              hidden
            />

            <ProfileHero
              profile={profile}
              avatarUrl={imageCropper.showEditor ? (imageCropper.previousAvatarRef.current ? `${imageCropper.previousAvatarRef.current}?v=${avatarVersion}` : undefined) : finalAvatarUrl}
              editing={editing}
              uploading={imageCropper.uploading || saving}
              onAvatarClick={imageCropper.triggerFileInput}
              onEditToggle={handleEditToggle}
              onSave={handleSave}
            />

            {(notice || imageCropper.error) && (
              <ProfileMessage type={imageCropper.error ? "error" : "info"} message={imageCropper.error || notice!} />
            )}

            <div className="profile-dashboard">
              <AccountPanel profile={profile} form={form} editing={editing} onChange={handleChange} />
              <StatisticsPanel profile={profile} />
              <AchievementsPanel />
            </div>

            <FavoriteKoiPanel />

            {imageCropper.showEditor && imageCropper.selectedImage && (
              <ImageEditor
                image={imageCropper.selectedImage}
                onCancel={imageCropper.cleanup}
                onSave={imageCropper.handleSaveCroppedImage}
              />
            )}
          </>
        ) : <ProfileMessage type="info" message="No profile data available." />}
      </main>
    </>
  );
}