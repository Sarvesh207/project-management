import express from "express";
import { errorMiddleware } from "./middleware";
import usersRouter from "./modules/users/users.routes";
// import authRouter from "./modules/auth/";
// import projectsRouter from "./modules/projects/projects.routes";
// import tasksRouter from "./modules/tasks/tasks.routes";
const app = express();

app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "API and database are working",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// app.use("api/v1/auth", usersRouter);
app.use("/api/v1/users", usersRouter);
// app.use("api/v1/projects", usersRouter);
// app.use("api/v1/tasks", usersRouter);

// Global Error handle middleware
app.use(errorMiddleware);

export default app;
