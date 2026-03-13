const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getContestsApi() {
  await wait(500);

  return {
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
        id: 4,
        status: "live",
        title: "QuickJudge Blitz Round",
        description:
          "A fast-paced live round featuring implementation and math problems.",
        date: "Mar 13, 2026",
        duration: "1h 30m",
        problems: "3 problems",
      },
      {
        id: 5,
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
        id: 2,
        status: "upcoming",
        title: "QuickJudge Weekly Contest #13",
        description:
          "Upcoming contest focusing on graph algorithms and greedy techniques.",
        date: "Mar 19, 2026",
        duration: "2h",
        problems: "2 problems",
      },
      {
        id: 6,
        status: "upcoming",
        title: "QuickJudge DP Marathon",
        description:
          "An upcoming contest dedicated to dynamic programming patterns and optimization.",
        date: "Mar 21, 2026",
        duration: "3h",
        problems: "5 problems",
      },
      {
        id: 7,
        status: "upcoming",
        title: "QuickJudge Beginner Ladder",
        description:
          "A beginner-friendly event focused on arrays, loops, and simple greedy problems.",
        date: "Mar 24, 2026",
        duration: "1h 45m",
        problems: "4 problems",
      },
    ],
    past: [
      {
        id: 3,
        status: "ended",
        title: "QuickJudge Weekly Contest #11",
        description:
          "Last week's contest on binary search and dynamic programming.",
        date: "Mar 5, 2026",
        duration: "2h 30m",
        problems: "2 problems",
      },
      {
        id: 8,
        status: "ended",
        title: "QuickJudge Arrays Arena",
        description:
          "A completed contest featuring prefix sums, sliding window, and sorting tasks.",
        date: "Feb 27, 2026",
        duration: "2h",
        problems: "4 problems",
      },
      {
        id: 9,
        status: "ended",
        title: "QuickJudge Graph Sprint",
        description:
          "A finished round focused on BFS, DFS, and shortest path basics.",
        date: "Feb 20, 2026",
        duration: "2h 15m",
        problems: "5 problems",
      },
    ],
  };
}
