import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  console.log("I am running ")
  res.json({
    success: true,
    message: "App is running",
  });
});

export default app;
