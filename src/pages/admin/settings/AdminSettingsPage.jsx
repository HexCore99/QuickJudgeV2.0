import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import AdminSettingsPanel from "../../../features/admin/components/AdminSettingsPanel";
import { getCurrentAdminNavTabs } from "../../../features/admin/adminNavTabs";
import { logout, updateAuthUser } from "../../../features/auth/authSlice";
import ToastContainer from "../../../features/profile/components/Toast";
import { uploadProfileAvatarApi } from "../../../features/profile/profileApi";
import {
  selectProfileError,
  selectProfileHasFetched,
  selectProfileLoading,
  selectProfileSaveError,
  selectProfileSaving,
  selectProfileUser,
} from "../../../features/profile/profileSelectors";
import {
  fetchProfile,
  saveProfile,
} from "../../../features/profile/profileThunks";

let toastIdCounter = 0;

export default function AdminSettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectProfileUser);
  const isLoading = useSelector(selectProfileLoading);
  const hasFetched = useSelector(selectProfileHasFetched);
  const isSaving = useSelector(selectProfileSaving);
  const profileError = useSelector(selectProfileError);
  const saveError = useSelector(selectProfileSaveError);
  const authUserId = useSelector((state) => state.auth.user?.id || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [toasts, setToasts] = useState([]);
  const hasRequestedProfileRef = useRef(false);

  useEffect(() => {
    hasRequestedProfileRef.current = false;
  }, [authUserId]);

  useEffect(() => {
    if (
      authUserId &&
      !hasFetched &&
      !isLoading &&
      !hasRequestedProfileRef.current
    ) {
      hasRequestedProfileRef.current = true;
      dispatch(fetchProfile());
    }
  }, [authUserId, dispatch, hasFetched, isLoading]);

  const toast = useCallback((msg, type = "info") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, msg, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  async function handleSave(data) {
    try {
      const { avatarImageData, ...settingsPayload } = data;
      let payload = settingsPayload;

      if (avatarImageData) {
        setIsUploadingAvatar(true);
        const upload = await uploadProfileAvatarApi(avatarImageData);
        payload = { ...settingsPayload, avatarUrl: upload.avatarUrl };
      }

      const savedProfileData = await dispatch(saveProfile(payload)).unwrap();

      if (savedProfileData.passwordChanged) {
        toast("Password changed. Please sign in again.", "success");
        dispatch(logout());
        navigate("/login", { replace: true });
        return true;
      }

      dispatch(
        updateAuthUser({
          name: savedProfileData.profile?.name,
          handle: savedProfileData.profile?.handle,
          email: savedProfileData.profile?.email,
        }),
      );
      toast("Admin settings updated successfully", "success");
      return true;
    } catch (error) {
      toast(error.message || error || "Failed to update settings", "error");
      return false;
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="relative z-[1]">
        <StudentTopTabs
          tabs={getCurrentAdminNavTabs()}
          logoTo="/"
          navExtra={<AdminMoreMenu />}
        />

        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Admin Settings
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Update your admin profile image, name, email, and password.
            </p>
          </div>

          {isLoading && !hasFetched ? (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              Loading settings...
            </div>
          ) : null}

          {profileError || saveError ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {profileError || saveError}
            </div>
          ) : null}

          <AdminSettingsPanel
            key={`${user.name}-${user.email}-${user.avatarUrl}`}
            user={user}
            isSaving={isSaving || isUploadingAvatar}
            onSave={handleSave}
            onToast={toast}
          />
        </main>
      </div>
    </div>
  );
}
