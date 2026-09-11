import express from "express";
import { errorMiddleware } from "./middleware";
import usersRouter from "./modules/users/users.routes";
import authRouter from "./modules/auth/auth.routes";
// import authRouter from "./modules/auth/";
// import projectsRouter from "./modules/projects/projects.routes";
// import tasksRouter from "./modules/tasks/tasks.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// app.use("api/v1/auth", usersRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);
// app.use("api/v1/projects", usersRouter);
// app.use("api/v1/tasks", usersRouter);

// Global Error handle middleware
app.use(errorMiddleware);

export default app;
