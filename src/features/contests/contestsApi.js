import {
  contestFilters,
  liveContests,
  pastContests,
  upcomingContests,
} from "./contestsMockData";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

const liveContestMap = Object.fromEntries(
  liveContests.map((contest) => [contest.id, contest]),
);

const contestDetailsMap = {
  "WC-43L": {
    id: "WC-43L",
    title: `QuickJudge ${liveContestMap["WC-43L"].name}`,
    statusText: "LIVE",
    duration: liveContestMap["WC-43L"].duration,
    problems: [
      {
        id: "A",
        title: "Minimum Path in DAG",
        difficulty: "easy",
        points: 100,
      },
      {
        id: "B",
        title: "Greedy Interval Merge",
        difficulty: "medium",
        points: 200,
      },
      { id: "C", title: "Tree Teleport", difficulty: "medium", points: 200 },
      {
        id: "D",
        title: "Shortest Route Rebuild",
        difficulty: "hard",
        points: 300,
      },
    ],
  },

  "BLZ-09L": {
    id: "BLZ-09L",
    title: `QuickJudge ${liveContestMap["BLZ-09L"].name}`,
    statusText: "LIVE",
    duration: liveContestMap["BLZ-09L"].duration,
    problems: [
      { id: "A", title: "Digit Collapse", difficulty: "easy", points: 100 },
      { id: "B", title: "Fast Matrix Walk", difficulty: "medium", points: 200 },
      { id: "C", title: "Prime Window", difficulty: "hard", points: 300 },
    ],
  },

  "ALG-12L": {
    id: "ALG-12L",
    title: `QuickJudge ${liveContestMap["ALG-12L"].name}`,
    statusText: "LIVE",
    duration: liveContestMap["ALG-12L"].duration,
    problems: [
      { id: "A", title: "Prefix Peak", difficulty: "easy", points: 100 },
      {
        id: "B",
        title: "Binary Search Bounds",
        difficulty: "medium",
        points: 200,
      },
      { id: "C", title: "Ad-hoc Conveyor", difficulty: "medium", points: 200 },
      { id: "D", title: "Range Balance", difficulty: "hard", points: 300 },
      { id: "E", title: "Compressed Jumps", difficulty: "hard", points: 300 },
    ],
  },
};

export async function getContestsApi() {
  await wait(400);

  return {
    filters: clone(contestFilters),
    live: clone(liveContests),
    upcoming: clone(upcomingContests),
    past: clone(pastContests),
  };
}

export async function registerUpcomingContestApi(contestId) {
  await wait(250);

  const contest = upcomingContests.find((item) => item.id === contestId);

  if (!contest) {
    throw new Error("Upcoming contest not found.");
  }

  return {
    success: true,
    contestId,
  };
}

export async function verifyContestPasswordApi({ contestId, password }) {
  await wait(300);

  const contest = liveContests.find((item) => item.id === contestId);

  if (!contest) {
    throw new Error("Contest not found.");
  }

  if (!contest.requiresPassword) {
    return {
      success: true,
      contestId,
    };
  }

  if (password.trim() !== contest.password) {
    throw new Error("Incorrect contest password.");
  }

  return {
    success: true,
    contestId,
  };
}

export async function getContestDetailsApi(contestId) {
  await wait(300);

  const details = contestDetailsMap[contestId];

  if (!details) {
    throw new Error("Contest not found.");
  }

  return clone(details);
}

//
