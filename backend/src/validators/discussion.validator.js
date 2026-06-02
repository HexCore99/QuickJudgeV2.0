export function validateDiscussionId(value) {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return "Discussion id must be a positive number.";
  }

  return null;
}

export function validateReplyId(value) {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return "Reply id must be a positive number.";
  }

  return null;
}

export function validateDiscussionPayload({ title, body } = {}) {
  if (typeof title !== "string" || !title.trim()) {
    return "Discussion title is required.";
  }

  if (title.trim().length > 200) {
    return "Discussion title must be under 200 characters.";
  }

  if (typeof body !== "string" || !body.trim()) {
    return "Discussion body is required.";
  }

  return null;
}

export function validateReplyPayload({ body, parentReplyId } = {}) {
  if (typeof body !== "string" || !body.trim()) {
    return "Reply body is required.";
  }

  if (
    parentReplyId !== null &&
    parentReplyId !== undefined &&
    validateReplyId(parentReplyId)
  ) {
    return "Parent reply id must be a positive number.";
  }

  return null;
}
