const WRONG_SUBMISSION_PENALTY_MINUTES = 20;

function getPenaltyMinutes(contestStartTime, submittedAt) {
  const start = new Date(contestStartTime).getTime();
  const submitted = new Date(submittedAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(submitted)) {
    return 0;
  }

  return Math.max(0, Math.floor((submitted - start) / (60 * 1000)));
}

function getTimeValue(value) {
  if (!value) return null;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function compareNullableTimeAsc(aValue, bValue) {
  const aTime = getTimeValue(aValue);
  const bTime = getTimeValue(bValue);

  if (aTime === null && bTime === null) return 0;
  if (aTime === null) return 1;
  if (bTime === null) return -1;
  return aTime - bTime;
}

function sameStandingRank(a, b) {
  return (
    a.totalPoints === b.totalPoints &&
    a.totalPenalty === b.totalPenalty &&
    a.solved === b.solved &&
    compareNullableTimeAsc(a.lastAcceptedAt, b.lastAcceptedAt) === 0
  );
}

// Builds ranked contest standings from scored submissions for contests
export function buildStandings(submissions, contestStartTime) {
  const participants = new Map();

  for (const row of submissions) {
    const userId = Number(row.user_id);

    // create participant entry if not exist
    if (!participants.has(userId)) {
      participants.set(userId, {
        userId,
        username: row.username,
        createdAt: row.created_at,
        solved: 0,
        totalPoints: 0,
        totalPenalty: 0,
        lastAcceptedAt: null,
        problems: new Map(),
      });
    }

    const participant = participants.get(userId);
    const problemCode = row.problem_code;

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

    // if problem accepted, update the user entry
    if (row.verdict === "Accepted") {
      problem.accepted = true;
      participant.solved += 1;
      participant.totalPoints += problem.points;
      participant.totalPenalty +=
        getPenaltyMinutes(contestStartTime, row.submitted_at) +
        problem.wrongBeforeAccepted * WRONG_SUBMISSION_PENALTY_MINUTES;

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

  // calculate user position
  const standings = [...participants.values()].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.totalPenalty !== b.totalPenalty) return a.totalPenalty - b.totalPenalty;
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

  return standings.map((participant, index) => {
    const tiedWithPrevious = previous && sameStandingRank(previous, participant);//if tie ,share same rank

    if (!tiedWithPrevious) {
      currentRank = index + 1;
    }

    previous = participant;

    return {
      ...participant,
      rank: currentRank,
    };
  });
}
