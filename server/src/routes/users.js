import { Router } from "express";
import User from "../models/User.js";

const router = Router();

function formatUser(user) {
  return {
    _id: user._id,
    f_name: user.f_name,
    l_name: user.l_name,
    username: user.username
  };
}

router.get("/users", async (request, response) => {
  try {
    const users = await User.find({})
      .sort({ username: 1 })
      .select("f_name l_name username");

    return response.json({
      users: users.map(formatUser)
    });
  } catch (error) {
    console.error("User list error:", error);
    return response.status(500).json({
      message: "Could not load users right now."
    });
  }
});

export default router;
