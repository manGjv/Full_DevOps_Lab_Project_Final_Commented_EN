/**
 * Express app configuration.
 * Responsibilities:
 *  - Base routes (/, /health)
 *  - Mount specific routers
 *  - Global error handler (consistent JSON for errors)
 */
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { errorHandler } from "./utils/errorHandler.js";

// Import explicit routers
import versionRouter from "./routes/auto/version.route.js";
import infoRouter from "./routes/auto/info.route.js";
import boomRouter from "./routes/auto/boom.route.js";
import authRouter from "./routes/auth.route.js";
import usersRouter from "./routes/user.route.js";
import coursesRouter from "./routes/courses.route.js";
import quizzesRouter from "./routes/quizzes.route.js";

const app = express();

app.use(express.json());

// Simple root + health endpoints
app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Hello from CI/CD demo" });
});
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Mount all auto routers
app.use("/", versionRouter);
app.use("/", infoRouter);
app.use("/", boomRouter);
app.use("/", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/quizzes", quizzesRouter);

// Global error middleware last
app.use(errorHandler);

export default app;
