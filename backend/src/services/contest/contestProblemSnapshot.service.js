import { pool } from "../../config/db.js";

// convert 0,1,2 -> A,B,C
export function getProblemCode(index) {
  let value = index;
  let code = "";

  do {
    code = String.fromCharCode(65 + (value % 26)) + code;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);

  return code;
}

// Converts difficulty to a valid contest DB value,
export function normalizeContestDifficulty(difficulty) {
  const normalized = String(difficulty || "")
    .trim()
    .toLowerCase();

  if (["easy", "medium", "hard"].includes(normalized)) {
    return normalized;
  }

  return "medium";
}

export function normalizeDisplayDifficulty(difficulty) {
  const normalized = String(difficulty || "")
    .trim()
    .toLowerCase();

  if (normalized === "easy") return "Easy";
  if (normalized === "hard") return "Hard";
  return "Medium";
}

export function normalizeTags(tags = []) {
  return [
    ...new Set(
      tags
        .map((tag) => String(tag).trim())
        .filter(Boolean)
        .slice(0, 20),
    ),
  ];
}

export function normalizeTestCases(testCases = []) {
  return testCases
    .map((testCase, index) => ({
      input: String(testCase.input || ""),
      output: String(testCase.output || ""),
      isHidden: Boolean(testCase.isHidden),
      sortOrder: Number.isInteger(Number(testCase.sortOrder))
        ? Number(testCase.sortOrder)
        : index,
    }))
    .filter((testCase) => testCase.input.trim() || testCase.output.trim());
}

// Returns a map of problem IDs to their tag names.
export async function getProblemTagsByProblemIds(connection, problemIds) {
  if (!problemIds.length) {
    return {};
  }

  const placeholders = problemIds.map(() => "?").join(",");
  const [rows] = await connection.execute(
    `SELECT problem_id, tag_name
     FROM problem_tags
     WHERE problem_id IN (${placeholders})
     ORDER BY id ASC`,
    problemIds,
  );

  return rows.reduce((acc, row) => {
    if (!acc[row.problem_id]) {
      acc[row.problem_id] = [];
    }

    acc[row.problem_id].push(row.tag_name);
    return acc;
  }, {});
}

export async function getProblemTestCasesByProblemIds(connection, problemIds) {
  if (!problemIds.length) {
    return {};
  }

  const placeholders = problemIds.map(() => "?").join(",");
  const [rows] = await connection.execute(
    `SELECT problem_id, input_text, output_text, is_hidden, sort_order
     FROM problem_test_cases
     WHERE problem_id IN (${placeholders})
     ORDER BY sort_order ASC, id ASC`,
    problemIds,
  );

  return rows.reduce((acc, row) => {
    if (!acc[row.problem_id]) {
      acc[row.problem_id] = [];
    }

    acc[row.problem_id].push({
      input: row.input_text,
      output: row.output_text,
      isHidden: Boolean(row.is_hidden),
      sortOrder: row.sort_order,
    });
    return acc;
  }, {});
}

// replace test cases for new contest
export async function replaceContestProblemTestCases(
  connection,
  contestProblemId,
  testCases,
) {
  await connection.execute(
    `DELETE FROM contest_problem_test_cases WHERE contest_problem_id = ?`,
    [contestProblemId],
  );

  for (const testCase of normalizeTestCases(testCases)) {
    await connection.execute(
      `INSERT INTO contest_problem_test_cases
       (contest_problem_id, input_text, output_text, is_hidden, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        contestProblemId,
        testCase.input,
        testCase.output,
        testCase.isHidden ? 1 : 0,
        testCase.sortOrder,
      ],
    );
  }
}

// update tags for contest
export async function replaceContestProblemTags(connection, contestProblemId, tags) {
  await connection.execute(
    `DELETE FROM contest_problem_tags WHERE contest_problem_id = ?`,
    [contestProblemId],
  );

  for (const tag of normalizeTags(tags)) {
    await connection.execute(
      `INSERT INTO contest_problem_tags (contest_problem_id, tag_name)
       VALUES (?, ?)`,
      [contestProblemId, tag],
    );
  }
}

export async function getContestProblemTags(contestProblemId) {
  if (!contestProblemId) {
    return [];
  }

  const [rows] = await pool.execute(
    `SELECT tag_name
     FROM contest_problem_tags
     WHERE contest_problem_id = ?
     ORDER BY id ASC`,
    [contestProblemId],
  );

  return rows.map((row) => row.tag_name);
}

// Returns visible test cases for a contest problem
export async function getPublicContestProblemTestCases(contestProblemId) {
  if (!contestProblemId) {
    return [];
  }

  const [rows] = await pool.execute(
    `SELECT id, input_text, output_text, is_hidden, sort_order
     FROM contest_problem_test_cases
     WHERE contest_problem_id = ? AND is_hidden = 0
     ORDER BY sort_order ASC, id ASC`,
    [contestProblemId],
  );

  return rows.map((row) => ({
    id: row.id,
    input: row.input_text,
    output: row.output_text,
    isHidden: Boolean(row.is_hidden),
    sortOrder: row.sort_order,
  }));
}

// Returns tags from the original problem-bank problem.
export async function getSourceProblemTags(problemId) {
  if (!problemId) {
    return [];
  }

  const [rows] = await pool.execute(
    `SELECT tag_name
     FROM problem_tags
     WHERE problem_id = ?
     ORDER BY id ASC`,
    [problemId],
  );

  return rows.map((row) => row.tag_name);
}

// Returns visible test cases from the original problem-bank problem.
export async function getPublicSourceProblemTestCases(problemId) {
  if (!problemId) {
    return [];
  }

  const [rows] = await pool.execute(
    `SELECT id, input_text, output_text, is_hidden, sort_order
     FROM problem_test_cases
     WHERE problem_id = ? AND is_hidden = 0
     ORDER BY sort_order ASC, id ASC`,
    [problemId],
  );

  return rows.map((row) => ({
    id: row.id,
    input: row.input_text,
    output: row.output_text,
    isHidden: Boolean(row.is_hidden),
    sortOrder: row.sort_order,
  }));
}
