import { pool } from "../../config/db.js";
import { runJudge0Submission } from "../judge0.service.js";
import { resolveProblemForSubmission } from "./problemResolver.service.js";
import {
  createServiceError,
  getMemoryKb,
  getOutput,
  getRuntimeMs,
  mapJudge0StatusToVerdict,
  mapVerdictCodeToLabel,
  normalizeOutput,
} from "./shared.service.js";

// loads the test cases that should be used to judge a submission. first contest_snapshot then fallback
async function getProblemTestCases(problem) {
  if (problem.contestId) {
    const [rows] = await pool.execute(
      `SELECT id, input_text, output_text
       FROM contest_problem_test_cases
       WHERE contest_problem_id = ?
       ORDER BY sort_order ASC, id ASC`,
      [problem.contestProblemId],
    );

    const contestTestCases = rows.map((row, index) => ({
      id: row.id,
      index: index + 1,
      input: row.input_text,
      output: row.output_text,
    }));

    if (contestTestCases.length || !problem.problemSourceId) {
      return contestTestCases;
    }
  }

  // fallback if no contest
  const [rows] = await pool.execute(
    `SELECT id, input_text, output_text
     FROM problem_test_cases
     WHERE problem_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [problem.problemSourceId || problem.problemId],
  );

  return rows.map((row, index) => ({
    id: row.id,
    index: index + 1,
    input: row.input_text,
    output: row.output_text,
  }));
}

function buildFailureNote({ testCase, result, verdict, expected, actual }) {
  if (verdict === "WA") {
    return [
      `Wrong answer on test case ${testCase.index}.`,
      "",
      "Expected:",
      expected,
      "",
      "Your Output:",
      actual,
    ].join("\n");
  }

  return [
    `${mapVerdictCodeToLabel(verdict)} on test case ${testCase.index}.`,
    "",
    getOutput(result) || result.status?.description || "No output.",
  ].join("\n");
}

// runs the submitted code against every test case and returns the final verdict/result summary
export async function judgeAllTestCases({ problem, language, sourceCode }) {
  const testCases = await getProblemTestCases(problem);

  if (!testCases.length) {
    throw createServiceError("This problem has no test cases yet.", 400);
  }

  const lines = [];
  let totalRuntimeMs = 0;
  let maxMemoryKb = 0;

  for (const testCase of testCases) {
    const result = await runJudge0Submission({
      language,
      sourceCode,
      stdin: testCase.input,
      timeLimitSeconds: problem.timeLimitSeconds,
      memoryLimitMb: problem.memoryLimitMb,
    });
    let verdict = mapJudge0StatusToVerdict(result);
    const actual = normalizeOutput(result.stdout);
    const expected = normalizeOutput(testCase.output);
    const runtimeMs = getRuntimeMs(result);
    const memoryKb = getMemoryKb(result);

    if (runtimeMs !== null) {
      totalRuntimeMs += runtimeMs;
    }

    if (memoryKb !== null) {
      maxMemoryKb = Math.max(maxMemoryKb, memoryKb);
    }

    if (verdict === "AC" && actual !== expected) {
      verdict = "WA";
    }

    if (verdict !== "AC") {
      return {
        verdict,
        runtimeMs: totalRuntimeMs || runtimeMs,
        memoryKb: maxMemoryKb || memoryKb,
        testCaseNote: buildFailureNote({
          testCase,
          result,
          verdict,
          expected,
          actual,
        }),
        output: getOutput(result),
      };
    }

    lines.push(
      `Test ${testCase.index}: PASS (${runtimeMs ?? "--"}ms, ${memoryKb ?? "--"} KB)`,
    );
  }

  return {
    verdict: "AC",
    runtimeMs: totalRuntimeMs,
    memoryKb: maxMemoryKb,
    testCaseNote: `All ${testCases.length} test cases passed.\n${lines.join("\n")}`,
    output: `All ${testCases.length} test cases passed.\n\n${lines.join("\n")}`,
  };
}

// runs code with custom input for a problem, but does not judge it against official test cases
export async function runCodeForProblem(userId, payload) {
  const problem = await resolveProblemForSubmission({
    userId,
    problemId: payload.problemId,
    contestId: payload.contestId,
    contestProblemCode: payload.contestProblemCode,
  });
  const result = await runJudge0Submission({
    language: payload.language,
    sourceCode: payload.sourceCode,
    stdin: payload.stdin || "",
    timeLimitSeconds: problem.timeLimitSeconds,
    memoryLimitMb: problem.memoryLimitMb,
  });
  const verdict = mapJudge0StatusToVerdict(result);
  const isAcceptedRuntime = verdict === "AC";

  return {
    verdict: isAcceptedRuntime ? null : verdict,
    verdictLabel: isAcceptedRuntime ? null : mapVerdictCodeToLabel(verdict),
    output: getOutput(result),
    runtimeMs: getRuntimeMs(result),
    memoryKb: getMemoryKb(result),
    status: result.status,
  };
}
