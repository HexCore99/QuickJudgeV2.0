const contestFilters = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

const contestCatalog = {
  "WC-43L": {
    name: "Weekly Contest #43",
    desc: "Graph Algorithms & Greedy Techniques",
    date: "Apr 2, 2026",
    time: "20:00 UTC",
    duration: "1h 30m",
    statusText: "LIVE",
    type: "Weekly",
    problemsCount: 4,
    participants: 892,
    requiresPassword: false,
    rated: true,
    tags: ["Graphs", "Greedy", "Trees", "Shortest Path"],
  },
  "BLZ-09L": {
    name: "Blitz Round #9",
    desc: "Fast-Paced Implementation & Math",
    date: "Apr 3, 2026",
    time: "20:00 UTC",
    duration: "1h 30m",
    statusText: "LIVE",
    type: "Blitz",
    problemsCount: 3,
    participants: 423,
    requiresPassword: true,
    rated: false,
    tags: ["Math", "Implementation", "Number Theory"],
  },
  "SEC-01L": {
    name: "Secure Contest #1",
    desc: "Password Protected Mixed Topic Contest",
    date: "Apr 3, 2026",
    time: "22:00 UTC",
    duration: "2h",
    statusText: "LIVE",
    type: "Special",
    problemsCount: 4,
    participants: 185,
    requiresPassword: true,
    rated: false,
    tags: ["Greedy", "Binary Search", "Graphs", "DP"],
  },
  "NC-04U": {
    name: "Night Challenge #4",
    desc: "Strings, Hashing & Suffix Structures",
    date: "Apr 5, 2026",
    time: "22:00 UTC",
    duration: "2h",
    statusText: "UPCOMING",
    type: "Night",
    problemsCount: 5,
    registered: true,
    rated: false,
    tags: ["Strings", "Hashing", "Trie", "Suffix Array"],
  },
  "MC-09U": {
    name: "Monthly Challenge #9",
    desc: "Advanced Data Structures & Optimization",
    date: "Apr 8, 2026",
    time: "19:00 UTC",
    duration: "3h",
    statusText: "UPCOMING",
    type: "Monthly",
    problemsCount: 6,
    registered: true,
    rated: true,
    tags: ["Segment Tree", "BIT", "Persistent", "Optimization"],
  },
  "WC-44U": {
    name: "Weekly Contest #44",
    desc: "Dynamic Programming & Combinatorics",
    date: "Apr 10, 2026",
    time: "20:00 UTC",
    duration: "2h",
    statusText: "UPCOMING",
    type: "Weekly",
    problemsCount: 4,
    registered: true,
    rated: true,
    tags: ["DP", "Combinatorics", "Probability"],
  },
  "WC-42": {
    name: "Weekly Contest #42",
    desc: "Graphs, Trees and Greedy",
    date: "Mar 25, 2026",
    time: "20:00 UTC",
    duration: "2h",
    statusText: "PAST",
    type: "Weekly",
    problemsCount: 5,
    participated: true,
    rank: 12,
    total: 847,
    rated: true,
    tags: ["Graphs", "Trees", "Greedy"],
  },
  "BLZ-08": {
    name: "Blitz Round #8",
    desc: "Math and Implementation",
    date: "Mar 20, 2026",
    time: "22:00 UTC",
    duration: "1h 30m",
    statusText: "PAST",
    type: "Blitz",
    problemsCount: 3,
    participated: false,
    rank: null,
    total: 389,
    rated: false,
    tags: ["Math", "Implementation"],
  },
  "WC-41": {
    name: "Weekly Contest #41",
    desc: "Arrays, Binary Search and Two Pointers",
    date: "Mar 15, 2026",
    time: "20:00 UTC",
    duration: "2h",
    statusText: "PAST",
    type: "Weekly",
    problemsCount: 5,
    participated: true,
    rank: 18,
    total: 823,
    rated: true,
    tags: ["Arrays", "Binary Search", "Two Pointers"],
  },
  "MC-08": {
    name: "Monthly Challenge #8",
    desc: "Segment Tree, BIT and Strings",
    date: "Mar 10, 2026",
    time: "19:00 UTC",
    duration: "3h",
    statusText: "PAST",
    type: "Monthly",
    problemsCount: 6,
    participated: false,
    rank: null,
    total: 1245,
    rated: true,
    tags: ["Segment Tree", "BIT", "String"],
  },
  "NC-03": {
    name: "Night Challenge #3",
    desc: "Strings, Hashing and Trie",
    date: "Mar 5, 2026",
    time: "22:00 UTC",
    duration: "2h",
    statusText: "PAST",
    type: "Night",
    problemsCount: 5,
    participated: true,
    rank: 7,
    total: 512,
    rated: false,
    tags: ["Strings", "Hashing", "Trie"],
  },
};

const contestProblemsById = {
  "WC-43L": [
    { id: "A", title: "Minimum Path in DAG", difficulty: "easy", points: 100 },
    { id: "B", title: "Greedy Interval Merge", difficulty: "medium", points: 200 },
    { id: "C", title: "Tree Teleport", difficulty: "medium", points: 200 },
    { id: "D", title: "Shortest Route Rebuild", difficulty: "hard", points: 300 },
  ],
  "BLZ-09L": [
    { id: "A", title: "Digit Collapse", difficulty: "easy", points: 100 },
    { id: "B", title: "Fast Matrix Walk", difficulty: "medium", points: 200 },
    { id: "C", title: "Prime Window", difficulty: "hard", points: 300 },
  ],
  "SEC-01L": [
    { id: "A", title: "Locked Prefix", difficulty: "easy", points: 100 },
    { id: "B", title: "Checkpoint Greedy", difficulty: "medium", points: 200 },
    { id: "C", title: "Secret Tunnel Graph", difficulty: "medium", points: 200 },
    { id: "D", title: "Encrypted States", difficulty: "hard", points: 300 },
  ],
  "NC-04U": [
    { id: "A", title: "Rolling Hash Warmup", difficulty: "easy", points: 100 },
    { id: "B", title: "Prefix String Clash", difficulty: "medium", points: 200 },
    { id: "C", title: "Trie Path Counter", difficulty: "medium", points: 200 },
    { id: "D", title: "Suffix Match Range", difficulty: "hard", points: 300 },
    { id: "E", title: "Cyclic Hash Query", difficulty: "hard", points: 300 },
  ],
  "MC-09U": [
    { id: "A", title: "Range Sum Redux", difficulty: "easy", points: 100 },
    { id: "B", title: "Fenwick Jump", difficulty: "medium", points: 200 },
    { id: "C", title: "Persistent Versioning", difficulty: "medium", points: 200 },
    { id: "D", title: "Lazy Fortress", difficulty: "hard", points: 300 },
    { id: "E", title: "Optimizer Chain", difficulty: "hard", points: 300 },
    { id: "F", title: "K-th Query Machine", difficulty: "hard", points: 300 },
  ],
  "WC-44U": [
    { id: "A", title: "Coin Paths", difficulty: "easy", points: 100 },
    { id: "B", title: "Balanced Choices", difficulty: "medium", points: 200 },
    { id: "C", title: "Probability Steps", difficulty: "medium", points: 200 },
    { id: "D", title: "Combinatoric Tower", difficulty: "hard", points: 300 },
  ],
  "WC-42": [
    { id: "A", title: "Forest Walk", difficulty: "easy", points: 100 },
    { id: "B", title: "Edge Pick", difficulty: "medium", points: 200 },
    { id: "C", title: "Tree Distance Sum", difficulty: "medium", points: 200 },
    { id: "D", title: "Directed Escape", difficulty: "hard", points: 300 },
    { id: "E", title: "Greedy Reorder", difficulty: "hard", points: 300 },
  ],
  "BLZ-08": [
    { id: "A", title: "Fast Additions", difficulty: "easy", points: 100 },
    { id: "B", title: "Odd Pair Count", difficulty: "medium", points: 200 },
    { id: "C", title: "Modulo Chase", difficulty: "hard", points: 300 },
  ],
  "WC-41": [
    { id: "A", title: "Sorted Slice", difficulty: "easy", points: 100 },
    { id: "B", title: "Nearest Bound", difficulty: "medium", points: 200 },
    { id: "C", title: "Double Pointer Run", difficulty: "medium", points: 200 },
    { id: "D", title: "Range Packing", difficulty: "hard", points: 300 },
    { id: "E", title: "Array Rebuild", difficulty: "hard", points: 300 },
  ],
  "MC-08": [
    { id: "A", title: "Segment Intro", difficulty: "easy", points: 100 },
    { id: "B", title: "Point Update Mania", difficulty: "medium", points: 200 },
    { id: "C", title: "String Blocks", difficulty: "medium", points: 200 },
    { id: "D", title: "Bit Inversion", difficulty: "hard", points: 300 },
    { id: "E", title: "Interval Lock", difficulty: "hard", points: 300 },
    { id: "F", title: "Segment Tree Beats Lite", difficulty: "hard", points: 300 },
  ],
  "NC-03": [
    { id: "A", title: "String Echo", difficulty: "easy", points: 100 },
    { id: "B", title: "Hash Window", difficulty: "medium", points: 200 },
    { id: "C", title: "Trie Merge", difficulty: "medium", points: 200 },
    { id: "D", title: "Pattern Rush", difficulty: "hard", points: 300 },
    { id: "E", title: "Lexicographic Night", difficulty: "hard", points: 300 },
  ],
};

const contestLeaderboardById = {
  "WC-43L": {
    entries: [
      {
        rank: 1,
        userId: "u1",
        name: "alice_cp",
        handle: "alice_cp",
        totalScore: 800,
        penalty: 180,
        problems: {
          A: { solved: true, score: 100, timeStr: "12m", attempts: 1 },
          B: { solved: true, score: 200, timeStr: "37m", attempts: 1 },
          C: { solved: true, score: 200, timeStr: "1h05m", attempts: 2 },
          D: { solved: true, score: 300, timeStr: "1h28m", attempts: 1 },
        },
      },
      {
        rank: 2,
        userId: "u8",
        name: "fast_typer",
        handle: "fast_typer",
        totalScore: 790,
        penalty: 175,
        problems: {
          A: { solved: true, score: 100, timeStr: "9m", attempts: 1 },
          B: { solved: true, score: 190, timeStr: "31m", attempts: 2 },
          C: { solved: true, score: 200, timeStr: "54m", attempts: 1 },
          D: { solved: true, score: 300, timeStr: "1h21m", attempts: 1 },
        },
      },
      {
        rank: 3,
        userId: "u4",
        name: "dev_ninja",
        handle: "dev_ninja",
        totalScore: 780,
        penalty: 200,
        problems: {
          A: { solved: true, score: 100, timeStr: "15m", attempts: 1 },
          B: { solved: true, score: 190, timeStr: "45m", attempts: 2 },
          C: { solved: true, score: 190, timeStr: "1h04m", attempts: 2 },
          D: { solved: true, score: 300, timeStr: "1h30m", attempts: 1 },
        },
      },
      {
        rank: 4,
        userId: "u3",
        name: "bob_codes",
        handle: "bob_codes",
        totalScore: 500,
        penalty: 140,
        problems: {
          A: { solved: true, score: 100, timeStr: "10m", attempts: 1 },
          B: { solved: true, score: 200, timeStr: "42m", attempts: 1 },
          C: { solved: true, score: 200, timeStr: "1h12m", attempts: 1 },
          D: { solved: false, attempts: 2 },
        },
      },
      {
        rank: 5,
        userId: "u2",
        name: "siyam",
        handle: "siyam",
        totalScore: 300,
        penalty: 95,
        problems: {
          A: { solved: true, score: 100, timeStr: "15m", attempts: 1 },
          B: { solved: true, score: 200, timeStr: "1h10m", attempts: 2 },
          C: { solved: false, attempts: 1 },
          D: { solved: false, attempts: 1 },
        },
      },
    ],
  },
};

const contestSubmissionsById = {
  "WC-43L": [
    {
      id: 10,
      problemCode: "D",
      problemTitle: "Shortest Route Rebuild",
      verdict: "RE",
      language: "Java",
      runtime: "132ms",
      timeStr: "Apr 2, 2026 21:55 UTC",
    },
    {
      id: 9,
      problemCode: "C",
      problemTitle: "Tree Teleport",
      verdict: "TLE",
      language: "Python",
      runtime: "2001ms",
      timeStr: "Apr 2, 2026 21:35 UTC",
    },
    {
      id: 8,
      problemCode: "B",
      problemTitle: "Greedy Interval Merge",
      verdict: "AC",
      language: "C++",
      runtime: "42ms",
      timeStr: "Apr 2, 2026 21:10 UTC",
    },
    {
      id: 7,
      problemCode: "B",
      problemTitle: "Greedy Interval Merge",
      verdict: "WA",
      language: "C++",
      runtime: "38ms",
      timeStr: "Apr 2, 2026 20:45 UTC",
    },
    {
      id: 6,
      problemCode: "A",
      problemTitle: "Minimum Path in DAG",
      verdict: "AC",
      language: "C++",
      runtime: "29ms",
      timeStr: "Apr 2, 2026 20:15 UTC",
    },
  ],
};

const contestAnnouncementsById = {
  "WC-43L": [
    {
      id: 1,
      contestId: "WC-43L",
      title: "Welcome to Weekly Contest #43!",
      message:
        "Good luck to all participants. Please read all problem statements carefully before coding.",
      postedAt: "Apr 2, 2026 at 20:00 UTC",
      pinned: true,
    },
    {
      id: 2,
      contestId: "WC-43L",
      title: "Clarification on Problem B",
      message: "In Problem B, array indices are 1-based, not 0-based.",
      postedAt: "Apr 2, 2026 at 20:30 UTC",
      pinned: false,
    },
    {
      id: 3,
      contestId: "WC-43L",
      title: "Problem D Time Limit Extended",
      message: "The time limit for Problem D has been extended from 1s to 2s.",
      postedAt: "Apr 2, 2026 at 21:00 UTC",
      pinned: false,
    },
  ],
};

const contestQueriesById = {
  "WC-43L": [
    {
      id: 1,
      contestId: "WC-43L",
      username: "cipher_x",
      question: "For Problem B, are the interval endpoints inclusive?",
      status: "answered",
      answer: "Yes. Both endpoints are inclusive.",
      createdAt: "2026-04-02T20:18:00Z",
      answeredAt: "2026-04-02T20:25:00Z",
    },
    {
      id: 2,
      contestId: "WC-43L",
      username: "bytewitch",
      question: "Can we assume the input graph in Problem D is connected?",
      status: "pending",
      answer: null,
      createdAt: "2026-04-02T20:44:00Z",
      answeredAt: null,
    },
  ],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const mapProblemForLeaderboard = (problem) => ({
  code: problem.id,
  title: problem.title,
  points: problem.points,
});

export function getMockContests() {
  return clone({
    filters: contestFilters,
    live: ["WC-43L", "BLZ-09L", "SEC-01L"].map((id) => {
      const contest = contestCatalog[id];

      return {
        id,
        name: contest.name,
        desc: contest.desc,
        date: contest.date,
        time: contest.time,
        duration: contest.duration,
        problems: contest.problemsCount,
        participants: contest.participants,
        requiresPassword: contest.requiresPassword,
        tags: contest.tags,
      };
    }),
    upcoming: ["NC-04U", "MC-09U", "WC-44U"].map((id) => {
      const contest = contestCatalog[id];

      return {
        id,
        name: contest.name,
        desc: contest.desc,
        date: contest.date,
        time: contest.time,
        duration: contest.duration,
        problems: contest.problemsCount,
        registered: contest.registered,
        tags: contest.tags,
      };
    }),
    past: ["WC-42", "BLZ-08", "WC-41", "MC-08", "NC-03"].map((id) => {
      const contest = contestCatalog[id];

      return {
        id,
        name: contest.name,
        date: contest.date,
        type: contest.type,
        participated: contest.participated,
        rank: contest.rank,
        total: contest.total,
        questions: contest.problemsCount,
        rated: contest.rated,
        tags: contest.tags,
      };
    }),
  });
}

export function getMockContestDetails(contestId) {
  const contest = contestCatalog[contestId];

  if (!contest) {
    throw new Error("Contest not found.");
  }

  return clone({
    id: contestId,
    title: `QuickJudge ${contest.name}`,
    statusText: contest.statusText,
    duration: contest.duration,
    problems: contestProblemsById[contestId] || [],
  });
}

export function getMockContestLeaderboard(contestId) {
  const problems = (contestProblemsById[contestId] || []).map(
    mapProblemForLeaderboard,
  );
  const leaderboard = contestLeaderboardById[contestId] || { entries: [] };

  return clone({
    problems,
    entries: leaderboard.entries,
  });
}

export function getMockContestSubmissions(contestId) {
  return clone(contestSubmissionsById[contestId] || []);
}

export function getMockContestAnnouncements(contestId) {
  return clone(contestAnnouncementsById[contestId] || []);
}

export function getMockContestQueries(contestId) {
  return clone(contestQueriesById[contestId] || []);
}

export function getMockSubmitContestQuery({ contestId, question }) {
  return clone({
    id: Date.now(),
    contestId,
    username: "you",
    question,
    status: "pending",
    answer: null,
    createdAt: new Date().toISOString(),
    answeredAt: null,
  });
}

export function getMockRegisterUpcomingContest(contestId) {
  return { contestId };
}

export function getMockVerifyContestPassword({ contestId, password }) {
  const contest = contestCatalog[contestId];

  if (!contest) {
    throw new Error("Contest not found.");
  }

  if (contest.requiresPassword && !String(password || "").trim()) {
    throw new Error("Contest password is required.");
  }

  return { contestId };
}
