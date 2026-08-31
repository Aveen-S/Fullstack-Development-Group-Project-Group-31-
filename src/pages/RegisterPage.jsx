import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  Squares2X2Icon,
  UserIcon,
} from "@heroicons/react/24/outline";
import useAuthStore from "../store/authStore";

function RegisterPage() {
  const navigate = useNavigate();

  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearError();
    setLocalError("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setLocalError("Name must be at least 2 characters long.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const result = await register(trimmedName, email.trim(), password);

    if (result.success) {
      navigate("/login", {
        replace: true,
        state: {
          registered: true,
          message: result.message,
        },
      });
    }
  };

  const inputWrapClass =
    "flex items-center gap-2.5 rounded-xl border border-line-strong bg-surface px-3.5 py-3 transition focus-within:border-primary/55 focus-within:ring-4 focus-within:ring-primary/10";

  const inputClass =
    "w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-muted/70";

  const labelClass =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-muted";

  const displayError = localError || error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-5 flex justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_8px_24px_rgba(99,91,255,0.24)]">
              <Squares2X2Icon className="h-6 w-6" strokeWidth={2} />
            </span>
          </div>

          <h1 className="font-display text-[28px] font-extrabold tracking-[-0.035em] text-ink">
            Create your account
          </h1>

          <p className="mt-2 text-[13px] text-muted">
            Join CollabBoard and start collaborating
          </p>
        </div>

        <div className="rounded-[22px] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(16,24,40,0.02)] sm:p-8">
          {displayError && (
            <div className="mb-5 rounded-xl bg-high/8 px-4 py-3 text-[12px] font-medium text-high ring-1 ring-inset ring-high/15">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="reg-name" className={labelClass}>
                Full name
              </label>

              <div className={inputWrapClass}>
                <UserIcon className="h-4 w-4 shrink-0 text-muted" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className={labelClass}>
                Email address
              </label>

              <div className={inputWrapClass}>
                <EnvelopeIcon className="h-4 w-4 shrink-0 text-muted" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className={labelClass}>
                Password
              </label>

              <div className={inputWrapClass}>
                <LockClosedIcon className="h-4 w-4 shrink-0 text-muted" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />

                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="shrink-0 text-muted transition hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg-confirm" className={labelClass}>
                Confirm password
              </label>

              <div className={inputWrapClass}>
                <LockClosedIcon className="h-4 w-4 shrink-0 text-muted" />
                <input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(99,91,255,0.22)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-75"
                    />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[13px] text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary transition hover:text-primary-hover"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
