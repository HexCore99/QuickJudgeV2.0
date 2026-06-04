import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Send } from "lucide-react";
import { cancelCreating } from "../discussionsSlice";
import {
  selectDiscussionsSaveError,
  selectDiscussionsSaving,
} from "../discussionsSelectors";
import { createDiscussionThunk } from "../discussionsThunks";

export default function CreateDiscussionForm() {
  const dispatch = useDispatch();
  const isSaving = useSelector(selectDiscussionsSaving);
  const saveError = useSelector(selectDiscussionsSaveError);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (title.trim().length > 200)
      newErrors.title = "Title must be under 200 characters";
    if (!body.trim()) newErrors.body = "Body is required";
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(createDiscussionThunk({ title: title.trim(), body: body.trim() }));
  }

  function handleCancel() {
    dispatch(cancelCreating());
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-800">
          New Discussion
        </h2>
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col gap-5 overflow-y-auto px-7 py-6"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="discussion-title"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Title
          </label>
          <input
            id="discussion-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
            }}
            placeholder="What do you want to discuss?"
            className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:ring-4 ${
              errors.title
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-amber-300 focus:ring-amber-100/70"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col">
          <label
            htmlFor="discussion-body"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Body
          </label>
          <textarea
            id="discussion-body"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (errors.body) setErrors((p) => ({ ...p, body: undefined }));
            }}
            placeholder="Share your thoughts, questions, or ideas..."
            rows={12}
            className={`min-h-[200px] flex-1 resize-none rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 transition outline-none placeholder:text-slate-400 focus:ring-4 ${
              errors.body
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-amber-300 focus:ring-amber-100/70"
            }`}
          />
          {errors.body && (
            <p className="mt-1 text-xs text-red-500">{errors.body}</p>
          )}
          {saveError && (
            <p className="mt-2 text-xs text-red-500">{saveError}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-700 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {isSaving ? "Posting..." : "Post Discussion"}
          </button>
        </div>
      </form>
    </div>
  );
}
