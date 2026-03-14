const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const contestPasswords = {
  1: "quick12",
  2: "blitz13",
  3: "night15",
};

const mockContestList = {
  live: [
    {
      id: 1,
      status: "live",
      title: "QuickJudge Weekly Contest #12",
      description:
        "A weekly educational contest featuring problems from arrays, graphs, and dynamic programming.",
      date: "Mar 12, 2026",
      duration: "2h 30m",
      problems: "4 problems",
    },
    {
      id: 2,
      status: "live",
      title: "QuickJudge Blitz Round",
      description:
        "A fast-paced live round featuring implementation and math problems.",
      date: "Mar 13, 2026",
      duration: "1h 30m",
      problems: "3 problems",
    },
    {
      id: 3,
      status: "live",
      title: "QuickJudge Night Challenge",
      description:
        "An active mixed-topic contest covering strings, sorting, and basic graphs.",
      date: "Mar 13, 2026",
      duration: "2h",
      problems: "5 problems",
    },
  ],
  upcoming: [
    {
      id: 4,
      status: "upcoming",
      title: "QuickJudge Weekly Contest #13",
      description:
        "Upcoming contest focusing on graph algorithms and greedy techniques.",
      date: "Mar 19, 2026",
      duration: "2h",
      problems: "2 problems",
    },
  ],
  past: [
    {
      id: 5,
      status: "ended",
      title: "QuickJudge Weekly Contest #11",
      description:
        "Last week's contest on binary search and dynamic programming.",
      date: "Mar 5, 2026",
      duration: "2h 30m",
      problems: "2 problems",
    },
  ],
};

const mockContestDetails = {
  1: {
    id: 1,
    title: "QuickJudge Weekly Contest #12",
    statusText: "LIVE",
    duration: "2h 30m",
    tabs: [
      "Problems",
      "Submissions",
      "Leaderboard",
      "Announcements",
      "Queries",
    ],
    problems: [
      { id: "A", title: "Two Sum", difficulty: "easy", points: 100 },
      {
        id: "B",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "medium",
        points: 200,
      },
      {
        id: "C",
        title: "Merge K Sorted Lists",
        difficulty: "hard",
        points: 300,
      },
      {
        id: "D",
        title: "Maximum Subarray",
        difficulty: "medium",
        points: 200,
      },
    ],
  },
  2: {
    id: 2,
    title: "QuickJudge Blitz Round",
    statusText: "LIVE",
    duration: "1h 30m",
    tabs: [
      "Problems",
      "Submissions",
      "Leaderboard",
      "Announcements",
      "Queries",
    ],
    problems: [
      { id: "A", title: "Add Digits", difficulty: "easy", points: 100 },
      { id: "B", title: "Matrix Walk", difficulty: "medium", points: 200 },
      { id: "C", title: "Prime Race", difficulty: "hard", points: 300 },
    ],
  },
  3: {
    id: 3,
    title: "QuickJudge Night Challenge",
    statusText: "LIVE",
    duration: "2h",
    tabs: [
      "Problems",
      "Submissions",
      "Leaderboard",
      "Announcements",
      "Queries",
    ],
    problems: [
      { id: "A", title: "String Flip", difficulty: "easy", points: 100 },
      { id: "B", title: "Sorting Cost", difficulty: "medium", points: 200 },
      { id: "C", title: "Shortest Route", difficulty: "medium", points: 200 },
      { id: "D", title: "Tree Escape", difficulty: "hard", points: 300 },
      { id: "E", title: "Bitwise Arena", difficulty: "hard", points: 300 },
    ],
  },
};

export async function getContestsApi() {
  await wait(400);

  return {
    live: [...mockContestList.live],
    upcoming: [...mockContestList.upcoming],
    past: [...mockContestList.past],
  };
}

export async function verifyContestPasswordApi({ contestId, password }) {
  await wait(300);
  const expectedPassword = contestPasswords[contestId];

  if (!expectedPassword || password !== expectedPassword) {
    throw new Error("Incorrect contest password.");
  }

  return {
    success: true,
    contestId,
  };
}

export async function getContestDetailsApi(contestId) {
  await wait(300);
  const details = mockContestDetails[contestId];

  if (!details) {
    throw new Error("Contest not found.");
  }

  return details;
}
