import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import { logout, updateAuthUser } from "../../../features/auth/authSlice";
import ContestsPanel from "../../../features/profile/components/ContestsPanel";
import OverviewPanel from "../../../features/profile/components/OverviewPanel";
import ProfileHero from "../../../features/profile/components/ProfileHero";
import ProfileTabs from "../../../features/profile/components/ProfileTabs";
import SettingsPanel from "../../../features/profile/components/SettingsPanel";
import SubmissionSlidePanel from "../../../features/profile/components/SubmissionSlidePanel";
import SubmissionsPanel from "../../../features/profile/components/SubmissionsPanel";
import ToastContainer from "../../../features/profile/components/Toast";
import { uploadProfileAvatarApi } from "../../../features/profile/profileApi";
import {
  selectProfileContests,
  selectProfileDifficulties,
  selectProfileError,
  selectProfileHasFetched,
  selectProfileLoading,
  selectProfileSaveError,
  selectProfileSaving,
  selectProfileSubmissions,
  selectProfileUser,
} from "../../../features/profile/profileSelectors";
import {
  fetchProfile,
  saveProfile,
} from "../../../features/profile/profileThunks";

const profileTabs = new Set(["overview", "submissions", "contests", "settings"]);
let toastIdCounter = 0;

function getProfileTab(searchParams) {
  const tab = searchParams.get("tab") || "overview";

  return profileTabs.has(tab) ? tab : "overview";
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector(selectProfileUser);
  const submissions = useSelector(selectProfileSubmissions);
  const contests = useSelector(selectProfileContests);
  const difficulties = useSelector(selectProfileDifficulties);
  const isLoading = useSelector(selectProfileLoading);
  const isSaving = useSelector(selectProfileSaving);
  const hasFetched = useSelector(selectProfileHasFetched);
  const profileError = useSelector(selectProfileError);
  const saveError = useSelector(selectProfileSaveError);
  const authUserId = useSelector((state) => state.auth.user?.id || null);

  const activeTab = getProfileTab(searchParams);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [slideSubmission, setSlideSubmission] = useState(null);
  const [slideOpen, setSlideOpen] = useState(false);
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

  const handleTabChange = useCallback(
    (tab) => {
      setSearchParams(tab === "overview" ? {} : { tab });
    },
    [setSearchParams],
  );

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Profile link copied", "success");
    } catch {
      toast("Failed to copy profile link", "error");
    }
  }

  async function handleSave(data) {
    try {
      const { avatarImageData, ...profilePayload } = data;
      let payload = profilePayload;

      if (avatarImageData) {
        setIsUploadingAvatar(true);
        const upload = await uploadProfileAvatarApi(avatarImageData);
        payload = { ...profilePayload, avatarUrl: upload.avatarUrl };
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
      toast("Profile updated successfully", "success");
      return true;
    } catch (error) {
      toast(error.message || error || "Failed to update profile", "error");
      return false;
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  function openSubmission(index) {
    if (index >= 0 && index < submissions.length) {
      setSlideSubmission(submissions[index]);
      setSlideOpen(true);
    }
  }

  function closeSubmission() {
    setSlideOpen(false);
  }

  function openProblem(submission) {
    const problemId = submission.problemId || submission.id;
    navigate(`/student/problems/${problemId}`);
  }

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        setSlideOpen(false);
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-[Space_Grotesk,sans-serif] text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-[15%] -left-[10%] h-[55%] w-[55%]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(194,133,10,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -right-[8%] -bottom-[20%] h-[50%] w-[50%]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(37,99,235,0.025) 0%, transparent 70%)",
          }}
        />
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <SubmissionSlidePanel
        submission={slideSubmission}
        isOpen={slideOpen}
        onClose={closeSubmission}
        onToast={toast}
      />

      <div className="relative z-[1]">
        <StudentTopTabs logoTo="/" />

        <main className="mx-auto max-w-7xl px-6 py-8">
          {isLoading && !hasFetched ? (
            <div className="mb-6 rounded-xl border border-amber-600/20 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Loading profile...
            </div>
          ) : null}

          {profileError || saveError ? (
            <div className="mb-6 rounded-xl border border-red-600/20 bg-red-50 px-4 py-3 text-sm text-red-700">
              {profileError || saveError}
            </div>
          ) : null}

          <div>
            <ProfileTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              contestCount={contests.length}
            />
          </div>

          {activeTab === "overview" ? (
            <div>
              <ProfileHero
                user={user}
                difficulties={difficulties}
                submissions={submissions}
                onEditClick={() => handleTabChange("settings")}
                onShareClick={handleShare}
              />
            </div>
          ) : null}

          <div>
            {activeTab === "overview" ? (
              <OverviewPanel submissions={submissions} />
            ) : null}

            {activeTab === "submissions" ? (
              <SubmissionsPanel
                submissions={submissions}
                allSubmissions={submissions}
                onOpenSubmission={openSubmission}
                onProblemClick={openProblem}
                onToast={toast}
                totalCount={user.totalSubmissions}
              />
            ) : null}

            {activeTab === "contests" ? (
              <ContestsPanel contests={contests} onToast={toast} />
            ) : null}

            {activeTab === "settings" ? (
              <SettingsPanel
                key={`${user.id}-${user.name}-${user.email}-${user.dept}-${user.git}-${user.bio}-${user.avatarUrl}`}
                user={user}
                isSaving={isSaving || isUploadingAvatar}
                onSave={handleSave}
                onToast={toast}
              />
            ) : null}
          </div>
        </main>

        <footer className="mt-12 border-t border-black/7 py-6">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-slate-500 md:flex-row">
            <span>QuickJudge V2.0 - Built for competitive learners</span>
            <div className="flex gap-4">
              <a href="#" className="transition-colors hover:text-slate-800">
                Documentation
              </a>
              <a href="#" className="transition-colors hover:text-slate-800">
                API
              </a>
              <a href="#" className="transition-colors hover:text-slate-800">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
