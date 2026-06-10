import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Globe,
  Lock,
  Plus,
  Search,
  Shield,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import AdminMoreMenu from "../../../components/common/AdminMoreMenu";
import StudentTopTabs from "../../../components/layout/StudentTopTabs";
import { getCurrentAdminNavTabs } from "../../../features/admin/adminNavTabs";
import TimePickerField from "../../../features/admin/components/TimePickerField";
import {
  selectContestsError,
  selectContestsLoading,
  selectLiveContests,
  selectPastContests,
  selectUpcomingContests,
} from "../../../features/contests/contestsSelectors";
import {
  createContestThunk,
  fetchContests,
  updateContestScheduleThunk,
} from "../../../features/contests/contestsThunks";
import {
  getMyProblemsApi,
  getProblemBankApi,
  getProblemCloneSourceApi,
} from "../../../features/problems/problemsApi";

const EMPTY_FORM = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
  password: "",
};

const EMPTY_CONTEST_TEST_CASE = { input: "", output: "", isHidden: false };
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

function pad(value) {
  return String(value).padStart(2, "0");
}

function toDateTimeInputValue(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getCurrentDateTimeInputValue() {
  const date = new Date();
  date.setSeconds(0, 0);

  return toDateTimeInputValue(date);
}

function addMinutesToDateTimeInputValue(value, minutes) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  date.setMinutes(date.getMinutes() + minutes);

  return toDateTimeInputValue(date);
}

function isDateTimeBefore(value, minimumValue) {
  const date = new Date(value);
  const minimumDate = new Date(minimumValue);

  if (Number.isNaN(date.getTime()) || Number.isNaN(minimumDate.getTime())) {
    return false;
  }

  return date < minimumDate;
}

function getLaterDateTimeInputValue(firstValue, secondValue) {
  if (!firstValue) return secondValue || "";
  if (!secondValue) return firstValue;

  return isDateTimeBefore(firstValue, secondValue) ? secondValue : firstValue;
}

function getMinimumEndTime(startTime, minimumStartTime) {
  const nextMinuteAfterStart = startTime
    ? addMinutesToDateTimeInputValue(startTime, 1)
    : "";

  return getLaterDateTimeInputValue(minimumStartTime, nextMinuteAfterStart);
}

function clampDateTimeToMinimum(value, minimumValue) {
  if (!value || !minimumValue) return value;

  return isDateTimeBefore(value, minimumValue) ? minimumValue : value;
}

function getMinimumTimeForDate(selectedDate, minimumDateTime) {
  const minimumParts = splitDateTimeInputValue(minimumDateTime);

  return selectedDate && selectedDate === minimumParts.date
    ? minimumParts.time
    : "";
}

function buildDefaultCreateForm() {
  const startTime = getCurrentDateTimeInputValue();

  return {
    ...EMPTY_FORM,
    startTime,
    endTime: addMinutesToDateTimeInputValue(startTime, 60),
  };
}

function splitDateTimeInputValue(value) {
  if (!value) {
    return { date: "", time: "" };
  }

  const [date = "", time = ""] = value.split("T");

  return {
    date,
    time: time.slice(0, 5),
  };
}

function composeDateTimeInputValue(date, time) {
  if (!date && !time) return "";

  return `${date}T${time}`;
}

function formatDurationPreview(startTime, endTime) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "";
  }

  const totalMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (60 * 1000),
  );

  if (totalMinutes <= 0) return "End time must be after start time";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

function buildContestOptions(live, upcoming, past) {
  return [
    ...live.map((contest) => ({ ...contest, isEnded: false })),
    ...upcoming.map((contest) => ({ ...contest, isEnded: false })),
    ...past.map((contest) => ({ ...contest, isEnded: true })),
  ].map((contest) => ({
    id: contest.id,
    title: contest.name,
    description: contest.desc || "",
    startTime: contest.startTime,
    endTime: contest.endTime,
    requiresPassword: Boolean(contest.requiresPassword),
    isRated: Boolean(contest.rated ?? contest.isRated),
    isEnded: contest.isEnded,
  }));
}

function normalizeProblemSource(problem, sourceLabel) {
  return {
    ...problem,
    sourceLabel,
    sourceKey: `${sourceLabel}-${problem.id}`,
  };
}

function buildContestProblemDraft(problem) {
  return {
    sourceProblemId: problem.id,
    title: problem.title || "",
    statement: problem.statement || problem.description || "",
    inputFormat: problem.inputFormat || "",
    outputFormat: problem.outputFormat || "",
    constraints: Array.isArray(problem.constraints)
      ? problem.constraints.join("\n")
      : problem.constraints || "",
    difficulty: problem.difficulty || "Medium",
    points: Number(problem.points) || 100,
    timeLimitSeconds: Number(problem.timeLimitSeconds) || 1,
    memoryLimitMb: Number(problem.memoryLimitMb) || 256,
    tags: problem.tags || [],
    testCases: problem.testCases?.length
      ? problem.testCases.map((testCase, index) => ({
          input: testCase.input || "",
          output: testCase.output || "",
          isHidden: Boolean(testCase.isHidden),
          sortOrder: index,
        }))
      : [EMPTY_CONTEST_TEST_CASE],
    sourceTitle: problem.title || "Problem",
    sourceLabel: problem.sourceLabel || "Source",
  };
}

function buildContestProblemPayload(problem) {
  return {
    sourceProblemId: problem.sourceProblemId,
    title: problem.title.trim(),
    statement: problem.statement.trim(),
    inputFormat: problem.inputFormat.trim(),
    outputFormat: problem.outputFormat.trim(),
    constraints: problem.constraints.trim(),
    difficulty: problem.difficulty,
    points: Number(problem.points),
    timeLimitSeconds: Number(problem.timeLimitSeconds),
    memoryLimitMb: Number(problem.memoryLimitMb),
    tags: problem.tags,
    testCases: problem.testCases
      .map((testCase, index) => ({
        input: testCase.input,
        output: testCase.output,
        isHidden: testCase.isHidden,
        sortOrder: index,
      }))
      .filter((testCase) => testCase.input.trim() || testCase.output.trim()),
  };
}

export default function CreateContestPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contestId } = useParams();
  const isEditMode = Boolean(contestId);

  const live = useSelector(selectLiveContests);
  const upcoming = useSelector(selectUpcomingContests);
  const past = useSelector(selectPastContests);
  const isLoading = useSelector(selectContestsLoading);
  const loadError = useSelector(selectContestsError);

  const [isPrivate, setIsPrivate] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [availableProblems, setAvailableProblems] = useState([]);
  const [isProblemLoading, setIsProblemLoading] = useState(false);
  const [problemLoadError, setProblemLoadError] = useState(null);
  const [cloningProblemId, setCloningProblemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formDraft, setFormDraft] = useState({
    key: null,
    values: {},
  });
  const [createFormDefaults] = useState(() => buildDefaultCreateForm());
  const [minimumStartTime, setMinimumStartTime] = useState(() =>
    getCurrentDateTimeInputValue(),
  );
  const [actionError, setActionError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setMinimumStartTime(getCurrentDateTimeInputValue());
    }, 30 * 1000);

    return () => window.clearInterval(timerId);
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchContests());
    }
  }, [dispatch, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      return undefined;
    }

    let isCancelled = false;

    async function loadProblems() {
      setIsProblemLoading(true);
      setProblemLoadError(null);

      try {
        const [ownedProblems, publishedProblems] = await Promise.all([
          getMyProblemsApi(),
          getProblemBankApi(),
        ]);
        const sourceMap = new Map();

        ownedProblems.forEach((problem) => {
          sourceMap.set(
            String(problem.id),
            normalizeProblemSource(problem, "Your problem"),
          );
        });

        publishedProblems.forEach((problem) => {
          if (!sourceMap.has(String(problem.id))) {
            sourceMap.set(
              String(problem.id),
              normalizeProblemSource(problem, "Published bank"),
            );
          }
        });

        if (!isCancelled) {
          setAvailableProblems([...sourceMap.values()]);
        }
      } catch (error) {
        if (!isCancelled) {
          setProblemLoadError(error.message || "Failed to load problems.");
        }
      } finally {
        if (!isCancelled) {
          setIsProblemLoading(false);
        }
      }
    }

    loadProblems();

    return () => {
      isCancelled = true;
    };
  }, [isEditMode]);

  const contests = useMemo(
    () => buildContestOptions(live, upcoming, past),
    [live, upcoming, past],
  );

  const editingContest = contests.find((contest) => contest.id === contestId);
  const formKey = contestId || "create";
  const baseFormData =
    isEditMode && editingContest
      ? {
          title: editingContest.title,
          description: editingContest.description,
          startTime: toDateTimeInputValue(editingContest.startTime),
          endTime: toDateTimeInputValue(editingContest.endTime),
          password: "",
        }
      : createFormDefaults;
  const draftValues = formDraft.key === formKey ? formDraft.values : {};
  const formData = { ...baseFormData, ...draftValues };
  const displayedIsRated = isEditMode
    ? Boolean(editingContest?.isRated)
    : isRated;
  const displayedIsPrivate = isEditMode
    ? Boolean(editingContest?.requiresPassword) && !displayedIsRated
    : isPrivate && !displayedIsRated;
  const isEndedContest = Boolean(editingContest?.isEnded);

  async function handleToggleProblem(problem) {
    if (isEditMode) return;

    if (
      selectedProblems.find(
        (selected) => Number(selected.sourceProblemId) === Number(problem.id),
      )
    ) {
      setSelectedProblems(
        selectedProblems.filter(
          (selected) => Number(selected.sourceProblemId) !== Number(problem.id),
        ),
      );
      return;
    }

    setCloningProblemId(problem.id);
    setActionError(null);

    try {
      const cloneSource = await getProblemCloneSourceApi(problem.id);
      setSelectedProblems((current) => [
        ...current,
        buildContestProblemDraft({
          ...cloneSource,
          sourceLabel: problem.sourceLabel,
        }),
      ]);
    } catch (error) {
      setActionError(error.message || "Failed to clone problem.");
    } finally {
      setCloningProblemId(null);
    }
  }

  function handleContestProblemChange(sourceProblemId, field, value) {
    setSelectedProblems((current) =>
      current.map((problem) =>
        Number(problem.sourceProblemId) === Number(sourceProblemId)
          ? { ...problem, [field]: value }
          : problem,
      ),
    );
  }

  function handleContestProblemTagChange(sourceProblemId, value) {
    handleContestProblemChange(
      sourceProblemId,
      "tags",
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    );
  }

  function handleContestTestCaseChange(sourceProblemId, index, field, value) {
    setSelectedProblems((current) =>
      current.map((problem) => {
        if (Number(problem.sourceProblemId) !== Number(sourceProblemId)) {
          return problem;
        }

        return {
          ...problem,
          testCases: problem.testCases.map((testCase, testCaseIndex) =>
            testCaseIndex === index
              ? { ...testCase, [field]: value }
              : testCase,
          ),
        };
      }),
    );
  }

  function handleAddContestTestCase(sourceProblemId) {
    setSelectedProblems((current) =>
      current.map((problem) =>
        Number(problem.sourceProblemId) === Number(sourceProblemId)
          ? {
              ...problem,
              testCases: [...problem.testCases, EMPTY_CONTEST_TEST_CASE],
            }
          : problem,
      ),
    );
  }

  function handleRemoveContestTestCase(sourceProblemId, index) {
    setSelectedProblems((current) =>
      current.map((problem) =>
        Number(problem.sourceProblemId) === Number(sourceProblemId)
          ? {
              ...problem,
              testCases: problem.testCases.filter(
                (_, testCaseIndex) => testCaseIndex !== index,
              ),
            }
          : problem,
      ),
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormDraft((prev) => ({
      key: formKey,
      values: {
        ...(prev.key === formKey ? prev.values : {}),
        [name]: value,
      },
    }));
  }

  function handleSchedulePartChange(fieldName, partName, value) {
    const currentValue = fieldName === "startTime" ? formData.startTime : formData.endTime;
    const currentParts = splitDateTimeInputValue(currentValue);
    const nextParts = {
      ...currentParts,
      [partName]: value,
    };
    const currentMinimumStartTime = getCurrentDateTimeInputValue();
    let nextValue = composeDateTimeInputValue(nextParts.date, nextParts.time);
    const adjustedValues = {};

    if (!isEditMode) {
      if (fieldName === "startTime") {
        nextValue = clampDateTimeToMinimum(nextValue, currentMinimumStartTime);
        adjustedValues.startTime = nextValue;

        const minimumEndTime = getMinimumEndTime(
          nextValue,
          currentMinimumStartTime,
        );

        if (
          formData.endTime &&
          isDateTimeBefore(formData.endTime, minimumEndTime)
        ) {
          adjustedValues.endTime = minimumEndTime;
        }
      } else {
        nextValue = clampDateTimeToMinimum(
          nextValue,
          getMinimumEndTime(formData.startTime, currentMinimumStartTime),
        );
        adjustedValues.endTime = nextValue;
      }
    } else {
      adjustedValues[fieldName] = nextValue;
    }

    setFormDraft((prev) => ({
      key: formKey,
      values: {
        ...(prev.key === formKey ? prev.values : {}),
        ...adjustedValues,
      },
    }));
  }

  function handleRatingChange(nextIsRated) {
    if (isEditMode) return;

    setIsRated(nextIsRated);

    if (nextIsRated) {
      setIsPrivate(false);
      setFormDraft((prev) => ({
        key: formKey,
        values: {
          ...(prev.key === formKey ? prev.values : {}),
          password: "",
        },
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isEditMode && isEndedContest) {
      setActionError("Ended contests cannot be edited.");
      return;
    }

    if (
      !isEditMode &&
      formData.startTime &&
      isDateTimeBefore(formData.startTime, minimumStartTime)
    ) {
      setActionError("Start time cannot be before the current time.");
      return;
    }

    if (!formData.startTime || !formData.endTime || !canSaveSchedule) {
      setActionError("Start time and end time must be valid.");
      return;
    }

    if (!isEditMode) {
      if (!formData.title.trim()) {
        setActionError("Contest title is required.");
        return;
      }

      if (!selectedProblems.length) {
        setActionError("Select at least one problem.");
        return;
      }

      const hasInvalidProblemCopy = selectedProblems.some(
        (problem) =>
          !problem.title.trim() ||
          !problem.statement.trim() ||
          !problem.testCases.some(
            (testCase) =>
              testCase.input.trim() || testCase.output.trim(),
          ),
      );

      if (hasInvalidProblemCopy) {
        setActionError(
          "Every contest copy needs a title, statement, and at least one test case.",
        );
        return;
      }

      if (displayedIsPrivate && !formData.password.trim()) {
        setActionError("Contest password is required for private contests.");
        return;
      }
    }

    setIsSaving(true);
    setActionError(null);

    const result = isEditMode
      ? await dispatch(
          updateContestScheduleThunk({
            contestId,
            startTime: formData.startTime,
            endTime: formData.endTime,
          }),
        )
      : await dispatch(
          createContestThunk({
            title: formData.title,
            description: formData.description,
            startTime: formData.startTime,
            endTime: formData.endTime,
            isRated,
            requiresPassword: displayedIsPrivate,
            password: displayedIsPrivate ? formData.password : "",
            problems: selectedProblems.map(buildContestProblemPayload),
          }),
        );

    setIsSaving(false);

    if (
      updateContestScheduleThunk.fulfilled.match(result) ||
      createContestThunk.fulfilled.match(result)
    ) {
      navigate("/admin/contests");
      return;
    }

    setActionError(
      result.payload ||
        (isEditMode
          ? "Failed to update contest time."
          : "Failed to create contest."),
    );
  }

  const filteredProblems = availableProblems.filter((problem) => {
    const searchValue = searchQuery.toLowerCase();
    const tags = problem.tags || [];

    return (
      problem.title.toLowerCase().includes(searchValue) ||
      tags.some((tag) => tag.toLowerCase().includes(searchValue))
    );
  });

  const durationPreview = formatDurationPreview(
    formData.startTime,
    formData.endTime,
  );
  const startTimeParts = splitDateTimeInputValue(formData.startTime);
  const endTimeParts = splitDateTimeInputValue(formData.endTime);
  const minimumStartParts = splitDateTimeInputValue(minimumStartTime);
  const minimumEndTime = getMinimumEndTime(formData.startTime, minimumStartTime);
  const minimumEndParts = splitDateTimeInputValue(minimumEndTime);
  const startTimeMinValue = !isEditMode
    ? getMinimumTimeForDate(startTimeParts.date, minimumStartTime)
    : "";
  const endTimeMinValue = !isEditMode
    ? getMinimumTimeForDate(endTimeParts.date, minimumEndTime)
    : "";
  const isStartTimeInPast =
    !isEditMode && isDateTimeBefore(formData.startTime, minimumStartTime);
  const canSaveSchedule =
    formData.startTime &&
    formData.endTime &&
    !isStartTimeInPast &&
    new Date(formData.endTime) > new Date(formData.startTime);
  const canCreateContest =
    formData.title.trim() &&
    canSaveSchedule &&
    selectedProblems.length > 0 &&
    (!displayedIsPrivate || formData.password.trim());
  const isSubmitDisabled =
    isSaving ||
    Boolean(cloningProblemId) ||
    (isEditMode && isEndedContest) ||
    (isEditMode ? !canSaveSchedule : !canCreateContest);

  const inputClasses =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10";
  const lockedClasses = isEditMode ? "bg-slate-50 text-slate-500" : "";
  const scheduleLockedClasses = isEndedContest
    ? "bg-slate-50 text-slate-500"
    : "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-[1]">
        <StudentTopTabs
          tabs={getCurrentAdminNavTabs({ end: true })}
          logoTo="/"
          navExtra={<AdminMoreMenu excludeAction="contest" />}
        />

        <main className="mx-auto max-w-7xl px-6 py-8 pb-20">
          <Link
            to="/admin/contests"
            className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contests
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {isEditMode ? "Edit Contest" : "Create New Contest"}
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              {isEditMode
                ? "Update the contest schedule."
                : "Configure contest details, select problems, and set access controls."}
            </p>
          </div>

          {isEditMode && isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
              Loading contest...
            </div>
          ) : isEditMode && loadError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-600">
              {loadError}
            </div>
          ) : isEditMode && !editingContest ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
              Contest not found.
            </div>
          ) : (
            <form
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
              onSubmit={handleSubmit}
            >
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
                    General Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Contest Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        readOnly={isEditMode}
                        placeholder="e.g. Weekly Algo Sprint #15"
                        className={`${inputClasses} ${lockedClasses}`}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Description
                      </label>
                      <textarea
                        rows={6}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        readOnly={isEditMode}
                        placeholder="Describe the contest rules..."
                        className={`resize-none ${inputClasses} ${lockedClasses}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-[15px] font-semibold text-slate-800">
                      Select Problems
                    </h2>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                      {selectedProblems.length} Selected
                    </span>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search problems by name or tag..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={isEditMode}
                      className={`${inputClasses} pl-10 ${lockedClasses}`}
                    />
                  </div>

                  <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-100">
                    {isProblemLoading && (
                      <div className="p-6 text-center text-sm text-slate-400">
                        Loading problems...
                      </div>
                    )}

                    {!isProblemLoading && problemLoadError && (
                      <div className="p-6 text-center text-sm text-red-500">
                        {problemLoadError}
                      </div>
                    )}

                    {!isProblemLoading &&
                      !problemLoadError &&
                      filteredProblems.map((problem) => {
                        const isSelected = selectedProblems.some(
                          (selected) =>
                            Number(selected.sourceProblemId) ===
                            Number(problem.id),
                        );
                        const isCloning =
                          Number(cloningProblemId) === Number(problem.id);
                        const primaryTag =
                          problem.tag || problem.tags?.[0] || "General";

                        return (
                          <div
                            key={problem.id}
                            onClick={() => handleToggleProblem(problem)}
                            className={`flex items-center justify-between border-b border-slate-100 p-3.5 transition last:border-0 hover:bg-slate-50 ${
                              isSelected ? "bg-amber-50/30" : ""
                            } ${isEditMode ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                          >
                            <div>
                              <div className="text-[13.5px] font-semibold text-slate-800">
                                {problem.title}
                              </div>
                              <div className="mt-1 flex gap-2 text-[11px] font-medium">
                                <span className="text-slate-400">
                                  {problem.sourceLabel}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span
                                  className={
                                    problem.difficulty === "Easy"
                                      ? "text-emerald-600"
                                      : problem.difficulty === "Medium"
                                        ? "text-amber-600"
                                        : "text-red-600"
                                  }
                                >
                                  {problem.difficulty}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500">
                                  {primaryTag}
                                </span>
                              </div>
                            </div>
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                                isSelected
                                  ? "border-amber-500 bg-amber-500 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isCloning ? (
                                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                              ) : (
                                isSelected && (
                                <X className="h-3.5 w-3.5 rotate-45" />
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}

                    {!isProblemLoading &&
                      !problemLoadError &&
                      filteredProblems.length === 0 && (
                        <div className="p-6 text-center text-sm text-slate-400">
                          No problems found.
                        </div>
                      )}
                  </div>
                </div>

                {!isEditMode && selectedProblems.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
                      Edit Contest Copies
                    </h2>

                    <div className="space-y-5">
                      {selectedProblems.map((problem, problemIndex) => (
                        <div
                          key={problem.sourceProblemId}
                          className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                        >
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-[13px] font-semibold text-slate-800">
                                Problem {problemIndex + 1}: {problem.sourceTitle}
                              </p>
                              <p className="mt-1 text-[12px] text-slate-400">
                                {problem.sourceLabel}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleProblem({
                                id: problem.sourceProblemId,
                              })}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-red-500 transition hover:bg-red-50"
                            >
                              <X className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                                Contest Title
                              </label>
                              <input
                                type="text"
                                value={problem.title}
                                onChange={(e) =>
                                  handleContestProblemChange(
                                    problem.sourceProblemId,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                className={inputClasses}
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                                Statement
                              </label>
                              <textarea
                                rows={5}
                                value={problem.statement}
                                onChange={(e) =>
                                  handleContestProblemChange(
                                    problem.sourceProblemId,
                                    "statement",
                                    e.target.value,
                                  )
                                }
                                className={`resize-none font-mono ${inputClasses}`}
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                                Input Format
                              </label>
                              <textarea
                                rows={3}
                                value={problem.inputFormat}
                                onChange={(e) =>
                                  handleContestProblemChange(
                                    problem.sourceProblemId,
                                    "inputFormat",
                                    e.target.value,
                                  )
                                }
                                className={`resize-none font-mono ${inputClasses}`}
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                                Output Format
                              </label>
                              <textarea
                                rows={3}
                                value={problem.outputFormat}
                                onChange={(e) =>
                                  handleContestProblemChange(
                                    problem.sourceProblemId,
                                    "outputFormat",
                                    e.target.value,
                                  )
                                }
                                className={`resize-none font-mono ${inputClasses}`}
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                                Constraints
                              </label>
                              <textarea
                                rows={3}
                                value={problem.constraints}
                                onChange={(e) =>
                                  handleContestProblemChange(
                                    problem.sourceProblemId,
                                    "constraints",
                                    e.target.value,
                                  )
                                }
                                className={`resize-none font-mono ${inputClasses}`}
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                                Difficulty
                              </label>
                              <select
                                value={problem.difficulty}
                                onChange={(e) =>
                                  handleContestProblemChange(
                                    problem.sourceProblemId,
                                    "difficulty",
                                    e.target.value,
                                  )
                                }
                                className={inputClasses}
                              >
                                {DIFFICULTIES.map((difficulty) => (
                                  <option key={difficulty} value={difficulty}>
                                    {difficulty}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                                Points
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={problem.points}
                                onChange={(e) =>
                                  handleContestProblemChange(
                                    problem.sourceProblemId,
                                    "points",
                                    e.target.value,
                                  )
                                }
                                className={inputClasses}
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                                Time Limit
                              </label>
                              <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={problem.timeLimitSeconds}
                                onChange={(e) =>
                                  handleContestProblemChange(
                                    problem.sourceProblemId,
                                    "timeLimitSeconds",
                                    e.target.value,
                                  )
                                }
                                className={inputClasses}
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                                Memory Limit
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={problem.memoryLimitMb}
                                onChange={(e) =>
                                  handleContestProblemChange(
                                    problem.sourceProblemId,
                                    "memoryLimitMb",
                                    e.target.value,
                                  )
                                }
                                className={inputClasses}
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                                Tags
                              </label>
                              <input
                                type="text"
                                value={problem.tags.join(", ")}
                                onChange={(e) =>
                                  handleContestProblemTagChange(
                                    problem.sourceProblemId,
                                    e.target.value,
                                  )
                                }
                                className={inputClasses}
                              />
                            </div>
                          </div>

                          <div className="mt-5">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-[12px] font-semibold text-slate-600">
                                Contest Test Cases
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  handleAddContestTestCase(
                                    problem.sourceProblemId,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-300"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Case
                              </button>
                            </div>

                            <div className="space-y-3">
                              {problem.testCases.map((testCase, index) => (
                                <div
                                  key={index}
                                  className="rounded-lg border border-slate-200 bg-white p-3"
                                >
                                  <div className="mb-2 flex items-center justify-between gap-3">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                      Case {index + 1}
                                    </span>
                                    <div className="flex items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleContestTestCaseChange(
                                            problem.sourceProblemId,
                                            index,
                                            "isHidden",
                                            !testCase.isHidden,
                                          )
                                        }
                                        className="text-[11px] font-semibold text-slate-500 transition hover:text-amber-600"
                                      >
                                        {testCase.isHidden
                                          ? "Hidden"
                                          : "Visible"}
                                      </button>
                                      {problem.testCases.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveContestTestCase(
                                              problem.sourceProblemId,
                                              index,
                                            )
                                          }
                                          className="text-red-500 transition hover:text-red-600"
                                          title="Remove test case"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <textarea
                                      rows={3}
                                      value={testCase.input}
                                      onChange={(e) =>
                                        handleContestTestCaseChange(
                                          problem.sourceProblemId,
                                          index,
                                          "input",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Input"
                                      className={`resize-none font-mono ${inputClasses}`}
                                    />
                                    <textarea
                                      rows={3}
                                      value={testCase.output}
                                      onChange={(e) =>
                                        handleContestTestCaseChange(
                                          problem.sourceProblemId,
                                          index,
                                          "output",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Expected output"
                                      className={`resize-none font-mono ${inputClasses}`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6 lg:col-span-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
                    Schedule
                  </h2>
                  {isEndedContest && (
                    <p className="mb-4 rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-500">
                      This contest has ended, so its schedule is locked.
                    </p>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Start Time
                      </label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,0.65fr)]">
                        <div className="relative">
                          <Calendar className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="date"
                            name="startDate"
                            value={startTimeParts.date}
                            min={!isEditMode ? minimumStartParts.date : undefined}
                            onChange={(e) =>
                              handleSchedulePartChange(
                                "startTime",
                                "date",
                                e.target.value,
                              )
                            }
                            disabled={isEndedContest}
                            className={`${inputClasses} ${scheduleLockedClasses} pl-10`}
                          />
                        </div>
                        <TimePickerField
                          value={startTimeParts.time}
                          onChange={(value) =>
                            handleSchedulePartChange(
                              "startTime",
                              "time",
                              value,
                            )
                          }
                          disabled={isEndedContest}
                          inputClasses={inputClasses}
                          lockedClasses={scheduleLockedClasses}
                          minValue={startTimeMinValue}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        End Time
                      </label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,0.65fr)]">
                        <div className="relative">
                          <Calendar className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="date"
                            name="endDate"
                            value={endTimeParts.date}
                            min={!isEditMode ? minimumEndParts.date : undefined}
                            onChange={(e) =>
                              handleSchedulePartChange(
                                "endTime",
                                "date",
                                e.target.value,
                              )
                            }
                            disabled={isEndedContest}
                            className={`${inputClasses} ${scheduleLockedClasses} pl-10`}
                          />
                        </div>
                        <TimePickerField
                          value={endTimeParts.time}
                          onChange={(value) =>
                            handleSchedulePartChange(
                              "endTime",
                              "time",
                              value,
                            )
                          }
                          disabled={isEndedContest}
                          inputClasses={inputClasses}
                          lockedClasses={scheduleLockedClasses}
                          minValue={endTimeMinValue}
                        />
                      </div>
                    </div>
                    {durationPreview && (
                      <p
                        className={`rounded-xl px-4 py-2 text-sm ${
                          canSaveSchedule
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        Duration: {durationPreview}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
                    Contest Rating
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={isEditMode}
                      onClick={() => handleRatingChange(true)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        displayedIsRated
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Trophy className="h-5 w-5" />
                      <span className="text-[12px] font-semibold">Rated</span>
                    </button>
                    <button
                      type="button"
                      disabled={isEditMode}
                      onClick={() => handleRatingChange(false)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        !displayedIsRated
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span className="text-[12px] font-semibold">Unrated</span>
                    </button>
                  </div>

                  {displayedIsRated && (
                    <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-700">
                      Rated contests are public only, so private access is
                      disabled.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-[15px] font-semibold text-slate-800">
                    Access Control
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={isEditMode}
                      onClick={() => setIsPrivate(false)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        !displayedIsPrivate
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Globe className="h-5 w-5" />
                      <span className="text-[12px] font-semibold">Public</span>
                    </button>
                    <button
                      type="button"
                      disabled={isEditMode || displayedIsRated}
                      onClick={() => setIsPrivate(true)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        displayedIsPrivate
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Lock className="h-5 w-5" />
                      <span className="text-[12px] font-semibold">Private</span>
                    </button>
                  </div>

                  {displayedIsPrivate && (
                    <div className="mt-4 animate-[fadeSlideDown_0.2s_ease]">
                      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
                        Contest Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isEditMode}
                        placeholder="Enter password..."
                        className={`${inputClasses} ${lockedClasses}`}
                      />
                    </div>
                  )}
                </div>

                {actionError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {actionError}
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-full rounded-xl bg-amber-600 px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isEditMode
                      ? isSaving
                        ? "Saving..."
                        : isEndedContest
                          ? "Contest Locked"
                          : "Save Time"
                      : isSaving
                        ? "Creating..."
                        : "Create Contest"}
                  </button>
                  <Link
                    to="/admin/contests"
                    className="w-full rounded-xl border border-slate-200 px-6 py-3 text-center text-[14px] font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
