import { pool } from "../../config/db.js";
import {
  calculateNewRating,
  calculateRatingDelta,
  getEffectiveOldRating,
} from "./ratingMath.service.js";
import {
  ensureProfileRow,
  refreshGlobalRanks,
} from "./profileRating.service.js";
import {
  createServiceError,
  formatSqlDate,
  getRatingTier,
} from "./shared.service.js";
import { buildStandings } from "./standings.service.js";

// Counts users whose rating result has already been finalized for this contest.
async function getFinalizedParticipantCount(connection, contestId) {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS finalized_count
     FROM user_contests
     WHERE contest_code = ?
       AND is_rated = 1
       AND rating_after IS NOT NULL`,
    [contestId],
  );

  return Number(rows[0]?.finalized_count) || 0;
}

export async function finalizeContestRatingWithConnection(
  connection,
  contestId,
  { force = false, refreshRanks = true } = {},
) {
  // get rating_finalized status e,g-> 2026-05-24 18:30:00
  const [contestRows] = await connection.execute(
    `SELECT id, name, start_time, status, requires_password, is_rated,
            problems_count, rating_finalized_at
     FROM contests
     WHERE id = ?
     LIMIT 1
     FOR UPDATE`,
    [contestId],
  );

  if (!contestRows.length) {
    throw createServiceError("Contest not found.", 404);
  }

  const contest = contestRows[0];

  // Return finalized result if  contest was already rated and recalculation is not forced.
  if (contest.rating_finalized_at && !force) {
    const finalizedCount = await getFinalizedParticipantCount(
      connection,
      contestId,
    );

    return {
      contestId,
      alreadyFinalized: true,
      participantsUpdated: finalizedCount,
    };
  }

  if (contest.status !== "past") {
    throw createServiceError("Only past contests can be rated.", 400);
  }

  if (!contest.is_rated) {
    throw createServiceError("This contest is not marked as rated.", 400);
  }

  if (contest.requires_password) {
    throw createServiceError("Private contests cannot be rated.", 400);
  }

  const [alreadyFinalizedRows] = await connection.execute(
    `SELECT id
     FROM user_contests
     WHERE contest_code = ?
       AND is_rated = 1
       AND rating_after IS NOT NULL
     LIMIT 1
     FOR UPDATE`,
    [contestId],
  );

  // If finalized rating rows already exist, mark the contest finalized
  if (alreadyFinalizedRows.length > 0 && !force) {
    const finalizedCount = await getFinalizedParticipantCount(
      connection,
      contestId,
    );

    await connection.execute(
      `UPDATE contests
       SET rating_finalized_at = COALESCE(rating_finalized_at, CURRENT_TIMESTAMP)
       WHERE id = ?`,
      [contestId],
    );

    if (refreshRanks) {
      await refreshGlobalRanks(connection);
    }

    return {
      contestId,
      alreadyFinalized: true,
      participantsUpdated: finalizedCount,
    };
  }

  // Otherwise
  const [problemCountRows] = await connection.execute(
    `SELECT COUNT(*) AS total_problems
     FROM contest_problems
     WHERE contest_id = ?`,
    [contestId],
  );

  const totalProblems =
    Number(contest.problems_count) ||
    Number(problemCountRows[0]?.total_problems) ||
    0;

    // Loads scored contest submissions with user info and problem points
  const [submissionRows] = await connection.execute(
    `SELECT s.user_id, u.name AS username, u.created_at, s.problem_code,
            COALESCE(cp.points, 0) AS points, s.verdict, s.submitted_at
     FROM contest_submissions s
     INNER JOIN users u ON u.id = s.user_id
     LEFT JOIN contest_problems cp
       ON cp.contest_id = s.contest_id
      AND cp.problem_code = s.problem_code
     WHERE s.contest_id = ?
       AND s.is_scored = 1
     ORDER BY s.user_id ASC, s.problem_code ASC, s.submitted_at ASC, s.id ASC`,
    [contestId],
  );

  const standings = buildStandings(submissionRows, contest.start_time); //make contest standings
  const totalParticipants = standings.length;
  const contestDate = formatSqlDate(contest.start_time);
  const results = [];

  for (const participant of standings) {
    const user = {
      userId: participant.userId,
      createdAt: participant.createdAt,
    };

    await ensureProfileRow(connection, user); //check if the user exists or not

    const [profileRows] = await connection.execute(
      `SELECT rating
       FROM user_profiles
       WHERE user_id = ?
       LIMIT 1
       FOR UPDATE`,
      [participant.userId],
    );

    const storedOldRating = Number(profileRows[0]?.rating) || 0;
    const shouldApplyBaseline = totalParticipants > 1;
    const effectiveOldRating = shouldApplyBaseline
      ? getEffectiveOldRating(storedOldRating)
      : storedOldRating;

    // calculate rating change
    const ratingDelta = calculateRatingDelta(
      participant.rank,
      totalParticipants,
    );

    // old or base rating + delta
    const newRating = calculateNewRating(storedOldRating, ratingDelta, {
      applyBaseline: shouldApplyBaseline,
    });

    const ratingTier = getRatingTier(newRating); //Master,elite,expert

    // Creates or updates this participant's finalized contest leaderboard row.
    await connection.execute(
      `INSERT INTO contest_leaderboard
         (contest_id, user_id, username, solved, total_points, total_penalty,
          last_accepted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         username = VALUES(username),
         solved = VALUES(solved),
         total_points = VALUES(total_points),
         total_penalty = VALUES(total_penalty),
         last_accepted_at = VALUES(last_accepted_at)`,
      [
        contestId,
        participant.userId,
        participant.username,
        participant.solved,
        participant.totalPoints,
        participant.totalPenalty,
        participant.lastAcceptedAt,
      ],
    );

// Saves or updates this user's final result for the contest.
    await connection.execute(
      `INSERT INTO contest_results
         (user_id, contest_id, participated, rank_position,
          total_participants, solved_count)
       VALUES (?, ?, 1, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         participated = 1,
         rank_position = VALUES(rank_position),
         total_participants = VALUES(total_participants),
         solved_count = VALUES(solved_count)`,
      [
        participant.userId,
        contestId,
        participant.rank,
        totalParticipants,
        participant.solved,
      ],
    );

    // Saves or updates this user's rated contest history entry.
    await connection.execute(
      `INSERT INTO user_contests
         (user_id, contest_code, contest_name, contest_date, rank_position,
          participants_count, solved_count, total_problems, rating_delta,
          rating_before, rating_after, is_rated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
         contest_name = VALUES(contest_name),
         contest_date = VALUES(contest_date),
         rank_position = VALUES(rank_position),
         participants_count = VALUES(participants_count),
         solved_count = VALUES(solved_count),
         total_problems = VALUES(total_problems),
         rating_delta = VALUES(rating_delta),
         rating_before = VALUES(rating_before),
         rating_after = VALUES(rating_after),
         is_rated = 1`,
      [
        participant.userId,
        contestId,
        contest.name,
        contestDate,
        participant.rank,
        totalParticipants,
        participant.solved,
        totalProblems,
        ratingDelta,
        storedOldRating,
        newRating,
      ],
    );

    // update user rating history
    await connection.execute(
      `INSERT INTO user_rating_history
         (user_id, rating_date, rating, label)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         rating = VALUES(rating),
         label = VALUES(label)`,
      [participant.userId, contestDate, newRating, contestId],
    );

    await connection.execute(
      `INSERT INTO user_activities
         (user_id, activity_type, title, rating_change, contest_code,
          contest_name, result_text)
       VALUES (?, 'rating', ?, ?, ?, ?, ?)`,
      [
        participant.userId,
        `Rating updated after ${contest.name}`,
        ratingDelta,
        contestId,
        contest.name,
        `Rank #${participant.rank} of ${totalParticipants}`,
      ],
    );

    // update user profiles
    await connection.execute(
      `UPDATE user_profiles
       SET rating = ?,
           rating_delta = ?,
           rating_tier = ?,
           contest_count = contest_count + 1,
           rated_contest_count = rated_contest_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`,
      [newRating, ratingDelta, ratingTier, participant.userId],
    );

    results.push({
      userId: participant.userId,
      username: participant.username,
      rank: participant.rank,
      solved: participant.solved,
      points: participant.totalPoints,
      penalty: participant.totalPenalty,
      lastAcceptedAt: participant.lastAcceptedAt,
      oldRating: storedOldRating,
      effectiveOldRating,
      newRating,
      ratingDelta,
    });
  }

  // udpate contest data
  await connection.execute(
    `UPDATE contests
     SET participants_count = ?,
         rating_finalized_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [totalParticipants, contestId],
  );

  // after finalizing rank, update global rank
  if (refreshRanks) {
    await refreshGlobalRanks(connection);
  }

  return {
    contestId,
    alreadyFinalized: false,
    participantsUpdated: totalParticipants,
    results,
  };
}

// Runs contest rating finalization inside a database transaction.
export async function finalizePublicContestRating(contestId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await finalizeContestRatingWithConnection(
      connection,
      contestId,
    );
    await connection.commit();
    return result;
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      //
    }

    throw error;
  } finally {
    connection.release();
  }
}


//FOR UPDATE -> locks the selected rows inside a transaction.