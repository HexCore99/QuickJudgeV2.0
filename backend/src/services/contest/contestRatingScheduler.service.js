import { pool } from "../../config/db.js";
import { refreshContestStatuses } from "./contestShared.service.js";
import { finalizePublicContestRating } from "../ratings/finalize.service.js";

const AUTO_FINALIZE_INTERVAL_MS = 60 * 1000;

let sweepInProgress = false;
let schedulerId = null;

// Finds public rated past contests whose ratings have not been finalized yet.
async function getPendingRatedContestIds() {
  await refreshContestStatuses();

  const [rows] = await pool.execute(
    `SELECT id
     FROM contests
     WHERE status = 'past'
       AND is_rated = 1
       AND requires_password = 0
       AND rating_finalized_at IS NULL
     ORDER BY start_time ASC, id ASC`,
  );

  return rows.map((row) => row.id);
}

// Finalizes ratings for all pending public rated contests, skipping if a sweep is already running.
export async function runContestRatingFinalizationSweep() {
  if (sweepInProgress) {
    return {
      skipped: true,
      results: [],
    };
  }

  sweepInProgress = true;

  try {
    const contestIds = await getPendingRatedContestIds();
    const results = [];

    for (const contestId of contestIds) {
      try {
        const result = await finalizePublicContestRating(contestId);
        results.push(result);
      } catch (error) {
        console.error(
          `Auto-finalize failed for contest ${contestId}:`,
          error,
        );
        results.push({
          contestId,
          error: error.message || "Failed to finalize contest rating.",
        });
      }
    }

    return {
      skipped: false,
      results,
    };
  } finally {
    sweepInProgress = false;
  }
}

// Starts the automatic contest rating finalization scheduler
export function startContestRatingFinalizationScheduler() {
  if (schedulerId) {
    return schedulerId;
  }

  const runSweep = () => {
    runContestRatingFinalizationSweep().catch((error) => {
      console.error("Contest rating auto-finalize sweep failed:", error);
    });
  };

  runSweep();
  schedulerId = setInterval(runSweep, AUTO_FINALIZE_INTERVAL_MS);

  return schedulerId;
}
