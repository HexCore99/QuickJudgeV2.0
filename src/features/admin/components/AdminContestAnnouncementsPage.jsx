import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Bell, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { clearAnnouncements } from "../../contests/contestsSlice";
import {
  selectContestAnnouncements,
  selectContestAnnouncementsError,
  selectContestAnnouncementsLoading,
  selectContestAnnouncementsSaveError,
  selectContestAnnouncementsSaving,
} from "../../contests/contestsSelectors";
import {
  createContestAnnouncement,
  deleteContestAnnouncement,
  fetchContestAnnouncements,
  updateContestAnnouncement,
} from "../../contests/contestsThunks";

const EMPTY_FORM = { title: "", body: "" };

function formatPostedAt(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminContestAnnouncementsPage() {
  const dispatch = useDispatch();
  const { contestId } = useParams();

  const announcements = useSelector(selectContestAnnouncements);
  const isLoading = useSelector(selectContestAnnouncementsLoading);
  const error = useSelector(selectContestAnnouncementsError);
  const isSaving = useSelector(selectContestAnnouncementsSaving);
  const saveError = useSelector(selectContestAnnouncementsSaveError);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchContestAnnouncements(contestId));

    return () => {
      dispatch(clearAnnouncements());
    };
  }, [dispatch, contestId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const title = formData.title.trim();
    const body = formData.body.trim();

    if (!title || !body) return;

    const action = editingId
      ? updateContestAnnouncement({
          contestId,
          announcementId: editingId,
          title,
          body,
        })
      : createContestAnnouncement({ contestId, title, body });

    const result = await dispatch(action);

    if (
      createContestAnnouncement.fulfilled.match(result) ||
      updateContestAnnouncement.fulfilled.match(result)
    ) {
      resetForm();
    }
  }

  function startEditing(announcement) {
    setEditingId(announcement.id);
    setFormData({ title: announcement.title, body: announcement.body });
  }

  function handleDelete(announcementId) {
    const shouldDelete = window.confirm("Delete this announcement?");

    if (shouldDelete) {
      dispatch(deleteContestAnnouncement({ contestId, announcementId }));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <form
        onSubmit={handleSubmit}
        className="self-start rounded-2xl border border-slate-200 bg-white"
      >
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3.5">
          <p className="font-semibold text-slate-800">
            {editingId ? "Edit Announcement" : "New Announcement"}
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Announcement title"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />
          <textarea
            name="body"
            rows={6}
            value={formData.body}
            onChange={handleChange}
            placeholder="Announcement body"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />

          {saveError && <p className="text-xs text-red-500">{saveError}</p>}

          <div className="flex items-center justify-end gap-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <X size={14} />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={
                isSaving || !formData.title.trim() || !formData.body.trim()
              }
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingId ? <Save size={14} /> : <Plus size={14} />}
              {isSaving ? "Saving..." : editingId ? "Save Changes" : "Publish"}
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
            Loading announcements...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">
            {error}
          </div>
        ) : !announcements.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
            No announcements yet.
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="flex items-start gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Bell size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">
                    {announcement.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Posted · {formatPostedAt(announcement.postedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(announcement)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                    title="Edit announcement"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(announcement.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                    title="Delete announcement"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="px-5 py-4">
                <p className="text-sm leading-relaxed text-slate-600">
                  {announcement.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminContestAnnouncementsPage;
