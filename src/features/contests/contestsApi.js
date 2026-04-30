import {
  getMockContestAnnouncements,
  getMockContestDetails,
  getMockContestLeaderboard,
  getMockContestQueries,
  getMockContestSubmissions,
  getMockContests,
  getMockRegisterUpcomingContest,
  getMockSubmitContestQuery,
  getMockVerifyContestPassword,
} from "./contestMockData";

export async function getContestsApi() {
  return getMockContests();
}

export async function registerUpcomingContestApi(contestId) {
  return getMockRegisterUpcomingContest(contestId);
}

export async function verifyContestPasswordApi({ contestId, password }) {
  return getMockVerifyContestPassword({ contestId, password });
}

export async function getContestDetailsApi(contestId) {
  return getMockContestDetails(contestId);
}

export async function getContestLeaderboardApi(contestId) {
  return getMockContestLeaderboard(contestId);
}

export async function getContestSubmissionsApi(contestId) {
  return getMockContestSubmissions(contestId);
}

export async function getContestAnnouncementsApi(contestId) {
  return getMockContestAnnouncements(contestId);
}

export async function getContestQueriesApi(contestId) {
  return getMockContestQueries(contestId);
}

export async function submitContestQueryApi({ contestId, question }) {
  return getMockSubmitContestQuery({ contestId, question });
}
