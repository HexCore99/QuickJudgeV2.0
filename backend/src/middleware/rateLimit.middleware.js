import rateLimit from "express-rate-limit";

function userKey(req) {
  return `user:${req.user.id}`;
}

function rateLimitHandler(message) {
  return (req, res) => {
    res.status(429).json({
      success: false,
      message,
    });
  };
}

const oneMinuteWindowMs = 60 * 1000;

export const runCodeLimiter = rateLimit({
  windowMs: oneMinuteWindowMs,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: userKey,
  handler: rateLimitHandler("Too many run requests. Please wait a moment."),
});

export const submitCodeLimiter = rateLimit({
  windowMs: oneMinuteWindowMs,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: userKey,
  handler: rateLimitHandler(
    "Too many submissions. Please wait before submitting again.",
  ),
});
