import { getPublicId } from "./shared.service.js";

// make sure user exist
export async function ensureProfileRow(connection, user) {
  await connection.execute(
    `INSERT INTO user_profiles
       (user_id, public_id, rating, rating_delta, rating_tier)
     VALUES (?, ?, 0, 0, 'UNRATED')
     ON DUPLICATE KEY UPDATE user_id = user_id`,
    [
      user.userId,
      getPublicId({ user_id: user.userId, created_at: user.createdAt }),
    ],
  );
}

// Refreshes global rating ranks, clears unrated users rank 
export async function refreshGlobalRanks(connection) {
  await connection.execute(
    `UPDATE user_profiles
     SET global_rank = NULL, rank_delta = 0
     WHERE rating <= 0`,
  );

  const [rows] = await connection.execute(
    `SELECT user_id, global_rank
     FROM user_profiles
     WHERE rating > 0
     ORDER BY rating DESC, solved_count DESC, user_id ASC`,
  );

  // Assign new global ranks and store how much each user's rank changed.
  for (let index = 0; index < rows.length; index += 1) {
    const rank = index + 1;
    const oldRank = Number(rows[index].global_rank) || null;
    const rankDelta = oldRank ? oldRank - rank : 0;

    await connection.execute(
      `UPDATE user_profiles
       SET global_rank = ?, rank_delta = ?
       WHERE user_id = ?`,
      [rank, rankDelta, rows[index].user_id],
    );
  }
}
