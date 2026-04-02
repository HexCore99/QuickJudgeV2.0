// :src/pages/public/SignupPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import AuthShell from "../../features/auth/components/AuthShell";
import AuthCard from "../../features/auth/components/AuthCard";
import AuthHeader from "../../features/auth/components/AuthHeader";
import AuthInput from "../../features/auth/components/AuthInput";
import PasswordStrengthBar from "../../features/auth/components/PasswordStrengthBar";

import { signupUser } from "../../features/auth/authThunks";
import { clearAuthError } from "../../features/auth/authSlice";
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthRole,
  selectIsAuthenticated,
} from "../../features/auth/authSelectors";

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectAuthRole);

  const [localError, setLocalError] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }

    navigate("/student/contests", { replace: true });
  }, [isAuthenticated, role, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setLocalError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      return "Please fill in all required fields.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    if (!agreed) {
      return "You must agree to the terms to create an account.";
    }
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const err = validate();
    if (err) {
      setLocalError(err);
      return;
    }

    dispatch(
      signupUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      }),
    );
  }

  const error = localError || apiError;

  return (
    <AuthShell>
      <AuthHeader title="Sign Up" subtitle="Create your Quickjudge account" />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            autocomplete="name"
          />

          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@bscse.uiu.ac.bd"
            autocomplete="email"
          />

          <div className="space-y-3">
            <AuthInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autocomplete="new-password"
            />

            <PasswordStrengthBar password={formData.password} />
          </div>

          <AuthInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-type your password"
            autocomplete="new-password"
          />

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300"
              checked={agreed}
              onChange={(e) => {
                setLocalError(null);
                setAgreed(e.target.checked);
              }}
            />
            <span className="text-sm text-slate-700">
              I agree to the{" "}
              <span className="font-semibold text-slate-900">
                Terms & Conditions
              </span>
              .
            </span>
          </label>

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
            {isLoading ? "Creating account ..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-slate-900">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}

export default SignupPage;
