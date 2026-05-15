import { useState } from "react";
import { Link } from "react-router-dom";

import AuthCard from "../../features/auth/components/AuthCard";
import AuthHeader from "../../features/auth/components/AuthHeader";
import AuthInput from "../../features/auth/components/AuthInput";
import AuthShell from "../../features/auth/components/AuthShell";
import { forgotPasswordApi } from "../../features/auth/authApi";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      setIsLoading(true);
      const response = await forgotPasswordApi({ email: email.trim() });
      setMessage(response.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell>
      <AuthHeader
        title="Forgot Password"
        subtitle="Request a password reset link"
      />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
              setMessage(null);
            }}
            placeholder="you@example.com"
            autocomplete="email"
          />

          {message ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Sending reset link ..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold text-slate-900">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}

export default ForgotPasswordPage;
