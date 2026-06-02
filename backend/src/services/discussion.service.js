import { pool } from "../config/db.js";

function createServiceError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function mapReplyRow(row) {
  return {
    id: row.id,
    parentReplyId: row.parent_reply_id,
    userId: row.author_id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPostRow(row, replies = []) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    authorId: row.author_id,
    authorName: row.author_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    replies,
  };
}

async function getRepliesByDiscussionIds(discussionIds) {
  if (!discussionIds.length) {
    return {};
  }

  const placeholders = discussionIds.map(() => "?").join(",");
  const [rows] = await pool.execute(
    `SELECT
       r.id,
       r.discussion_id,
       r.parent_reply_id,
       r.author_id,
       u.name AS author_name,
       r.body,
       r.created_at,
       r.updated_at
     FROM discussion_replies r
     INNER JOIN users u ON u.id = r.author_id
     WHERE r.discussion_id IN (${placeholders})
     ORDER BY r.created_at ASC, r.id ASC`,
    discussionIds,
  );

  return rows.reduce((acc, row) => {
    if (!acc[row.discussion_id]) {
      acc[row.discussion_id] = [];
    }

    acc[row.discussion_id].push(mapReplyRow(row));
    return acc;
  }, {});
}

async function ensureDiscussionOwner(userId, userRole, discussionId) {
  const [rows] = await pool.execute(
    `SELECT author_id
     FROM discussion_posts
     WHERE id = ?
     LIMIT 1`,
    [discussionId],
  );

  if (!rows.length) {
    throw createServiceError("Discussion not found.", 404);
  }

  if (userRole !== "admin" && rows[0].author_id !== userId) {
    throw createServiceError("You can only modify your own discussion.", 403);
  }
}

async function ensureReplyOwner(userId, userRole, discussionId, replyId) {
  const [rows] = await pool.execute(
    `SELECT author_id
     FROM discussion_replies
     WHERE id = ? AND discussion_id = ?
     LIMIT 1`,
    [replyId, discussionId],
  );

  if (!rows.length) {
    throw createServiceError("Reply not found.", 404);
  }

  if (userRole !== "admin" && rows[0].author_id !== userId) {
    throw createServiceError("You can only modify your own reply.", 403);
  }
}

async function ensureParentReplyBelongsToDiscussion(parentReplyId, discussionId) {
  if (!parentReplyId) {
    return;
  }

  const [rows] = await pool.execute(
    `SELECT id
     FROM discussion_replies
     WHERE id = ? AND discussion_id = ?
     LIMIT 1`,
    [parentReplyId, discussionId],
  );

  if (!rows.length) {
    throw createServiceError("Parent reply not found for this discussion.", 404);
  }
}

export async function getDiscussions() {
  const [rows] = await pool.execute(
    `SELECT
       p.id,
       p.author_id,
       u.name AS author_name,
       p.title,
       p.body,
       p.created_at,
       p.updated_at
     FROM discussion_posts p
     INNER JOIN users u ON u.id = p.author_id
     ORDER BY p.created_at DESC, p.id DESC`,
  );

  const repliesByDiscussionId = await getRepliesByDiscussionIds(
    rows.map((row) => row.id),
  );

  return rows.map((row) =>
    mapPostRow(row, repliesByDiscussionId[row.id] || []),
  );
}

export async function getDiscussionById(discussionId) {
  const [rows] = await pool.execute(
    `SELECT
       p.id,
       p.author_id,
       u.name AS author_name,
       p.title,
       p.body,
       p.created_at,
       p.updated_at
     FROM discussion_posts p
     INNER JOIN users u ON u.id = p.author_id
     WHERE p.id = ?
     LIMIT 1`,
    [discussionId],
  );

  if (!rows.length) {
    throw createServiceError("Discussion not found.", 404);
  }

  const repliesByDiscussionId = await getRepliesByDiscussionIds([
    Number(discussionId),
  ]);

  return mapPostRow(rows[0], repliesByDiscussionId[discussionId] || []);
}

export async function createDiscussionForUser(userId, { title, body }) {
  const [result] = await pool.execute(
    `INSERT INTO discussion_posts (author_id, title, body)
     VALUES (?, ?, ?)`,
    [userId, title.trim(), body.trim()],
  );

  return getDiscussionById(result.insertId);
}

export async function updateDiscussionForUser(
  userId,
  userRole,
  discussionId,
  { title, body },
) {
  await ensureDiscussionOwner(userId, userRole, discussionId);

  await pool.execute(
    `UPDATE discussion_posts
     SET title = ?, body = ?
     WHERE id = ?`,
    [title.trim(), body.trim(), discussionId],
  );

  return getDiscussionById(discussionId);
}

export async function deleteDiscussionForUser(userId, userRole, discussionId) {
  await ensureDiscussionOwner(userId, userRole, discussionId);

  await pool.execute(`DELETE FROM discussion_posts WHERE id = ?`, [
    discussionId,
  ]);

  return {
    id: Number(discussionId),
  };
}

export async function createReplyForUser(
  userId,
  discussionId,
  { body, parentReplyId = null },
) {
  await getDiscussionById(discussionId);
  await ensureParentReplyBelongsToDiscussion(parentReplyId, discussionId);

  await pool.execute(
    `INSERT INTO discussion_replies
       (discussion_id, parent_reply_id, author_id, body)
     VALUES (?, ?, ?, ?)`,
    [discussionId, parentReplyId || null, userId, body.trim()],
  );

  return getDiscussionById(discussionId);
}

export async function updateReplyForUser(
  userId,
  userRole,
  discussionId,
  replyId,
  { body },
) {
  await ensureReplyOwner(userId, userRole, discussionId, replyId);

  await pool.execute(
    `UPDATE discussion_replies
     SET body = ?
     WHERE id = ? AND discussion_id = ?`,
    [body.trim(), replyId, discussionId],
  );

  return getDiscussionById(discussionId);
}

export async function deleteReplyForUser(
  userId,
  userRole,
  discussionId,
  replyId,
) {
  await ensureReplyOwner(userId, userRole, discussionId, replyId);

  await pool.execute(
    `DELETE FROM discussion_replies
     WHERE id = ? AND discussion_id = ?`,
    [replyId, discussionId],
  );

  return getDiscussionById(discussionId);
}
