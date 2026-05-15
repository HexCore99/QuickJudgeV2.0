import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import AuthCard from "../../features/auth/components/AuthCard";
import AuthHeader from "../../features/auth/components/AuthHeader";
import AuthInput from "../../features/auth/components/AuthInput";
import AuthShell from "../../features/auth/components/AuthShell";
import { resetPasswordApi } from "../../features/auth/authApi";

function ResetPasswordPage() {
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setError(null);
    setMessage(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!token) {
      return "Reset token is missing.";
    }

    if (!formData.password || !formData.confirmPassword) {
      return "Please fill in both password fields.";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      const response = await resetPasswordApi({
        token,
        password: formData.password,
      });
      setMessage(response.message);
      setFormData({
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell>
      <AuthHeader
        title="Reset Password"
        subtitle="Create a new QuickJudge password"
      />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="New Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter a new password"
            autocomplete="new-password"
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-type your new password"
            autocomplete="new-password"
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
            disabled={isLoading || Boolean(message)}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Resetting password ..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Ready to sign in?{" "}
          <Link to="/login" className="font-semibold text-slate-900">
            Go to login
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}

export default ResetPasswordPage;
