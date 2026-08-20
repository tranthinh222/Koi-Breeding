import { useNavigate } from "react-router-dom";
import "./auth.css";
import { useRef, useState } from "react";
import { registerUser, uploadAvatar, login } from "../../api/auth";

type AuthMode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
}

export default function AuthModal({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
}: AuthModalProps) {
  const navigate = useNavigate();
  // ===== Register form state =====
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [loginId, setLoginId] = useState(""); // username hoặc email
  const [loginPassword, setLoginPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetRegisterForm = () => {
    setUsername("");
    setEmail("");
    setBirthday("");
    setGender("");
    setPassword("");
    setConfirmPassword("");
    handleRemoveAvatar();
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleRegister = async () => {
    try {
      setRegistering(true);
      setRegisterError(null);

      if (!username.trim()) throw new Error("Username is required");
      if (!EMAIL_REGEX.test(email.trim())) {
        throw new Error("Invalid email format");
      }
      if (!birthday) throw new Error("Birthday is required");
      if (!gender) throw new Error("Please select gender");
      if (!password) throw new Error("Password is required");
      if (password !== confirmPassword) {
        throw new Error("Password confirmation does not match");
      }

      // STEP 1: Upload avatar
      let avatarUrl = "";
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }
      console.log("Avatar URL:", avatarUrl);

      // STEP 2: Register
      const result = await registerUser({
        username,
        email,
        birthday,
        gender,
        password,
        confirmPassword,
        avatarUrl,
      } as any);
      console.log("Register success:", result);

      alert("Register successfully!");
      resetRegisterForm();
      onSwitchMode("login");
    } catch (error: any) {
      console.error("Register failed:", error);
      setRegisterError(
        error?.response?.data?.message || error?.message || "Register failed",
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoggingIn(true);
      setLoginError(null);

      if (!loginId.trim()) throw new Error("Please enter username or email");
      if (!loginPassword) throw new Error("Password is required");

      // Nếu loginId có dạng email thì gửi email, ngược lại gửi username
      const isEmail = EMAIL_REGEX.test(loginId.trim());
      const payload = isEmail
        ? { email: loginId.trim(), password: loginPassword }
        : { username: loginId.trim(), password: loginPassword };

      const result = await login(payload);

      // Lưu token — tuỳ bạn dùng localStorage hay context/state quản lý auth
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);

      onClose();
      navigate("/home");
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(
        error?.response?.data?.message || error?.message || "Login failed",
      );
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="page-shell" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="logo-row">
          <div className="logo-mark"></div>
          <div className="logo-title">
            <h1>Koi Studio</h1>
            <p>{mode === "login" ? "Welcome back!" : "Welcome"}</p>
          </div>
        </div>

        {mode === "login" ? (
          <div className="auth-layout">
            <section className="auth-panel">
              <div className="auth-section-title">Login</div>

              <div className="field-group">
                <label className="input-field">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    placeholder="Username or Email"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                  />
                </label>

                <label className="input-field">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <span className="input-icon">👁️</span>
                </label>
              </div>

              {loginError && (
                <div className="auth-error-message">{loginError}</div>
              )}

              <button
                className="primary-button"
                onClick={handleLogin}
                disabled={loggingIn}
              >
                {loggingIn ? "Logging in..." : "Login"}
              </button>

              <button className="secondary-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.35 11.1H12v2.8h5.35c-.25 1.4-1.15 2.6-2.45 3.4v2.85h3.95c2.3-2.1 3.6-5.25 3.6-8.95 0-.7-.05-1.4-.15-2.05z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 22c2.7 0 4.95-.9 6.6-2.45l-3.95-2.85c-1.1.75-2.55 1.2-4.65 1.2-3.55 0-6.55-2.4-7.63-5.65H.95v2.8C2.55 19.8 7.75 22 12 22z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.35 13.7C4.1 12.45 4.1 11.1 4.35 9.85V7.05H.95C-.35 9.35-.35 14.65.95 16.95l3.4-2.8z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.7c1.45 0 2.75.5 3.8 1.45l2.85-2.85C16.95 1.65 14.7 1 12 1 7.75 1 2.55 3.2.95 7.05l3.4 2.8C5.45 6.8 8.45 4.7 12 4.7z"
                    fill="#EA4335"
                  />
                </svg>
                Login with Google
              </button>

              <div className="link-row">
                <span>Forgot password?</span>
                <a href="#">Change password...</a>
              </div>

              <div
                className="link-row"
                style={{ justifyContent: "center", marginTop: 8 }}
              >
                <span>Don't have an account?</span>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    onSwitchMode("register");
                  }}
                >
                  Create one...
                </a>
              </div>
            </section>

            <aside className="auth-panel">
              <div className="auth-section-title">Switch account</div>
              <div className="switch-account">
                <div className="account-chip">
                  <div className="account-info">
                    <div className="avatar">P</div>
                    <div className="account-meta">
                      <strong>PHUOC67</strong>
                      <span>9 hours</span>
                    </div>
                  </div>
                </div>
                <div className="account-chip">
                  <div className="account-info">
                    <div className="avatar">D</div>
                    <div className="account-meta">
                      <strong>DoNguCaoBang</strong>
                      <span>2 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="auth-layout">
            {/* LEFT */}
            <section className="auth-panel">
              <div className="auth-section-title">Register</div>

              
              <div className="field-group">
                {/* Username */}
                <label className="input-field">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>

                {/* Email */}
                <label className="input-field">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                {/* Birthday */}
                <label className="input-field date-field">
                  <span className="input-icon">🎂</span>
                  <input
                    type="date"
                    name="birthday"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                  />
                </label>

                {/* Gender */}
                <div className="gender-wrapper">
                  <div
                    className={`input-field gender-field ${
                      genderOpen ? "gender-open" : ""
                    }`}
                    onClick={() => setGenderOpen(!genderOpen)}
                  >
                    <span className="input-icon">⚧️</span>

                    <span
                      className={gender ? "gender-value" : "gender-placeholder"}
                    >
                      {gender === "MALE"
                        ? "Male"
                        : gender === "FEMALE"
                          ? "Female"
                          : gender === "OTHER"
                            ? "Other"
                            : "Select gender"}
                    </span>

                    <span className="gender-arrow">
                      {genderOpen ? "⌃" : "⌄"}
                    </span>
                  </div>

                  {genderOpen && (
                    <div className="gender-dropdown">
                      <button
                        type="button"
                        className="gender-option"
                        onClick={() => {
                          setGender("MALE");
                          setGenderOpen(false);
                        }}
                      >
                        <span>👨</span>
                        <span>Male</span>
                      </button>

                      <button
                        type="button"
                        className="gender-option"
                        onClick={() => {
                          setGender("FEMALE");
                          setGenderOpen(false);
                        }}
                      >
                        <span>👩</span>
                        <span>Female</span>
                      </button>

                      <button
                        type="button"
                        className="gender-option"
                        onClick={() => {
                          setGender("OTHER");
                          setGenderOpen(false);
                        }}
                      >
                        <span>⚪</span>
                        <span>Other</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* RIGHT */}
            <aside className="auth-panel">
              <div className="auth-section-title">Secure password</div>

              <div className="field-group">
                {/* Password */}
                <label className="input-field">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="input-icon">👁️</span>
                </label>

                {/* Confirm password */}
                <label className="input-field">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span className="input-icon">👁️</span>
                </label>
              </div>

              {registerError && (
                <div className="auth-error-message">{registerError}</div>
              )}

              <button
                className="primary-button"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? "Registering..." : "Register"}
              </button>

              <div className="footer-note">
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSwitchMode("login");
                  }}
                >
                  Login...
                </a>
              </div>

              <div className="footer-note">
                Other options? <a href="#">Google</a>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
