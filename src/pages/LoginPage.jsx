import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearError();

    const result = await login(email.trim(), password);

    if (result.success) {
      navigate("/", { replace: true });
    }
  };

  const inputWrapClass =
    "flex items-center gap-2.5 rounded-xl border border-line-strong bg-surface px-3.5 py-3 transition focus-within:border-primary/55 focus-within:ring-4 focus-within:ring-primary/10";

  const inputClass =
    "w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-muted/70";

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
            Welcome back
          </h1>

          <p className="mt-2 text-[13px] text-muted">
            Sign in to your CollabBoard account
          </p>
        </div>

        <div className="rounded-[22px] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(16,24,40,0.02)] sm:p-8">
          {error && (
            <div className="mb-5 rounded-xl bg-high/8 px-4 py-3 text-[12px] font-medium text-high ring-1 ring-inset ring-high/15">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-muted"
              >
                Email address
              </label>

              <div className={inputWrapClass}>
                <EnvelopeIcon className="h-4 w-4 shrink-0 text-muted" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-muted"
              >
                Password
              </label>

              <div className={inputWrapClass}>
                <LockClosedIcon className="h-4 w-4 shrink-0 text-muted" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  placeholder="••••••••"
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
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[13px] text-muted">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary transition hover:text-primary-hover"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
