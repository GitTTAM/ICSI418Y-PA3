import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDatabase } from "./db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5050;
const clientUrls = [
  ...(process.env.CLIENT_URL || "").split(","),
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || clientUrls.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS."));
    }
  })
);
app.use(express.json());

app.get("/api/health", (request, response) => {
  response.json({
    message: "API is running."
  });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", projectRoutes);

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
