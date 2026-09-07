import { Camera, CheckCircle2, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "../../../components/shared/Toast/toast";
import { updateUserProfile, uploadUserAvatar } from "../../../api/user";
import { useAuth } from "../../../context/AuthContext";
import femaleDefaultAvatar from "../../../assets/avatars/female_blank_avatar.png";
import maleDefaultAvatar from "../../../assets/avatars/male_blank_avatar.png";

export default function AdminAccount() {
	const { currentUser, refreshCurrentUser } = useAuth();
	const fileRef = useRef<HTMLInputElement>(null);
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [form, setForm] = useState({ username: "", email: "", birthday: "", gender: "" });

	useEffect(() => {
		setForm({ username: currentUser?.username ?? "", email: currentUser?.email ?? "", birthday: currentUser?.birthday?.split("T")[0] ?? "", gender: currentUser?.gender ?? "" });
	}, [currentUser]);

	if (!currentUser) return <div className="inline-alert">Unable to load the authenticated admin account.</div>;
	const avatar = currentUser.avatarUrl ?? (currentUser.gender === "MALE" ? maleDefaultAvatar : femaleDefaultAvatar);

	const save = async (event: FormEvent) => {
		event.preventDefault(); setSaving(true);
		try {
			await updateUserProfile(currentUser.id, { username: form.username.trim(), email: form.email.trim(), birthday: form.birthday || null, gender: (form.gender || null) as "MALE" | "FEMALE" | null });
			await refreshCurrentUser(); toast.success("Admin profile updated.");
		} catch (error: any) { toast.error(error?.response?.data?.message ?? "Unable to update the profile."); }
		finally { setSaving(false); }
	};

	const upload = async (file?: File) => {
		if (!file) return;
		if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { toast.error("Choose an image smaller than 5 MB."); return; }
		setUploading(true);
		try { await uploadUserAvatar(currentUser.id, file); await refreshCurrentUser(); toast.success("Profile photo updated."); }
		catch (error: any) { toast.error(error?.response?.data?.message ?? "Unable to upload the profile photo."); }
		finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
	};

	return <div className="settings-page admin-account-view">
		<div className="page-heading"><div><p className="eyebrow">Account</p><h1>Profile and identity</h1><p>These details come from your authenticated backend account.</p></div><span className="account-security-badge"><ShieldCheck size={16} /> Protected admin</span></div>
		<div className="account-layout">
			<aside className="settings-card account-summary-card">
				<div className="account-avatar-wrap"><img src={avatar} alt={currentUser.username} /><button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} aria-label="Change profile photo"><Camera size={17} /></button><input ref={fileRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => void upload(e.target.files?.[0])} /></div>
				<h2>{currentUser.username}</h2><p>{currentUser.email}</p><span className="account-role-pill"><CheckCircle2 size={14} />{currentUser.role?.replace("_", " ")}</span>
				<div className="account-meta"><span><UserCircle2 size={16} />User ID</span><strong>#{currentUser.id}</strong><span><Mail size={16} />Member since</span><strong>{new Date(currentUser.createdAt).toLocaleDateString("en-GB")}</strong></div>
			</aside>
			<form className="settings-card account-form-card" onSubmit={save}>
				<div className="settings-header"><div><p className="eyebrow">Profile details</p><h2>Edit account information</h2></div><UserCircle2 size={19} /></div>
				<div className="account-form-grid"><label><span>Username</span><input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label><label><span>Email address</span><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label><span>Birthday</span><input type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} /></label><label><span>Gender</span><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="">Not specified</option><option value="MALE">Male</option><option value="FEMALE">Female</option></select></label></div>
				<div className="account-form-actions"><button type="button" className="action-button neutral" onClick={() => setForm({ username: currentUser.username, email: currentUser.email, birthday: currentUser.birthday?.split("T")[0] ?? "", gender: currentUser.gender ?? "" })}>Reset</button><button className="primary-button" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button></div>
			</form>
		</div>
	</div>;
}
