import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = Router();

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

router.post("/signup", async (request, response) => {
  const { f_name, l_name, username, password } = request.body;

  if ([f_name, l_name, username, password].some(isBlank)) {
    return response.status(400).json({
      message: "Fill out all signup fields first."
    });
  }

  const normalizedUsername = username.trim().toLowerCase();

  try {
    const existingUser = await User.findOne({ username: normalizedUsername });

    if (existingUser) {
      return response.status(409).json({
        message: "That username is taken."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      f_name: f_name.trim(),
      l_name: l_name.trim(),
      username: normalizedUsername,
      password: hashedPassword
    });

    return response.status(201).json({
      message: `Account ready for ${user.username}.`,
      user: {
        _id: user._id,
        f_name: user.f_name,
        l_name: user.l_name,
        username: user.username
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({
        message: "That username is taken."
      });
    }

    console.error("Signup error:", error);
    return response.status(500).json({
      message: "Signup hit a snag. Try again."
    });
  }
});

router.post("/login", async (request, response) => {
  const { username, password } = request.body;

  if ([username, password].some(isBlank)) {
    return response.status(400).json({
      message: "Add both username and password first."
    });
  }

  const normalizedUsername = username.trim().toLowerCase();

  try {
    const user = await User.findOne({ username: normalizedUsername });

    if (!user) {
      return response.status(404).json({
        message: "That username is not in the team yet."
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return response.status(401).json({
        message: "That password did not match."
      });
    }

    return response.json({
      message: `You are in. Welcome, ${user.f_name}!`,
      user: {
        _id: user._id,
        f_name: user.f_name,
        l_name: user.l_name,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return response.status(500).json({
      message: "Login hit a snag. Try again."
    });
  }
});

export default router;
