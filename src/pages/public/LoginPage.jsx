import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthShell from "../../components/auth/AuthShell";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import DemoAccess from "../../components/auth/DemoAccess";
import { Link, useNavigate } from "react-router-dom";

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
    if (role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }
    navigate("/student/contest", { replace: true });
  }, [isAuthenticated, role, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(formData));
  }
  function handleStudentDemo() {
    //:Bypassed login demo
    navigate("/student/contest");
    return;
    // dispatch(
    //   loginUser({
    //     email: "student@quickjudge.dev",
    //     password: "123456",
    //   }),
    // );
  }
  function handleAdminDemo() {
    navigate("/student/admin");

    // dispatch(
    //   loginUser({
    //     email: "admin@quickjudge.dev",
    //     password: "123456",
    //   }),
    // );
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

        <DemoAccess
          onStudentDemo={handleStudentDemo}
          onAdminDemo={handleAdminDemo}
          disabled={isLoading}
        />
      </AuthShell>
    </div>
  );
}

export default LoginPage;
