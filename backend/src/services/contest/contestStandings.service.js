const WRONG_SUBMISSION_PENALTY_MINUTES = 20;

// calculate penalty time
function getPenaltyMinutes(contestStartTime, submittedAt) {
  const start = new Date(contestStartTime).getTime();
  const submitted = new Date(submittedAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(submitted)) {
    return 0;
  }

  return Math.max(0, Math.floor((submitted - start) / (60 * 1000)));
}

function isAcceptedVerdict(verdict) {
  return verdict === "AC" || verdict === "Accepted";
}

function getTimeValue(value) {
  if (!value) return null;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

// Compares two times in ascending order, putting null/invalid times last.
function compareNullableTimeAsc(aValue, bValue) {
  const aTime = getTimeValue(aValue);
  const bTime = getTimeValue(bValue);

  if (aTime === null && bTime === null) return 0;
  if (aTime === null) return 1; //b fiirst
  if (bTime === null) return -1;// a first
  return aTime - bTime;
}

export function sameStandingRank(a, b) {
  return (
    a.points === b.points &&
    a.penalty === b.penalty &&
    a.solved === b.solved &&
    compareNullableTimeAsc(a.lastAcceptedAt, b.lastAcceptedAt) === 0
  );
}

export function buildContestStandings(submissions, contestStartTime, currentUserId) {
  const participants = new Map();

  // create Participant stats
  for (const row of submissions) {
    const userId = Number(row.user_id);

    // create participant entry once
    if (!participants.has(userId)) {
      participants.set(userId, {
        userId,
        username: row.username || "Unknown",
        solved: 0,
        points: 0,
        penalty: 0,
        lastAcceptedAt: null,
        problems: new Map(),
      });
    }

    const participant = participants.get(userId);
    const problemCode = row.problem_code;

    // create problem entry for first attempt
    if (!participant.problems.has(problemCode)) {
      participant.problems.set(problemCode, {
        accepted: false,
        wrongBeforeAccepted: 0,
        points: Number(row.points) || 0,
      });
    }

    const problem = participant.problems.get(problemCode);

    if (problem.accepted) {
      continue;
    }

    // if problem get accepted update user Stats
    if (isAcceptedVerdict(row.verdict)) {
      problem.accepted = true;
      participant.solved += 1;
      participant.points += problem.points;
      participant.penalty +=
        getPenaltyMinutes(contestStartTime, row.submitted_at) +
        problem.wrongBeforeAccepted * WRONG_SUBMISSION_PENALTY_MINUTES;

        // Stores the latest accepted submission time for this participant.
      if (
        !participant.lastAcceptedAt ||
        compareNullableTimeAsc(participant.lastAcceptedAt, row.submitted_at) < 0
      ) {
        participant.lastAcceptedAt = row.submitted_at;
      }
    } else {
      problem.wrongBeforeAccepted += 1;
    }
  }

  // sort users by points,penalty,solved,lastAccepted time
  const standings = [...participants.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (a.penalty !== b.penalty) return a.penalty - b.penalty;
    if (b.solved !== a.solved) return b.solved - a.solved;
    const lastAcceptedComparison = compareNullableTimeAsc(
      a.lastAcceptedAt,
      b.lastAcceptedAt,
    );
    if (lastAcceptedComparison !== 0) return lastAcceptedComparison;
    return a.userId - b.userId;
  });

  let previous = null;
  let currentRank = 0;

  // map and return result
  return standings.map((participant, index) => {
    const tiedWithPrevious = previous && sameStandingRank(previous, participant);

    if (!tiedWithPrevious) {
      currentRank = index + 1;
    }

    previous = participant;

    return {
      rank: currentRank,
      userId: participant.userId,
      username: participant.username,
      solved: participant.solved,
      points: participant.points,
      penalty: participant.penalty,
      lastAcceptedAt: participant.lastAcceptedAt,
      isMe: participant.userId === Number(currentUserId),
    };
  });
}
