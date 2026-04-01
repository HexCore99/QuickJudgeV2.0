import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name,email and password are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [trimmedEmail],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)",
      [trimmedName, trimmedEmail, passwordHash, "student"],
    );

    const user = {
      id: result.insertId,
      name: trimmedName,
      email: trimmedEmail,
      role: "student",
    };
    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Signup Successful",
      user,
      token,
    });
  } catch (err) {
    console.error("Signup error: ", err);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const [users] = await pool.execute(
      "SELECT id,name,email,password_hash,role FROM users WHERE email=?",
      [trimmedEmail],
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const foundUser = users[0];
    const isPasswordMatched = await bcrypt.compare(
      password,
      foundUser.password_hash,
    );
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };
    const token = createToken(user);
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user,
      token,
    });
  } catch (err) {
    console.error("Login Error: ", err);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
}

/*
:resp
return res.status(400).json({
  success: false,
  message: "",
});

*/
