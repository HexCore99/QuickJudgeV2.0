import bcrypt from "bcrypt";
import { pool } from "../../config/db.js";
import {
  createServiceError,
  ensureAdminCanChangeContest,
  ensureContestNotEnded,
  formatSqlDateTime,
  generateContestId,
  getContestStatus,
  mapAnnouncementRow,
  mapQueryRow,
} from "./contestShared.service.js";
import {
  getProblemCode,
  getProblemTagsByProblemIds,
  getProblemTestCasesByProblemIds,
  normalizeContestDifficulty,
  normalizeDisplayDifficulty,
  normalizeTags,
  normalizeTestCases,
  replaceContestProblemTags,
  replaceContestProblemTestCases,
} from "./contestProblemSnapshot.service.js";

export async function createContestForAdmin(adminId, payload) {
  const startDate = new Date(payload.startTime);
  const endDate = new Date(payload.endTime);

  // Calculates contest duration in minutes from start and end dates.
  const durationMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (60 * 1000),
  );

  // Builds the contest problem list from detailed problem drafts or simple problem IDs.
  const problemDrafts =
    Array.isArray(payload.problems) && payload.problems.length
      ? payload.problems
      : (payload.problemIds || []).map((problemId) => ({
          sourceProblemId: problemId,
        }));

  const sourceProblemIds = [
    ...new Set(
      problemDrafts
        .map((problem) =>
          Number(problem.sourceProblemId ?? problem.problemId ?? problem.id),
        )
        .filter((problemId) => Number.isInteger(problemId) && problemId > 0),
    ),
  ];

  const requiresPassword = Boolean(payload.requiresPassword);
  const isRated = Boolean(payload.isRated);

  if (isRated && requiresPassword) {
    throw createServiceError("Rated contests must be public.", 400);
  }

  if (!problemDrafts.length || !sourceProblemIds.length) {
    throw createServiceError("Select at least one problem for the contest.", 400);
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction(); //all operation must be succeed together

    const contestId = await generateContestId(connection, payload.title);
    const placeholders = sourceProblemIds.map(() => "?").join(",");

    // get authors and public problems
    const [problemRows] = await connection.execute(
      `SELECT id, author_id, title, statement, input_format, output_format,
              constraints_text, difficulty, points, time_limit_seconds,
              memory_limit_mb, is_published
       FROM problems
       WHERE id IN (${placeholders})
         AND (author_id = ? OR is_published = 1)`,
      [...sourceProblemIds, adminId],
    );

    if (problemRows.length !== sourceProblemIds.length) {
      throw createServiceError(
        "One or more selected problems were not found.",
        400,
      );
    }

    // map problem with id's
    const problemById = problemRows.reduce((acc, problem) => {
      acc[problem.id] = problem;
      return acc;
    }, {});

    const tagsByProblemId = await getProblemTagsByProblemIds(
      connection,
      sourceProblemIds,
    );

    const testCasesByProblemId = await getProblemTestCasesByProblemIds(
      connection,
      sourceProblemIds,
    );

    // Builds the final ordered contest problems using draft overrides or source problem defaults.
    const orderedProblems = problemDrafts.map((draft) => {
      const sourceProblemId = Number(
        draft.sourceProblemId ?? draft.problemId ?? draft.id,
      );
      const source = problemById[sourceProblemId];
      const tags = normalizeTags(
        Array.isArray(draft.tags) && draft.tags.length
          ? draft.tags
          : tagsByProblemId[sourceProblemId] || [],
      );
      const testCases = normalizeTestCases(
        Array.isArray(draft.testCases) && draft.testCases.length
          ? draft.testCases
          : testCasesByProblemId[sourceProblemId] || [],
      );

      if (!testCases.length) {
        throw createServiceError(
          `Contest problem "${source.title}" must include at least one test case.`,
          400,
        );
      }

      return {
        sourceProblemId,
        title:
          typeof draft.title === "string" && draft.title.trim()
            ? draft.title.trim()
            : source.title,
        statement:
          typeof draft.statement === "string" && draft.statement.trim()
            ? draft.statement.trim()
            : source.statement,
        inputFormat:
          typeof draft.inputFormat === "string"
            ? draft.inputFormat.trim() || null
            : source.input_format || null,
        outputFormat:
          typeof draft.outputFormat === "string"
            ? draft.outputFormat.trim() || null
            : source.output_format || null,
        constraints:
          typeof draft.constraints === "string"
            ? draft.constraints.trim() || null
            : source.constraints_text || null,
        difficulty: normalizeDisplayDifficulty(
          draft.difficulty || source.difficulty,
        ),
        points: Number(draft.points) || Number(source.points) || 100,
        timeLimitSeconds:
          Number(draft.timeLimitSeconds) ||
          Number(source.time_limit_seconds) ||
          1,
        memoryLimitMb:
          Number(draft.memoryLimitMb) || Number(source.memory_limit_mb) || 256,
        tags,
        testCases,
      };
    });

    const contestTags = [
      ...new Set(orderedProblems.flatMap((problem) => problem.tags)),
    ].slice(0, 8);

    const passwordHash = requiresPassword
      ? await bcrypt.hash(payload.password.trim(), 12)
      : null;

      // insert contest details into <contests> table
    await connection.execute(
      `INSERT INTO contests
       (id, created_by, name, description, start_time, duration_minutes, status,
        contest_type, problems_count, participants_count, requires_password,
        password_hash, is_rated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        contestId,
        adminId,
        payload.title.trim(),
        payload.description?.trim() || null,
        formatSqlDateTime(startDate),
        durationMinutes,
        getContestStatus(startDate, endDate),
        payload.contestType?.trim() || "Contest",
        orderedProblems.length,
        0,
        requiresPassword ? 1 : 0,
        passwordHash,
        isRated ? 1 : 0,
      ],
    );

    for (const [index, problem] of orderedProblems.entries()) {
      const [contestProblemResult] = await connection.execute(
        // insert problems one by one to contest_problems
        `INSERT INTO contest_problems
         (contest_id, problem_id, problem_code, title, statement, input_format,
          output_format, constraints_text, difficulty, points,
          time_limit_seconds, memory_limit_mb, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          contestId,
          problem.sourceProblemId,
          getProblemCode(index),
          problem.title,
          problem.statement,
          problem.inputFormat,
          problem.outputFormat,
          problem.constraints,
          normalizeContestDifficulty(problem.difficulty),
          problem.points,
          problem.timeLimitSeconds,
          problem.memoryLimitMb,
          index + 1,
        ],
      );

      await replaceContestProblemTags(
        connection,
        contestProblemResult.insertId,
        problem.tags,
      );
      await replaceContestProblemTestCases(
        connection,
        contestProblemResult.insertId,
        problem.testCases,
      );
    }

    // insert tags into contest_tags
    for (const tag of contestTags) {
      await connection.execute(
        `INSERT INTO contest_tags (contest_id, tag_name)
         VALUES (?, ?)`,
        [contestId, tag],
      );
    }

    await connection.commit(); //saves all transactions

    return {
      id: contestId,
      title: payload.title.trim(),
      description: payload.description?.trim() || "",
      startTime: startDate,
      endTime: endDate,
      durationMinutes,
      status: getContestStatus(startDate, endDate),
      problemsCount: orderedProblems.length,
      requiresPassword,
      isRated,
      tags: contestTags,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// update contest Time
export async function updateContestSchedule(
  contestId,
  { startTime, endTime },
  adminId,
) {
  await ensureAdminCanChangeContest(adminId, contestId);

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const durationMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (60 * 1000),
  );

  await pool.execute(
    `UPDATE contests
     SET start_time = ?, duration_minutes = ?, status = ?
     WHERE id = ? AND created_by = ?`,
    [
      formatSqlDateTime(startDate),
      durationMinutes,
      getContestStatus(startDate, endDate),
      contestId,
      adminId,
    ],
  );

  return {
    contestId,
    startTime: startDate,
    endTime: endDate,
    durationMinutes,
  };
}

// Delete Created Contest
export async function deleteContestById(contestId, adminId) {
  const [result] = await pool.execute(
    `DELETE FROM contests WHERE id = ? AND created_by = ?`,
    [contestId, adminId],
  );

  if (!result.affectedRows) {
    throw createServiceError("Contest not found.", 404);
  }

  return {
    contestId,
  };
}

// create new announcements
export async function createContestAnnouncement(contestId, { title, body }) {
  await ensureContestNotEnded(
    contestId,
    "Contest has ended. Announcements cannot be sent.",
  );

  const [result] = await pool.execute(
    `INSERT INTO contest_announcements (contest_id, title, body)
     VALUES (?, ?, ?)`,
    [contestId, title.trim(), body.trim()],
  );

  const [rows] = await pool.execute(
    `SELECT id, title, body, posted_at
     FROM contest_announcements
     WHERE id = ? AND contest_id = ?
     LIMIT 1`,
    [result.insertId, contestId],
  );

  return mapAnnouncementRow(rows[0]);
}

// Updates an announcement if the contest has not ended, then returns the updated announcement.
export async function updateContestAnnouncement(
  contestId,
  announcementId,
  { title, body },
) {
  await ensureContestNotEnded(
    contestId,
    "Contest has ended. Announcements cannot be updated.",
  );

  // get the announcement
  const [existingRows] = await pool.execute(
    `SELECT id
     FROM contest_announcements
     WHERE id = ? AND contest_id = ?
     LIMIT 1`,
    [announcementId, contestId],
  );

  if (!existingRows.length) {
    throw createServiceError("Announcement not found.", 404);
  }

  // udpate announcement
  await pool.execute(
    `UPDATE contest_announcements
     SET title = ?, body = ?
     WHERE id = ? AND contest_id = ?`,
    [title.trim(), body.trim(), announcementId, contestId],
  );

  // read
  const [rows] = await pool.execute(
    `SELECT id, title, body, posted_at
     FROM contest_announcements
     WHERE id = ? AND contest_id = ?
     LIMIT 1`,
    [announcementId, contestId],
  );

  return mapAnnouncementRow(rows[0]);
}

// Deletes an announcement from a specific contest.
export async function deleteContestAnnouncement(contestId, announcementId) {
  const [result] = await pool.execute(
    `DELETE FROM contest_announcements
     WHERE id = ? AND contest_id = ?`,
    [announcementId, contestId],
  );

  if (!result.affectedRows) {
    throw createServiceError("Announcement not found.", 404);
  }

  return {
    id: Number(announcementId),
    contestId,
  };
}

// reply to a specific query in running contest
export async function replyToContestQuery(contestId, queryId, answer) {
  await ensureContestNotEnded(
    contestId,
    "Contest has ended. Query replies cannot be sent.",
  );

  const [result] = await pool.execute(
    `UPDATE contest_queries
     SET answer = ?, status = 'answered', answered_at = CURRENT_TIMESTAMP
     WHERE id = ? AND contest_id = ?`,
    [answer.trim(), queryId, contestId],
  );

  if (!result.affectedRows) {
    throw createServiceError("Query not found for this contest.", 404);
  }

  const [rows] = await pool.execute(
    `SELECT id, user_id, username, question, answer, status, created_at, answered_at
     FROM contest_queries
     WHERE id = ? AND contest_id = ?
     LIMIT 1`,
    [queryId, contestId],
  );

  return mapQueryRow(rows[0]);
}
