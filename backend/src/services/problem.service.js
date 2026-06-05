import { pool } from "../config/db.js";

let problemTablesReadyPromise = null;
const PROBLEM_LIST_DEFAULT_LIMIT = 10;
const PROBLEM_LIST_MAX_LIMIT = 100;
const PROBLEM_LIST_DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);

function createServiceError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function toPositiveInteger(value, fallback) {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return fallback;
  }

  return numberValue;
}

function normalizeProblemListOptions(options = {}) {
  const hasPagination =
    options.page !== undefined || options.limit !== undefined;
  const page = toPositiveInteger(options.page, 1);
  const limit = Math.min(
    toPositiveInteger(options.limit, PROBLEM_LIST_DEFAULT_LIMIT),
    PROBLEM_LIST_MAX_LIMIT,
  );
  const search = String(options.search || "").trim();
  const difficulty = PROBLEM_LIST_DIFFICULTIES.has(options.difficulty)
    ? options.difficulty
    : null;

  return {
    hasPagination,
    page,
    limit,
    offset: (page - 1) * limit,
    search,
    difficulty,
  };
}

function buildProblemListFilters({ authorId, publicOnly, options }) {
  const conditions = [];
  const values = [];

  if (authorId !== undefined && authorId !== null) {
    conditions.push("p.author_id = ?");
    values.push(authorId);
  }

  if (publicOnly) {
    conditions.push("p.is_published = 1");
  }

  if (options.difficulty) {
    conditions.push("p.difficulty = ?");
    values.push(options.difficulty);
  }

  if (options.search) {
    const searchPattern = `%${options.search}%`;
    conditions.push(
      `(p.title LIKE ? OR EXISTS (
        SELECT 1
        FROM problem_tags pt
        WHERE pt.problem_id = p.id AND pt.tag_name LIKE ?
      ))`,
    );
    values.push(searchPattern, searchPattern);
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    values,
  };
}

// create table if missing
async function createProblemTables() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS problems (
      id INT AUTO_INCREMENT PRIMARY KEY,
      author_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      statement TEXT NOT NULL,
      input_format TEXT NULL,
      output_format TEXT NULL,
      constraints_text TEXT NULL,
      difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL DEFAULT 'Medium',
      points INT NOT NULL DEFAULT 100,
      time_limit_seconds DECIMAL(6, 2) NOT NULL DEFAULT 1.00,
      memory_limit_mb INT NOT NULL DEFAULT 256,
      has_editorial TINYINT(1) NOT NULL DEFAULT 0,
      is_published TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_problems_author_id (author_id),
      CONSTRAINT fk_problems_author
        FOREIGN KEY (author_id) REFERENCES users(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS problem_tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      problem_id INT NOT NULL,
      tag_name VARCHAR(100) NOT NULL,
      UNIQUE KEY uniq_problem_tag (problem_id, tag_name),
      INDEX idx_problem_tags_problem_id (problem_id),
      CONSTRAINT fk_problem_tags_problem
        FOREIGN KEY (problem_id) REFERENCES problems(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS problem_test_cases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      problem_id INT NOT NULL,
      input_text TEXT NOT NULL,
      output_text TEXT NOT NULL,
      is_hidden TINYINT(1) NOT NULL DEFAULT 0,
      sort_order INT NOT NULL DEFAULT 0,
      INDEX idx_problem_test_cases_problem_id (problem_id),
      CONSTRAINT fk_problem_test_cases_problem
        FOREIGN KEY (problem_id) REFERENCES problems(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS problem_editorials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      problem_id INT NOT NULL,
      markdown_content TEXT NULL,
      code_content TEXT NULL,
      video_link VARCHAR(500) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_problem_editorial (problem_id),
      INDEX idx_problem_editorials_problem_id (problem_id),
      CONSTRAINT fk_problem_editorials_problem
        FOREIGN KEY (problem_id) REFERENCES problems(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  const [publicationColumnRows] = await pool.execute(
    `SHOW COLUMNS FROM problems LIKE 'is_published'`,
  );

  if (!publicationColumnRows.length) {
    await pool.execute(`
      ALTER TABLE problems
      ADD COLUMN is_published TINYINT(1) NOT NULL DEFAULT 0
      AFTER has_editorial
    `);
  }
}

// problem table handler
export async function ensureProblemTables() {
  if (!problemTablesReadyPromise) {
    problemTablesReadyPromise = createProblemTables();
  }

  return problemTablesReadyPromise;
}

// [" dp ", "graphs", "", "dp", " math "] -> ["dp", "graphs", "math"]
function normalizeTags(tags = []) {
  return [
    ...new Set(
      tags
        .map((tag) => String(tag).trim())
        .filter(Boolean)
        .slice(0, 20),
    ),
  ];
}

function normalizeTestCases(testCases = []) {
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

function mapProblemRow(row, tags = []) {
  return {
    id: row.id,
    authorId: row.author_id,
    title: row.title,
    statement: row.statement,
    inputFormat: row.input_format || "",
    outputFormat: row.output_format || "",
    constraints: row.constraints_text || "",
    difficulty: row.difficulty,
    points: row.points,
    timeLimitSeconds: Number(row.time_limit_seconds),
    memoryLimitMb: row.memory_limit_mb,
    hasEditorial: Boolean(row.has_editorial),
    isPublished: Boolean(row.is_published),
    tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTestCaseRow(row) {
  return {
    id: row.id,
    input: row.input_text,
    output: row.output_text,
    isHidden: Boolean(row.is_hidden),
    sortOrder: row.sort_order,
  };
}

function mapEditorialRow(row) {
  return {
    id: row?.id || null,
    problemId: row?.problem_id || null,
    markdownContent: row?.markdown_content || "",
    codeContent: row?.code_content || "",
    videoLink: row?.video_link || "",
    createdAt: row?.created_at || null,
    updatedAt: row?.updated_at || null,
  };
}

// groups tag rows by problem_id
async function getTagsByProblemIds(problemIds) {
  if (!problemIds.length) {
    return {};
  }

  const placeholders = problemIds.map(() => "?").join(",");
  // fetch tags and id from <problem_tags>
  const [rows] = await pool.execute(
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

async function replaceProblemTags(connection, problemId, tags) {
  await connection.execute(`DELETE FROM problem_tags WHERE problem_id = ?`, [
    problemId,
  ]);

  for (const tag of normalizeTags(tags)) {
    await connection.execute(
      `INSERT INTO problem_tags (problem_id, tag_name)
       VALUES (?, ?)`,
      [problemId, tag],
    );
  }
}

async function replaceProblemTestCases(connection, problemId, testCases) {
  await connection.execute(
    `DELETE FROM problem_test_cases WHERE problem_id = ?`,
    [problemId],
  );

  for (const testCase of normalizeTestCases(testCases)) {
    await connection.execute(
      `INSERT INTO problem_test_cases
       (problem_id, input_text, output_text, is_hidden, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        problemId,
        testCase.input,
        testCase.output,
        testCase.isHidden ? 1 : 0,
        testCase.sortOrder,
      ],
    );
  }
}

async function ensureAuthorOwnsProblem(connection, authorId, problemId) {
  const [rows] = await connection.execute(
    `SELECT id
     FROM problems
     WHERE id = ? AND author_id = ?
     LIMIT 1`,
    [problemId, authorId],
  );

  if (!rows.length) {
    throw createServiceError("Problem not found.", 404);
  }
}

async function getProblemList({ authorId, publicOnly = false, options = {} }) {
  await ensureProblemTables();

  const listOptions = normalizeProblemListOptions(options);
  const filters = buildProblemListFilters({
    authorId,
    publicOnly,
    options: listOptions,
  });
  const listValues = [...filters.values];
  let listSql = `SELECT p.id, p.author_id, p.title, p.statement, p.input_format,
            p.output_format, p.constraints_text, p.difficulty, p.points,
            p.time_limit_seconds, p.memory_limit_mb, p.has_editorial,
            p.is_published, p.created_at, p.updated_at
     FROM problems p
     ${filters.whereClause}
     ORDER BY p.updated_at DESC, p.id DESC`;

  if (listOptions.hasPagination) {
    listSql += ` LIMIT ? OFFSET ?`;
    listValues.push(listOptions.limit, listOptions.offset);
  }

  const [rows] = await pool.execute(listSql, listValues);

  const tagsByProblemId = await getTagsByProblemIds(rows.map((row) => row.id));
  const items = rows.map((row) =>
    mapProblemRow(row, tagsByProblemId[row.id] || []),
  );
  let totalItems = items.length;

  if (listOptions.hasPagination) {
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM problems p
       ${filters.whereClause}`,
      filters.values,
    );

    totalItems = Number(countRows[0]?.total) || 0;
  }

  const totalPages = listOptions.hasPagination
    ? Math.max(Math.ceil(totalItems / listOptions.limit), 1)
    : 1;

  return {
    items,
    pagination: {
      page: listOptions.page,
      limit: listOptions.hasPagination ? listOptions.limit : totalItems,
      totalItems,
      totalPages,
    },
  };
}

export async function getProblemsForAuthor(authorId, options = {}) {
  return getProblemList({ authorId, options });
}

// fetch the problems which are public
export async function getProblemBankItems(options = {}) {
  return getProblemList({ publicOnly: true, options });
}

// fetch specific problem details for author
export async function getProblemForAuthor(authorId, problemId) {
  await ensureProblemTables();

  const [rows] = await pool.execute(
    `SELECT id, author_id, title, statement, input_format, output_format,
            constraints_text, difficulty, points, time_limit_seconds,
            memory_limit_mb, has_editorial, is_published, created_at, updated_at
     FROM problems
     WHERE id = ? AND author_id = ?
     LIMIT 1`,
    [problemId, authorId],
  );

  if (!rows.length) {
    throw createServiceError("Problem not found.", 404);
  }

  const problemIdNumber = rows[0].id;
  const tagsByProblemId = await getTagsByProblemIds([problemIdNumber]);
  const [testCaseRows] = await pool.execute(
    `SELECT id, input_text, output_text, is_hidden, sort_order
     FROM problem_test_cases
     WHERE problem_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [problemIdNumber],
  );

  return {
    ...mapProblemRow(rows[0], tagsByProblemId[problemIdNumber] || []),
    testCases: testCaseRows.map(mapTestCaseRow),
  };
}

// fetch specific problem details available in ProblemBank
export async function getProblemBankItemById(problemId) {
  await ensureProblemTables();

  const [rows] = await pool.execute(
    `SELECT id, author_id, title, statement, input_format, output_format,
            constraints_text, difficulty, points, time_limit_seconds,
            memory_limit_mb, has_editorial, is_published, created_at, updated_at
     FROM problems
     WHERE id = ? AND is_published = 1
     LIMIT 1`,
    [problemId],
  );

  if (!rows.length) {
    throw createServiceError("Problem not found.", 404);
  }

  const problemIdNumber = rows[0].id;
  const tagsByProblemId = await getTagsByProblemIds([problemIdNumber]);
  const [testCaseRows] = await pool.execute(
    `SELECT id, input_text, output_text, is_hidden, sort_order
     FROM problem_test_cases
     WHERE problem_id = ? AND is_hidden = 0
     ORDER BY sort_order ASC, id ASC`,
    [problemIdNumber],
  );

  return {
    ...mapProblemRow(rows[0], tagsByProblemId[problemIdNumber] || []),
    testCases: testCaseRows.map(mapTestCaseRow),
  };
}

// fetches a problem that an admin is allowed to clone
export async function getProblemCloneSourceForAdmin(adminId, problemId) {
  await ensureProblemTables();

  // fetch public or owned problem.
  const [rows] = await pool.execute(
    `SELECT id, author_id, title, statement, input_format, output_format,
            constraints_text, difficulty, points, time_limit_seconds,
            memory_limit_mb, has_editorial, is_published, created_at, updated_at
     FROM problems
     WHERE id = ? AND (author_id = ? OR is_published = 1)
     LIMIT 1`,
    [problemId, adminId],
  );

  if (!rows.length) {
    throw createServiceError("Problem not found.", 404);
  }

  // this part fetches the selected problem’s tags and test cases
  const problemIdNumber = rows[0].id;
  const tagsByProblemId = await getTagsByProblemIds([problemIdNumber]);
  const [testCaseRows] = await pool.execute(
    `SELECT id, input_text, output_text, is_hidden, sort_order
     FROM problem_test_cases
     WHERE problem_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [problemIdNumber],
  );

  return {
    ...mapProblemRow(rows[0], tagsByProblemId[problemIdNumber] || []),
    testCases: testCaseRows.map(mapTestCaseRow),
  };
}

// creates a new problem, saves its tags and test cases inside one transaction, then returns the full saved problem.
export async function createProblemForAuthor(authorId, payload) {
  await ensureProblemTables();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO problems
       (author_id, title, statement, input_format, output_format,
        constraints_text, difficulty, points, time_limit_seconds,
        memory_limit_mb, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        authorId,
        payload.title.trim(),
        payload.statement.trim(),
        payload.inputFormat?.trim() || null,
        payload.outputFormat?.trim() || null,
        payload.constraints?.trim() || null,
        payload.difficulty,
        Number(payload.points),
        Number(payload.timeLimitSeconds),
        Number(payload.memoryLimitMb),
        payload.isPublished ? 1 : 0,
      ],
    );

    await replaceProblemTags(connection, result.insertId, payload.tags || []);
    await replaceProblemTestCases(
      connection,
      result.insertId,
      payload.testCases || [],
    );

    await connection.commit();

    const problem = await getProblemForAuthor(authorId, result.insertId);

    return problem;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// update problem owned by author
export async function updateProblemForAuthor(authorId, problemId, payload) {
  await ensureProblemTables();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await ensureAuthorOwnsProblem(connection, authorId, problemId);
    const publicationValue =
      typeof payload.isPublished === "boolean"
        ? payload.isPublished
          ? 1
          : 0
        : null;

    await connection.execute(
      `UPDATE problems
       SET title = ?,
           statement = ?,
           input_format = ?,
           output_format = ?,
           constraints_text = ?,
           difficulty = ?,
           points = ?,
           time_limit_seconds = ?,
           memory_limit_mb = ?,
           is_published = COALESCE(?, is_published)
       WHERE id = ? AND author_id = ?`,
      [
        payload.title.trim(),
        payload.statement.trim(),
        payload.inputFormat?.trim() || null,
        payload.outputFormat?.trim() || null,
        payload.constraints?.trim() || null,
        payload.difficulty,
        Number(payload.points),
        Number(payload.timeLimitSeconds),
        Number(payload.memoryLimitMb),
        publicationValue,
        problemId,
        authorId,
      ],
    );

    await replaceProblemTags(connection, problemId, payload.tags || []);
    await replaceProblemTestCases(
      connection,
      problemId,
      payload.testCases || [],
    );

    await connection.commit();
    return getProblemForAuthor(authorId, problemId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
//publishes or unpublishes one problem owned by author
export async function updateProblemPublicationForAuthor(
  authorId,
  problemId,
  isPublished,
) {
  await ensureProblemTables();

  const [result] = await pool.execute(
    `UPDATE problems
     SET is_published = ?
     WHERE id = ? AND author_id = ?`,
    [isPublished ? 1 : 0, problemId, authorId],
  );

  if (!result.affectedRows) {
    throw createServiceError("Problem not found.", 404);
  }

  return getProblemForAuthor(authorId, problemId);
}

export async function deleteProblemForAuthor(authorId, problemId) {
  await ensureProblemTables();

  const [result] = await pool.execute(
    `DELETE FROM problems
     WHERE id = ? AND author_id = ?`,
    [problemId, authorId],
  );

  if (!result.affectedRows) {
    throw createServiceError("Problem not found.", 404);
  }

  return {
    id: Number(problemId),
  };
}

export async function getEditorialForAuthor(authorId, problemId) {
  await ensureProblemTables();

  const connection = await pool.getConnection();

  try {
    await ensureAuthorOwnsProblem(connection, authorId, problemId);

    const [rows] = await connection.execute(
      `SELECT id, problem_id, markdown_content, code_content, video_link,
              created_at, updated_at
       FROM problem_editorials
       WHERE problem_id = ?
       LIMIT 1`,
      [problemId],
    );

    return rows.length
      ? mapEditorialRow(rows[0])
      : {
          ...mapEditorialRow(null),
          problemId: Number(problemId),
        };
  } finally {
    connection.release();
  }
}

export async function saveEditorialForAuthor(authorId, problemId, payload) {
  await ensureProblemTables();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await ensureAuthorOwnsProblem(connection, authorId, problemId);

    const markdownContent = payload.markdownContent?.trim() || null;
    const codeContent = payload.codeContent?.trim() || null;
    const videoLink = payload.videoLink?.trim() || null;

    await connection.execute(
      `INSERT INTO problem_editorials
       (problem_id, markdown_content, code_content, video_link)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         markdown_content = VALUES(markdown_content),
         code_content = VALUES(code_content),
         video_link = VALUES(video_link)`,
      [problemId, markdownContent, codeContent, videoLink],
    );

    await connection.execute(
      `UPDATE problems
       SET has_editorial = 1
       WHERE id = ? AND author_id = ?`,
      [problemId, authorId],
    );

    await connection.commit();
    return getEditorialForAuthor(authorId, problemId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
