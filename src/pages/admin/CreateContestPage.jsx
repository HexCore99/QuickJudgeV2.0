import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CreateContestGeneralInformation from "../../features/admin/components/CreateContestGeneralInformation";
import CreateContestProblemSelection from "../../features/admin/components/CreateContestProblemSelection";
import CreateContestSettings from "../../features/admin/components/CreateContestSettings";

const EMPTY_FORM = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  password: "",
};

export default function CreateContestPage() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);

  function handleToggleProblem(problem) {
    if (selectedProblems.find((p) => p.id === problem.id)) {
      setSelectedProblems(selectedProblems.filter((p) => p.id !== problem.id));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRatingChange(nextIsRated) {
    setIsRated(nextIsRated);

    if (nextIsRated) {
      setIsPrivate(false);
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    }
  }

  function handleAccessChange(nextIsPrivate) {
    setIsPrivate(nextIsPrivate);

    if (!nextIsPrivate) {
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <main className="relative z-[1] mx-auto max-w-7xl px-6 py-8 pb-20 text-slate-800">
        <Link
          to="/admin/contests"
          className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Contests
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create New Contest
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Configure contest details, select problems, and set access controls.
          </p>
        </div>

        <form
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          onSubmit={handleSubmit}
        >
          <div className="space-y-6 lg:col-span-2">
            <CreateContestGeneralInformation
              formData={formData}
              onChange={handleChange}
            />
            <CreateContestProblemSelection
              selectedProblems={selectedProblems}
              onToggleProblem={handleToggleProblem}
            />
          </div>

          <div className="space-y-6 lg:col-span-1">
            <CreateContestSettings
              formData={formData}
              isPrivate={isPrivate}
              isRated={isRated}
              onAccessChange={handleAccessChange}
              onChange={handleChange}
              onRatingChange={handleRatingChange}
            />

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-600 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create Contest
              </button>
              <Link
                to="/admin/dashboard"
                className="w-full rounded-xl border border-slate-200 px-6 py-3 text-center text-[14px] font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
