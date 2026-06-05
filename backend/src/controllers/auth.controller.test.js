import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { activateExpiredSuspensionForLogin } from "../services/adminUsers.service.js";
import { recordAuditLogForRequest } from "../services/auditLog.service.js";
import { login } from "./auth.controller.js";

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

vi.mock("../config/db.js", () => ({
  pool: {
    execute: vi.fn(),
  },
}));

vi.mock("../services/adminUsers.service.js", () => ({
  activateExpiredSuspensionForLogin: vi.fn(),
}));

vi.mock("../services/auditLog.service.js", () => ({
  recordAuditLogForRequest: vi.fn(),
}));

vi.mock("../services/userSession.service.js", () => ({
  ensureUserSessionSchema: vi.fn().mockResolvedValue(undefined),
}));

function makeReq(body) {
  return {
    body,
    headers: {},
    ip: "127.0.0.1",
    socket: {},
    get: vi.fn(),
  };
}

function makeRes() {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  };

  return res;
}

function makeUser() {
  return {
    id: 1,
    name: "Test Student",
    userhandle: "test_student",
    email: "student@example.com",
    password_hash: "hashed-password",
    role: "student",
    account_status: "active",
    suspended_until: null,
  };
}

async function callLogin(body) {
  const req = makeReq(body);
  const res = makeRes();

  await login(req, res);

  return res;
}

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    process.env.JWT_SECRET = "test-secret";

    activateExpiredSuspensionForLogin.mockImplementation(async (user) => user);
    recordAuditLogForRequest.mockResolvedValue();
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-token");
  });

  it("returns 400 if email or password is missing", async () => {
    const res = await callLogin({ email: "", password: "secret123" });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email and password are required",
    });
  });

  it("returns 401 if user is not found", async () => {
    pool.execute.mockResolvedValueOnce([[]]);

    const res = await callLogin({
      email: "missing@example.com",
      password: "secret123",
    });

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid email or password",
    });
  });

  it("returns 401 if password is wrong", async () => {
    pool.execute.mockResolvedValueOnce([[makeUser()]]);
    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await callLogin({
      email: "student@example.com",
      password: "wrong-password",
    });

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid email or password",
    });
  });

  it("returns 200 if login is successful", async () => {
    pool.execute.mockResolvedValueOnce([[makeUser()]]);

    const res = await callLogin({
      email: "student@example.com",
      password: "secret123",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Login Successful",
      user: {
        id: 1,
        name: "Test Student",
        handle: "test_student",
        email: "student@example.com",
        role: "student",
        accountStatus: "active",
      },
      token: "fake-token",
    });
  });
});
