import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../../features/auth/components/AuthShell";
import AuthCard from "../../features/auth/components/AuthCard";
import AuthHeader from "../../features/auth/components/AuthHeader";
import AuthInput from "../../features/auth/components/AuthInput";

import { loginUser } from "../../features/auth/authThunks";
import { clearAuthError } from "../../features/auth/authSlice";

import {
  selectAuthError,
  selectAuthLoading,
  selectAuthRole,
  selectIsAuthenticated,
} from "../../features/auth/authSelectors";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectAuthRole);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (["admin", "super_admin"].includes(role)) {
      navigate("/admin", { replace: true });
      return;
    }
    navigate("/student/contests", { replace: true });
  }, [isAuthenticated, role, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(formData));
  }
  return (
    <div>
      <AuthShell>
        <AuthHeader
          title="Sign In"
          subtitle="Sign in to your Quickjudge account"
        />
        <AuthCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@bscse.uiu.ac.bd"
              autocomplete="email"
            />

            <AuthInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter you password"
              autocomplete="email"
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-slate-900 hover:text-slate-700"
              >
                Forgot password?
              </Link>
            </div>

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
              {isLoading ? "Signing in ..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            Don&apos;t have an account?
            <Link to="/signup" className="font-semibold text-slate-900">
              Signup
            </Link>
          </p>
        </AuthCard>
      </AuthShell>
    </div>
  );
}

export default LoginPage;
