export const discussionMockData = [
  {
    id: "disc-1",
    title: "How should I think about binary lifting for LCA?",
    body: "I understand the idea of jumping by powers of two, but I still get confused when building the parent table. What is the cleanest way to reason about the transition from dp[node][j - 1] to dp[node][j]?",
    authorId: "QJ-2024-0847",
    authorName: "HexCore",
    createdAt: "2026-04-30T12:20:00Z",
    replies: [
      {
        id: "reply-1",
        parentReplyId: null,
        userId: "u-alice",
        authorName: "alice_cp",
        body: "Try reading dp[node][j] as the 2^j-th ancestor of node. Then dp[node][j - 1] gives the halfway ancestor, and dp[halfway][j - 1] jumps the same distance again.",
        createdAt: "2026-04-30T12:38:00Z",
      },
      {
        id: "reply-2",
        parentReplyId: "reply-1",
        userId: 1,
        authorName: "Guest",
        body: "That framing helps. So the recurrence is really two equal jumps chained together.",
        createdAt: "2026-04-30T13:05:00Z",
      },
      {
        id: "reply-3",
        parentReplyId: null,
        userId: "u-bob",
        authorName: "bob_codes",
        body: "Also make sure the immediate parent column is filled before the DFS/BFS moves on, otherwise the higher columns can inherit undefined values.",
        createdAt: "2026-04-30T14:10:00Z",
      },
    ],
  },
  {
    id: "disc-2",
    title: "Why does my Dijkstra solution pass samples but fail hidden tests?",
    body: "I am using a priority queue and relaxing edges normally. The samples pass, but some hidden tests get WA. Could this be caused by not ignoring stale queue entries?",
    authorId: "u-samia",
    authorName: "samia_dev",
    createdAt: "2026-04-29T18:45:00Z",
    replies: [
      {
        id: "reply-4",
        parentReplyId: null,
        userId: "u-rifat",
        authorName: "rifat_ai",
        body: "Yes, stale entries are a common source of mistakes. After popping, compare the popped distance with dist[node]. If it is larger, skip that state.",
        createdAt: "2026-04-29T19:03:00Z",
      },
      {
        id: "reply-5",
        parentReplyId: null,
        userId: "u-nova",
        authorName: "nova_bits",
        body: "Another thing to check is overflow. If weights can be large, use long long for distances and INF.",
        createdAt: "2026-04-29T19:17:00Z",
      },
    ],
  },
  {
    id: "disc-3",
    title: "Good practice set before the next weekly contest?",
    body: "I want to warm up on implementation, two pointers, and basic graph traversal. Any QuickJudge problem set suggestions for a focused two-hour session?",
    authorId: 1,
    authorName: "Guest",
    createdAt: "2026-04-28T09:25:00Z",
    replies: [
      {
        id: "reply-6",
        parentReplyId: null,
        userId: "u-tanvir",
        authorName: "tanvir_42",
        body: "I would do one easy implementation, two medium two-pointer problems, then finish with a BFS/DFS problem. Keep the last 20 minutes for reviewing wrong attempts.",
        createdAt: "2026-04-28T10:02:00Z",
      },
    ],
  },
  {
    id: "disc-4",
    title: "When should I use prefix sums instead of a segment tree?",
    body: "For range query problems, I sometimes overbuild with segment trees. What is the quick checklist for choosing prefix sums instead?",
    authorId: "u-mehedi",
    authorName: "mehedi_stack",
    createdAt: "2026-04-26T15:15:00Z",
    replies: [],
  },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

export function getMockDiscussions() {
  return clone(discussionMockData);
}
