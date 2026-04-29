export const profileUser = {
    name: "HexCore",
    handle: "hexcore99",
    dept: "Computer Science",
    bio: "Competitive programmer and full-stack developer.",
    git: "https://github.com/HexCore99",
    id: "QJ-2024-0847",
    joinedDate: "Mar 2023",
    lastVisit: "Today",
    rating: 1847,
    ratingDelta: "+63",
    ratingTier: "EXPERT",
    rank: 38,
    rankDelta: 5,
    solved: 247,
    solvedDelta: 12,
    totalSubmissions: 583,
    acRate: "42.4%",
    streak: 23,
    bestStreak: 41,
    contestCount: 15,
    ratedContests: 14,
  };
  
  export const submissions = [
    {
      problem: "Binary Lifting on Trees",
      id: "QJ-1042",
      verdict: "AC",
      time: "0.82s",
      mem: "24.1 MB",
      lang: "C++",
      diff: "Hard",
      f: "ac",
      at: "2025-03-15 14:32:08",
      contest: "Weekly Contest #42",
      code: `#include <bits/stdc++.h>
  using namespace std;
  const int LOG=20;
  int up[200005][LOG],depth[200005];
  vector<int> adj[200005];
  
  void dfs(int u,int p){
      up[u][0]=p;
      for(int i=1;i<LOG;i++)
          up[u][i]=up[up[u][i-1]][i-1];
      for(int v:adj[u])
          if(v!=p){depth[v]=depth[u]+1;dfs(v,u);}
  }
  
  int lca(int u,int v){
      if(depth[u]<depth[v])swap(u,v);
      int d=depth[u]-depth[v];
      for(int i=0;i<LOG;i++)
          if((d>>i)&1) u=up[u][i];
      if(u==v) return u;
      for(int i=LOG-1;i>=0;i--)
          if(up[u][i]!=up[v][i])
              u=up[u][i],v=up[v][i];
      return up[u][0];
  }`,
      tc: "Input: 5 3 / 1-2 1-3 2-4 2-5 / 4 5, 4 3, 1 5\nOutput: 2, 1, 1",
    },
    {
      problem: "Longest Increasing Subsequence",
      id: "QJ-0387",
      verdict: "AC",
      time: "0.15s",
      mem: "8.3 MB",
      lang: "Python",
      diff: "Medium",
      f: "ac",
      at: "2025-03-15 13:10:44",
      contest: null,
      code: `import bisect
  def solve():
      n=int(input())
      arr=list(map(int,input().split()))
      tails=[]
      for x in arr:
          pos=bisect.bisect_left(tails,x)
          if pos==len(tails): tails.append(x)
          else: tails[pos]=x
      print(len(tails))
  solve()`,
      tc: "Input: 8 / 10 9 2 5 3 7 101 18\nOutput: 4",
    },
    {
      problem: "Matrix Exponentiation",
      id: "QJ-0921",
      verdict: "WA",
      time: "0.41s",
      mem: "16.7 MB",
      lang: "C++",
      diff: "Hard",
      f: "wa",
      at: "2025-03-15 11:48:22",
      contest: "Weekly Contest #42",
      code: `// Bug: wrong base matrix initialization
  // Missing m.a[1][1] = 1
  Matrix mpow(Matrix b,long long p){
      Matrix res(b.n);
      for(int i=0;i<b.n;i++) res.a[i][i]=1;
      while(p){if(p&1)res=res*b;b=b*b;p>>=1;}
      return res;
  }`,
      tc: "Input: 10\nExpected: 55\nGot: 34\nFailed on test #3",
    },
    {
      problem: "Dijkstra with Priority Queue",
      id: "QJ-0512",
      verdict: "AC",
      time: "0.33s",
      mem: "12.4 MB",
      lang: "C++",
      diff: "Medium",
      f: "ac",
      at: "2025-03-14 22:05:11",
      contest: null,
      code: `#include <bits/stdc++.h>
  using namespace std;
  int main(){
      int n,m,s;
      scanf("%d%d%d",&n,&m,&s);
      vector<vector<pair<int,ll>>> g(n+1);
      vector<ll> dist(n+1,1e18);dist[s]=0;
      priority_queue<pli,vector<pli>,greater<pli>> pq;
      pq.push({0,s});
      while(!pq.empty()){...}
  }`,
      tc: "Input: 4 5 1 / 1-2(2) 1-3(5) 2-3(1) 2-4(6) 3-4(2)\nOutput: 0 2 3 5",
    },
    {
      problem: "Segment Tree Lazy Propagation",
      id: "QJ-1105",
      verdict: "TLE",
      time: "2.01s",
      mem: "32.0 MB",
      lang: "Python",
      diff: "Hard",
      f: "other",
      at: "2025-03-14 19:22:55",
      contest: "Weekly Contest #42",
      code: `# TLE: recursive lazy too slow in Python
  class SegTree:
      def push(self,node,l,r):
          if self.lazy[node]!=0:
              self.tree[node]+=self.lazy[node]*(r-l+1)
              if l!=r:
                  self.lazy[2*node]+=self.lazy[node]
                  self.lazy[2*node+1]+=self.lazy[node]
              self.lazy[node]=0`,
      tc: "TLE on test #7\nExpected: < 1.0s\nGot: 2.01s",
    },
    {
      problem: "Two Pointers Technique",
      id: "QJ-0223",
      verdict: "AC",
      time: "0.04s",
      mem: "4.1 MB",
      lang: "C++",
      diff: "Easy",
      f: "ac",
      at: "2025-03-14 16:41:03",
      contest: null,
      code: `int main(){
      int n,target;
      scanf("%d%d",&n,&target);
      vector<int> a(n);
      for(int&x:a)scanf("%d",&x);
      int l=0,cnt=0;ll sum=0;
      for(int r=0;r<n;r++){
          sum+=a[r];
          while(sum>target) sum-=a[l++];
          if(sum==target) cnt++;
      }
      printf("%d\\n",cnt);
  }`,
      tc: "Input: 5 7 / 2 3 1 2 4\nOutput: 2",
    },
    {
      problem: "KMP Pattern Matching",
      id: "QJ-0744",
      verdict: "AC",
      time: "0.09s",
      mem: "6.8 MB",
      lang: "Java",
      diff: "Medium",
      f: "ac",
      at: "2025-03-14 14:18:39",
      contest: null,
      code: `public static int[] computeLPS(String pat){
      int[] lps=new int[pat.length()];
      int len=0,i=1;
      while(i<pat.length()){
          if(pat.charAt(i)==pat.charAt(len)) lps[i++]=++len;
          else if(len!=0) len=lps[len-1];
          else lps[i++]=0;
      }
      return lps;
  }`,
      tc: "Input: ababcabcababababd / ababd\nOutput: 1",
    },
    {
      problem: "Union Find Disjoint Set",
      id: "QJ-0618",
      verdict: "RE",
      time: "—",
      mem: "—",
      lang: "C++",
      diff: "Medium",
      f: "other",
      at: "2025-03-13 23:55:17",
      contest: null,
      code: `// Runtime error: stack overflow
  int find(int x){
      if(par[x]!=x) return find(par[x]);
      return x;
  }`,
      tc: "Runtime Error (SIGSEGV)\nStack overflow on test #12",
    },
    {
      problem: "Fenwick Tree Range Query",
      id: "QJ-0893",
      verdict: "AC",
      time: "0.12s",
      mem: "7.2 MB",
      lang: "C++",
      diff: "Medium",
      f: "ac",
      at: "2025-03-13 21:30:08",
      contest: null,
      code: `struct BIT{
      int n;vector<ll> t;
      BIT(int _n):n(_n),t(_n+1,0){}
      void update(int i,ll d){for(;i<=n;i+=i&-i)t[i]+=d;}
      ll query(int i){ll s=0;for(;i>0;i-=i&-i)s+=t[i];return s;}
  };`,
      tc: "Input: 5 3 / 1 2 3 4 5 / q(1,3) / u(2,10) / q(1,5)\nOutput: 6 / 20",
    },
    {
      problem: "Convex Hull Trick",
      id: "QJ-1178",
      verdict: "WA",
      time: "0.55s",
      mem: "18.9 MB",
      lang: "C++",
      diff: "Hard",
      f: "wa",
      at: "2025-03-13 18:12:44",
      contest: "Weekly Contest #41",
      code: `// Wrong answer: integer division truncation
  bool bad(const Line&l1,const Line&l2,const Line&l3){
      return (l3.c-l1.c)*(l1.m-l2.m)
          <= (l2.c-l1.c)*(l1.m-l3.m);
  }`,
      tc: "Input: 4 / 1 5 / 2 3 / 3 1 / 4 0\nExpected: 0\nGot: 3\nFailed on test #5",
    },
    {
      problem: "BFS Shortest Path",
      id: "QJ-0145",
      verdict: "AC",
      time: "0.08s",
      mem: "10.2 MB",
      lang: "Python",
      diff: "Easy",
      f: "ac",
      at: "2025-03-13 15:44:29",
      contest: null,
      code: `from collections import deque
  def solve():
      n,m=map(int,input().split())
      g=[[] for _ in range(n+1)]
      dist=[-1]*(n+1);dist[1]=0
      q=deque([1])
      while q:
          u=q.popleft()
          for v in g[u]:
              if dist[v]==-1:
                  dist[v]=dist[u]+1;q.append(v)
      print(*dist[1:])
  solve()`,
      tc: "Input: 5 4 / 1 2 / 1 3 / 2 4 / 3 5\nOutput: 0 1 1 2 2",
    },
    {
      problem: "Heavy Light Decomposition",
      id: "QJ-1201",
      verdict: "CE",
      time: "—",
      mem: "—",
      lang: "C++",
      diff: "Hard",
      f: "other",
      at: "2025-03-13 12:08:51",
      contest: "Weekly Contest #41",
      code: `// Compilation Error
  int pos[100005],cur_pos
  
  // Missing semicolon after cur_pos`,
      tc: 'Compilation Error\nLine 2: expected \';\' before identifier',
    },
  ];
  
  export const contests = [
    { id: "WC-42", name: "Weekly Contest #42", date: "2025-03-15", rank: 12, total: 847, solved: "4/5", delta: 63, before: 1784, after: 1847, rated: true },
    { id: "WC-41", name: "Weekly Contest #41", date: "2025-03-08", rank: 18, total: 823, solved: "3/5", delta: 26, before: 1758, after: 1784, rated: true },
    { id: "WC-40", name: "Weekly Contest #40", date: "2025-03-01", rank: 24, total: 801, solved: "3/5", delta: -15, before: 1773, after: 1758, rated: true },
    { id: "MC-08", name: "Monthly Challenge #8", date: "2025-02-22", rank: 31, total: 1245, solved: "6/8", delta: 41, before: 1717, after: 1758, rated: true },
    { id: "WC-39", name: "Weekly Contest #39", date: "2025-02-15", rank: 8, total: 789, solved: "5/5", delta: 52, before: 1665, after: 1717, rated: true },
    { id: "WC-38", name: "Weekly Contest #38", date: "2025-02-08", rank: 15, total: 776, solved: "3/5", delta: 12, before: 1653, after: 1665, rated: true },
    { id: "WC-37", name: "Weekly Contest #37", date: "2025-02-01", rank: 22, total: 754, solved: "3/5", delta: -8, before: 1661, after: 1653, rated: true },
    { id: "MC-07", name: "Monthly Challenge #7", date: "2025-01-25", rank: 45, total: 1189, solved: "5/8", delta: -22, before: 1683, after: 1661, rated: true },
    { id: "WC-36", name: "Weekly Contest #36", date: "2025-01-18", rank: 11, total: 731, solved: "4/5", delta: 35, before: 1648, after: 1683, rated: true },
    { id: "WC-35", name: "Weekly Contest #35", date: "2025-01-11", rank: 19, total: 718, solved: "3/5", delta: 18, before: 1630, after: 1648, rated: true },
    { id: "NR-01", name: "New Year Special", date: "2025-01-01", rank: 6, total: 2103, solved: "7/7", delta: 55, before: 1575, after: 1630, rated: true },
    { id: "PR-03", name: "Practice Round #3", date: "2024-12-28", rank: 42, total: 560, solved: "4/5", delta: 0, before: 1575, after: 1575, rated: false },
    { id: "WC-34", name: "Weekly Contest #34", date: "2024-12-21", rank: 28, total: 698, solved: "3/5", delta: -10, before: 1585, after: 1575, rated: true },
    { id: "WC-33", name: "Weekly Contest #33", date: "2024-12-14", rank: 14, total: 685, solved: "3/5", delta: 22, before: 1563, after: 1585, rated: true },
    { id: "MC-06", name: "Monthly Challenge #6", date: "2024-12-07", rank: 38, total: 1123, solved: "4/8", delta: -14, before: 1577, after: 1563, rated: true },
  ];
  
  export const achievements = [
    { icon: "Zap", label: "First AC", bg: "bg-amber-600/8", color: "text-amber-600", locked: false },
    { icon: "Flame", label: "7-Day Streak", bg: "bg-red-600/6", color: "text-red-600", locked: false },
    { icon: "Star", label: "100 Solved", bg: "bg-amber-500/6", color: "text-amber-500", locked: false },
    { icon: "Crown", label: "Top 50", bg: "bg-amber-600/8", color: "text-amber-600", locked: false },
    { icon: "Code", label: "5 Languages", bg: "bg-blue-600/6", color: "text-blue-600", locked: false },
    { icon: "Rocket", label: "30-Day Streak", bg: "bg-green-600/6", color: "text-green-600", locked: false },
    { icon: "Brain", label: "200 Solved", bg: "bg-violet-600/6", color: "text-violet-600", locked: false },
    { icon: "Gem", label: "All Easy", bg: "bg-green-600/6", color: "text-green-600", locked: false },
    { icon: "Shield", label: "All Medium", bg: "bg-red-600/6", color: "text-red-600", locked: true },
    { icon: "Swords", label: "All Hard", bg: "bg-amber-600/8", color: "text-amber-600", locked: true },
    { icon: "Infinity", label: "100-Day Streak", bg: "bg-blue-600/6", color: "text-blue-600", locked: true },
    { icon: "Trophy", label: "Contest Winner", bg: "bg-amber-500/6", color: "text-amber-500", locked: true },
  ];
  
  export const activities = [
    { type: "solve", problem: "Binary Lifting on Trees", id: "QJ-1042", verdict: "AC", time: "12 min ago" },
    { type: "rating", title: "Reached Expert rating (1847)", change: "+63", time: "1 hour ago" },
    { type: "fail", problem: "Matrix Exponentiation", id: "QJ-0921", verdict: "WA", time: "2 hours ago" },
    { type: "contest", title: "Weekly Contest #42", result: "Rank #12", time: "3 hours ago" },
    { type: "solve", problem: "Dijkstra with Priority Queue", id: "QJ-0512", verdict: "AC", time: "Yesterday" },
    { type: "streak", title: "23-day solving streak", time: "Yesterday" },
    { type: "fail", problem: "Segment Tree Lazy Propagation", id: "QJ-1105", verdict: "TLE", time: "Yesterday" },
    { type: "solve", problem: "Two Pointers Technique", id: "QJ-0223", verdict: "AC", time: "2 days ago" },
    { type: "achievement", title: "Unlocked: 200 Solved", time: "2 days ago" },
    { type: "solve", problem: "KMP Pattern Matching", id: "QJ-0744", verdict: "AC", time: "3 days ago" },
    { type: "fail", problem: "Union Find Disjoint Set", id: "QJ-0618", verdict: "RE", time: "3 days ago" },
    { type: "solve", problem: "Fenwick Tree Range Query", id: "QJ-0893", verdict: "AC", time: "3 days ago" },
    { type: "fail", problem: "Convex Hull Trick", id: "QJ-1178", verdict: "WA", time: "4 days ago" },
    { type: "contest", title: "Weekly Contest #41", result: "Rank #18", time: "5 days ago" },
    { type: "solve", problem: "BFS Shortest Path", id: "QJ-0145", verdict: "AC", time: "5 days ago" },
    { type: "fail", problem: "Heavy Light Decomposition", id: "QJ-1201", verdict: "CE", time: "5 days ago" },
  ];
  
  export const ratingHistory = {
    "6m": [
      { l: "Oct", v: 1620 }, { l: "Nov", v: 1655 }, { l: "Dec", v: 1710 },
      { l: "Jan", v: 1730 }, { l: "Feb", v: 1784 }, { l: "Mar", v: 1847 },
    ],
    "1y": [
      { l: "Apr", v: 1420 }, { l: "May", v: 1480 }, { l: "Jun", v: 1510 },
      { l: "Jul", v: 1490 }, { l: "Aug", v: 1555 }, { l: "Sep", v: 1580 },
      { l: "Oct", v: 1620 }, { l: "Nov", v: 1655 }, { l: "Dec", v: 1710 },
      { l: "Jan", v: 1730 }, { l: "Feb", v: 1784 }, { l: "Mar", v: 1847 },
    ],
    all: [
      { l: "Mar'23", v: 1200 }, { l: "May", v: 1280 }, { l: "Jul", v: 1350 },
      { l: "Sep", v: 1400 }, { l: "Nov", v: 1460 }, { l: "Jan'24", v: 1500 },
      { l: "Mar", v: 1420 }, { l: "May", v: 1480 }, { l: "Jul", v: 1510 },
      { l: "Sep", v: 1580 }, { l: "Nov", v: 1655 }, { l: "Jan'25", v: 1730 },
      { l: "Mar", v: 1847 },
    ],
  };
  
  export const difficulties = [
    { label: "Easy", solved: 89, total: 935, color: "#16a34a", tw: "bg-green-600" },
    { label: "Medium", solved: 112, total: 2033, color: "#d97706", tw: "bg-amber-500" },
    { label: "Hard", solved: 46, total: 920, color: "#dc2626", tw: "bg-red-600" },
  ];
  
