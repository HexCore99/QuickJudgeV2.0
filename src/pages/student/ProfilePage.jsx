import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StudentTopTabs from "../../components/layout/StudentTopTabs";
import ProfileFooter from "../../components/common/ProfileFooter";
import ProfileHero from "../../features/profile/components/ProfileHero";

import ProfileTabs from "../../features/profile/components/ProfileTabs";
import OverviewPanel from "../../features/profile/components/OverviewPanel";
import SubmissionSlidePanel from "../../features/profile/components/SubmissionSlidePanel";
import ActivityPanel from "../../features/profile/components/ActivityPanel";
import ContestsPanel from "../../features/profile/components/ContestPanel";
import EditProfileModal from "../../features/profile/components/EditProfileModal";
import SubmissionsPanel from "../../features/profile/components/SubmissionsPanel";
import ToastContainer from "../../features/profile/components/Toast";
import {
  selectProfileAchievements,
  selectProfileActivities,
  selectProfileContests,
  selectProfileDifficulties,
  selectProfileError,
  selectProfileHasFetched,
  selectProfileLoading,
  selectProfileSubmissions,
  selectProfileUser,
} from "../../features/profile/profileSelectors";
import {
  fetchProfile,
  saveProfile,
} from "../../features/profile/profileThunks";

let toastIdCounter = 0;

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectProfileUser);
  const submissions = useSelector(selectProfileSubmissions);
  const contests = useSelector(selectProfileContests);
  const achievements = useSelector(selectProfileAchievements);
  const activities = useSelector(selectProfileActivities);
  const difficulties = useSelector(selectProfileDifficulties);
  const isLoading = useSelector(selectProfileLoading);
  const hasFetched = useSelector(selectProfileHasFetched);
  const error = useSelector(selectProfileError);

  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [slideSubmission, setSlideSubmission] = useState(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast helpers
  const toast = useCallback((msg, type = "info") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, msg, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      dispatch(fetchProfile());
    }
  }, [dispatch, hasFetched, isLoading]);

  useEffect(() => {
    if (error) {
      toast(error, "error");
    }
  }, [error, toast]);

  // Edit profile
  function handleSave(data) {
    dispatch(saveProfile(data))
      .unwrap()
      .then(() => {
        setEditOpen(false);
        toast("Profile updated successfully", "success");
      })
      .catch((message) => {
        toast(message || "Failed to update profile", "error");
      });
  }

  // Submission panel
  function openSubmission(idx) {
    if (idx >= 0 && idx < submissions.length) {
      setSlideSubmission(submissions[idx]);
      setSlideOpen(true);
    }
  }

  function closeSubmission() {
    setSlideOpen(false);
  }

  const showLoading = isLoading && !hasFetched;

  return (
    <div className="min-h-screen bg-slate-50 font-[Space_Grotesk,sans-serif] text-slate-800">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <EditProfileModal
        isOpen={editOpen}
        user={user}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />

      <SubmissionSlidePanel
        submission={slideSubmission}
        isOpen={slideOpen}
        onClose={closeSubmission}
        onToast={toast}
      />

      {/* Main content */}
      <div className="relative z-1">
        <StudentTopTabs />

        <main className="mx-auto max-w-7xl px-6 py-8">
          {showLoading || !user ? (
            <section className="rounded-2xl border border-black/7 bg-white p-6 text-sm text-slate-500 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              Loading profile...
            </section>
          ) : (
            <>
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                contestCount={contests.length}
              />

              <ProfileHero
                user={user}
                difficulties={difficulties}
                achievements={achievements}
                onEditClick={() => setEditOpen(true)}
                onShareClick={() => toast("Profile link copied", "success")}
              />

              {activeTab === "overview" && <OverviewPanel />}

              {activeTab === "submissions" && (
                <SubmissionsPanel
                  submissions={submissions}
                  allSubmissions={submissions}
                  onOpenSubmission={openSubmission}
                  onToast={toast}
                />
              )}

              {activeTab === "activity" && (
                <ActivityPanel
                  activities={activities}
                  submissions={submissions}
                  onOpenSubmission={openSubmission}
                />
              )}

              {activeTab === "contests" && (
                <ContestsPanel contests={contests} onToast={toast} />
              )}
            </>
          )}
        </main>

        <ProfileFooter />
      </div>
    </div>
  );
}
