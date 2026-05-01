import { normalizeDifficulty } from "./problemUtils";

const DEFAULT_DESCRIPTION = `Given an array of **n** integers and a target value **t**, find two distinct indices **i** and **j** such that the sum of the elements at those indices equals the target.

It is guaranteed that exactly one valid pair exists for every test case. You may return the indices in any order.`;

const DEFAULT_INPUT_SPEC = `The first line contains two integers **n** and **t** (2 <= n <= 10^5, -10^9 <= t <= 10^9) - the size of the array and the target sum.

The second line contains **n** space-separated integers a1, a2, ..., an (-10^9 <= ai <= 10^9).`;

const DEFAULT_OUTPUT_SPEC = `Print two space-separated integers - the 0-indexed positions of the two elements whose sum equals **t**.`;

const DEFAULT_SAMPLES = [
  {
    input: "4 9\n2 7 11 15",
    output: "0 1",
  },
  {
    input: "3 6\n3 2 4",
    output: "1 2",
  },
];

const DEFAULT_CONSTRAINTS = [
  "2 <= n <= 10^5",
  "-10^9 <= t <= 10^9",
  "-10^9 <= ai <= 10^9",
  "Exactly one valid pair is guaranteed to exist.",
];

const LIMITS_BY_DIFFICULTY = {
  easy: { timeLimit: "1 second", memoryLimit: "256 MB" },
  medium: { timeLimit: "2 seconds", memoryLimit: "256 MB" },
  hard: { timeLimit: "3 seconds", memoryLimit: "512 MB" },
};

const DETAIL_LIBRARY = {
  1: {
    description: `You are given an integer array and a target value. Return the pair of indices that forms the target sum while handling repeated values carefully.

The answer is guaranteed to exist, and any valid ordering of the indices is accepted.`,
    tags: ["Array", "Hash Table"],
  },
  2: {
    description: `A robot moves on a blocked grid and needs the shortest route from the top-left corner to the destination.

Find the minimum number of moves needed to reach the goal, or determine that it is impossible.`,
    inputSpec: `The first line contains two integers **n** and **m** - the grid dimensions.

Each of the next **n** lines contains **m** characters representing free cells and walls.`,
    outputSpec: `Print the minimum number of moves needed to reach the destination. If no route exists, print **-1**.`,
    constraints: [
      "1 <= n, m <= 1000",
      "Grid cells are either blocked or free.",
      "Moves are allowed in four directions.",
    ],
    samples: [
      {
        input: "3 4\n....\n.##.\n....",
        output: "5",
      },
    ],
    tags: ["Graph", "BFS"],
  },
  3: {
    description: `Given a string, compute the length of the longest palindromic substring using dynamic programming.

You should optimize the transitions carefully to stay within the time limit.`,
    inputSpec: `The input contains a single string **s**.`,
    outputSpec: `Print the length of the longest palindromic substring in **s**.`,
    constraints: [
      "1 <= |s| <= 5000",
      "s contains lowercase English letters.",
    ],
    samples: [
      {
        input: "babad",
        output: "3",
      },
    ],
    tags: ["DP", "String"],
  },
  4: {
    description: `You need to find the minimum feasible answer using binary search over the value space.

The predicate can be checked greedily, but careful bounds handling is required.`,
    tags: ["Binary Search"],
  },
  5: {
    description: `Determine whether a directed graph contains a cycle.

You may use depth-first search or another equivalent graph technique.`,
    inputSpec: `The first line contains two integers **n** and **m**.

Each of the next **m** lines contains a directed edge **u v**.`,
    outputSpec: `Print **YES** if the graph contains a cycle, otherwise print **NO**.`,
    constraints: [
      "1 <= n <= 2 * 10^5",
      "0 <= m <= 2 * 10^5",
    ],
    tags: ["Graph", "DFS"],
  },
  6: {
    description: `Design an LRU cache that supports **get** and **put** in constant time.

Your implementation should correctly evict the least recently used key whenever the capacity is exceeded.`,
    inputSpec: `The first line contains the cache capacity.

The second line contains the number of operations, followed by one operation per line.`,
    outputSpec: `For each **get** operation, print the returned value.`,
    constraints: [
      "1 <= capacity <= 10^5",
      "1 <= operations <= 2 * 10^5",
    ],
    tags: ["Design", "Linked List"],
  },
  7: {
    description: `Find the maximum possible sum over all contiguous subarrays.

An optimal linear-time approach exists.`,
    tags: ["Array", "DP"],
  },
  A: {
    title: "Minimum Path in DAG",
    tags: ["Graphs", "Shortest Path"],
  },
  B: {
    title: "Greedy Interval Merge",
    tags: ["Greedy", "Intervals"],
  },
  C: {
    title: "Tree Teleport",
    tags: ["Trees", "Graph"],
  },
  D: {
    title: "Shortest Route Rebuild",
    tags: ["Graphs", "Paths"],
  },
  E: {
    title: "Persistent Versioning",
    tags: ["Data Structures", "Persistent"],
  },
  F: {
    title: "K-th Query Machine",
    tags: ["Data Structures", "Queries"],
  },
};

const DEFAULT_DETAIL = {
  title: "Practice Problem",
  difficulty: "medium",
  description: DEFAULT_DESCRIPTION,
  inputSpec: DEFAULT_INPUT_SPEC,
  outputSpec: DEFAULT_OUTPUT_SPEC,
  samples: DEFAULT_SAMPLES,
  constraints: DEFAULT_CONSTRAINTS,
  tags: ["Array", "Implementation"],
  hasEditorial: false,
};

export function getProblemMockDetail({
  problemId,
  baseProblem = {},
  contestTitle = null,
}) {
  const resolvedId = String(problemId || baseProblem.id || "P");
  const libraryDetail = DETAIL_LIBRARY[resolvedId] || {};
  const difficulty = normalizeDifficulty(
    baseProblem.difficulty || libraryDetail.difficulty || DEFAULT_DETAIL.difficulty,
  );
  const limits =
    LIMITS_BY_DIFFICULTY[difficulty] || LIMITS_BY_DIFFICULTY.medium;

  return {
    ...DEFAULT_DETAIL,
    ...libraryDetail,
    ...baseProblem,
    id: resolvedId,
    title:
      baseProblem.title ||
      libraryDetail.title ||
      `${DEFAULT_DETAIL.title} ${resolvedId}`,
    difficulty,
    timeLimit:
      baseProblem.timeLimit || libraryDetail.timeLimit || limits.timeLimit,
    memoryLimit:
      baseProblem.memoryLimit || libraryDetail.memoryLimit || limits.memoryLimit,
    contestTitle:
      contestTitle || baseProblem.contestTitle || libraryDetail.contestTitle,
    tags:
      Array.isArray(baseProblem.tags) && baseProblem.tags.length > 0
        ? baseProblem.tags
        : libraryDetail.tags || DEFAULT_DETAIL.tags,
    samples: libraryDetail.samples || DEFAULT_DETAIL.samples,
    constraints: libraryDetail.constraints || DEFAULT_DETAIL.constraints,
    inputSpec: libraryDetail.inputSpec || DEFAULT_DETAIL.inputSpec,
    outputSpec: libraryDetail.outputSpec || DEFAULT_DETAIL.outputSpec,
    description: libraryDetail.description || DEFAULT_DETAIL.description,
  };
}
