import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  forgotPassword,
  Login,
  registerUser,
  resetPassword,
  verifyResetCode,
} from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import "./auth.css";

type AuthMode = "login" | "register";
type ViewMode = AuthMode | "forgot";
type ForgotStep = "email" | "code" | "reset";

interface AuthModalProps {
  isOpen: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RULES = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "At least 1 UPPERCASE character",
    test: (value: string) => /[A-Z]/.test(value),
  },
  { label: "At least 1 number", test: (value: string) => /\d/.test(value) },
  {
    label: "At least 1 special character",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

function isPasswordStrong(value: string) {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}

function PasswordChecklist({ value }: { value: string }) {
  if (!value) return null;

  return (
    <div className="password-checklist-wrapper">
      <div className="password-checklist-title">Password must contain:</div>
      <ul className="password-checklist">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(value);

          return (
            <li key={rule.label} className={passed ? "valid" : "invalid"}>
              {passed ? "✓" : "•"} {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function AuthModal({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
}: AuthModalProps) {
  const navigate = useNavigate();
  const { refreshCurrentUser } = useAuth();
  const [view, setView] = useState<ViewMode>(mode);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Login state
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
    useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setView(mode);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const resetForgotFlow = () => {
    setForgotStep("email");
    setForgotEmail("");
    setForgotCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setForgotError(null);
  };

  const switchView = (
    nextView: ViewMode,
    options?: { preserveNotice?: boolean },
  ) => {
    setView(nextView);
    if (!options?.preserveNotice) {
      setAuthNotice(null);
    }
    setLoginError(null);
    setRegisterError(null);

    if (nextView === "login" || nextView === "register") {
      onSwitchMode(nextView);
    }

    if (nextView !== "forgot") {
      resetForgotFlow();
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      setRegisterError(null);
      setAuthNotice(null);

      if (!username.trim()) throw new Error("Username is required");
      if (!EMAIL_REGEX.test(email.trim())) {
        throw new Error("Invalid email format");
      }
      if (!birthday) throw new Error("Birthday is required");
      if (!gender) throw new Error("Please select gender");
      if (!password) throw new Error("Password is required");
      if (!isPasswordStrong(password)) {
        throw new Error(
          "Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character",
        );
      }
      if (password !== confirmPassword) {
        throw new Error("Password confirmation does not match");
      }

      await registerUser({
        username,
        email,
        birthday,
        gender,
        password,
        confirmPassword,
        avatarUrl: "",
      } as any);

      setAuthNotice("Register successfully!");
      setUsername("");
      setEmail("");
      setBirthday("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
      setShowRegisterPassword(false);
      setShowRegisterConfirmPassword(false);
      switchView("login", { preserveNotice: true });
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
      setAuthNotice(null);

      if (!loginId.trim()) throw new Error("Please enter username or email");
      if (!loginPassword) throw new Error("Password is required");

      const isEmail = EMAIL_REGEX.test(loginId.trim());
      const payload = isEmail
        ? { email: loginId.trim(), password: loginPassword }
        : { username: loginId.trim(), password: loginPassword };

      const result = await Login(payload);

      sessionStorage.setItem("userToken", result.userToken);
      sessionStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("accessToken", result.userToken);
      localStorage.setItem("refreshToken", result.refreshToken);

      await refreshCurrentUser();

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

  const handleForgotSendCode = async () => {
    try {
      setForgotLoading(true);
      setForgotError(null);
      setAuthNotice(null);

      if (!EMAIL_REGEX.test(forgotEmail.trim())) {
        throw new Error("Invalid email format");
      }

      await forgotPassword({ email: forgotEmail.trim() });
      setAuthNotice("Verification code sent to your email. Enter code below. ");
      setForgotStep("code");
      setForgotCode("");
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      setForgotError(
        error?.response?.data?.message || error?.message || "Send code failed",
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setForgotLoading(true);
      setForgotError(null);
      setAuthNotice(null);

      if (!forgotCode.trim()) throw new Error("Verification code is required");

      await verifyResetCode({
        email: forgotEmail.trim(),
        code: forgotCode.trim(),
      });

      setAuthNotice("Valid verification code. Enter your new password.");
      setForgotStep("reset");
    } catch (error: any) {
      console.error("Verify reset code failed:", error);
      setForgotError(
        error?.response?.data?.message ||
          error?.message ||
          "Verification failed",
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setForgotLoading(true);
      setForgotError(null);
      setAuthNotice(null);

      if (!newPassword) throw new Error("Password is required");
      if (!isPasswordStrong(newPassword)) {
        throw new Error(
          "Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character",
        );
      }
      if (newPassword !== confirmNewPassword) {
        throw new Error("Password confirmation does not match");
      }

      await resetPassword({
        email: forgotEmail.trim(),
        code: forgotCode.trim(),
        newPassword,
        confirmPassword: confirmNewPassword,
      });

      setAuthNotice("Your password changed. You can continue login");
      setLoginId(forgotEmail.trim());
      setLoginPassword("");
      switchView("login", { preserveNotice: true });
    } catch (error: any) {
      console.error("Reset password failed:", error);
      setForgotError(
        error?.response?.data?.message || error?.message || "Reset failed",
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const renderAuthNotice = () =>
    authNotice ? (
      <div className="auth-success-message">{authNotice}</div>
    ) : null;

  const renderLoginView = () => (
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
              type={showLoginPassword ? "text" : "password"}
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              aria-label={showLoginPassword ? "Hide password" : "Show password"}
              onClick={() => setShowLoginPassword((prev) => !prev)}
            >
              {showLoginPassword ? "🙈" : "👁️"}
            </button>
          </label>
        </div>

        {renderAuthNotice()}

        {loginError && <div className="auth-error-message">{loginError}</div>}

        <button
          className="primary-button"
          onClick={handleLogin}
          disabled={loggingIn}
        >
          {loggingIn ? "Logging in..." : "Login"}
        </button>

        <button className="secondary-button" type="button">
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
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setAuthNotice(null);
              resetForgotFlow();
              switchView("forgot");
            }}
          >
            Change password...
          </a>
        </div>

        <div
          className="link-row"
          style={{ justifyContent: "center", marginTop: 8 }}
        >
          <span>Don't have an account?</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchView("register");
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
  );

  const renderRegisterView = () => (
    <div className="auth-layout">
      <section className="auth-panel">
        <div className="auth-section-title">Register</div>

        <div className="field-group">
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

          <div className="gender-wrapper">
            <div
              className={`input-field gender-field ${genderOpen ? "gender-open" : ""}`}
              onClick={() => setGenderOpen(!genderOpen)}
            >
              <span className="input-icon">⚧️</span>
              <span className={gender ? "gender-value" : "gender-placeholder"}>
                {gender === "MALE"
                  ? "Male"
                  : gender === "FEMALE"
                    ? "Female"
                    : "Select gender"}
              </span>
              <span className="gender-arrow">{genderOpen ? "⌃" : "⌄"}</span>
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
              </div>
            )}
          </div>
        </div>
      </section>

      <aside className="auth-panel">
        <div className="auth-section-title">Secure password</div>

        <div className="field-group">
          <label className="input-field">
            <span className="input-icon">🔒</span>
            <input
              type={showRegisterPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              aria-label={
                showRegisterPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowRegisterPassword((prev) => !prev)}
            >
              {showRegisterPassword ? "🙈" : "👁️"}
            </button>
          </label>

          <PasswordChecklist value={password} />

          <label className="input-field">
            <span className="input-icon">🔒</span>
            <input
              type={showRegisterPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              aria-label={
                showRegisterPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              onClick={() => setShowRegisterPassword((prev) => !prev)}
            >
              {showRegisterPassword ? "🙈" : "👁️"}
            </button>
          </label>
        </div>

        {renderAuthNotice()}

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
              switchView("login");
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
  );

  const renderForgotView = () => (
    <div className="auth-forgot-layout">
      <section className="auth-panel auth-panel--forgot">
        <div className="auth-section-title">Forgot password</div>
        <p className="auth-helper-text">
          Enter your email, verify the code, then set a new password.
        </p>

        {renderAuthNotice()}

        {forgotError && <div className="auth-error-message">{forgotError}</div>}

        {forgotStep === "email" && (
          <div className="field-group">
            <label className="input-field">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                placeholder="Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </label>

            <button
              className="primary-button"
              onClick={handleForgotSendCode}
              disabled={forgotLoading}
            >
              {forgotLoading ? "Sending..." : "Send verification code"}
            </button>
          </div>
        )}

        {forgotStep === "code" && (
          <div className="field-group">
            <div></div>
            <label className="input-field">
              <span className="input-icon">🔢</span>
              <input
                type="text"
                placeholder="Enter verification code"
                value={forgotCode}
                onChange={(e) => setForgotCode(e.target.value)}
              />
            </label>

            <button
              className="primary-button"
              onClick={handleVerifyCode}
              disabled={forgotLoading}
            >
              {forgotLoading ? "Verifying..." : "Verify code"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleForgotSendCode}
              disabled={forgotLoading}
            >
              Resend code
            </button>
          </div>
        )}

        {forgotStep === "reset" && (
          <div className="field-group">
            <label className="input-field">
              <span className="input-icon">🔒</span>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? "🙈" : "👁️"}
              </button>
            </label>

            <PasswordChecklist value={newPassword} />

            <label className="input-field">
              <span className="input-icon">🔒</span>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                aria-label={
                  showNewPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? "🙈" : "👁️"}
              </button>
            </label>

            <button
              className="primary-button"
              onClick={handleResetPassword}
              disabled={forgotLoading}
            >
              {forgotLoading ? "Updating..." : "Update password"}
            </button>
          </div>
        )}

        <div className="footer-note">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchView("login");
            }}
          >
            Back to login
          </a>
        </div>
      </section>
    </div>
  );

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
            <p>
              {view === "login"
                ? "Welcome back!"
                : view === "register"
                  ? "Welcome"
                  : "Reset your password"}
            </p>
          </div>
        </div>

        {view === "login"
          ? renderLoginView()
          : view === "register"
            ? renderRegisterView()
            : renderForgotView()}
      </div>
    </div>
  );
}
