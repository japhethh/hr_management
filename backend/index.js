import express from "express";
import cors from "cors";
import { ConnectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import "dotenv/config";
import { authMiddleware } from "./middleware/Auth.js";
import cookieParser from "cookie-parser";
import employeeRouter from "./routes/employeeRouter.js";
import recruitmentRouter from "./routes/recruitmentRouter.js";
import timeAttendanceRouter from "./routes/timeAttendanceRouter.js";
import competencyRouter from "./routes/competencyRouter.js";
import hrAnalyticsRouter from "./routes/hrAnalyticsRouter.js";
import performanceReviewRouter from "./routes/performanceReviewRouter.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser());

app.use(express.json());
ConnectDB();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Helloworld");
});
app.get("/api/auth/check", authMiddleware, (req, res) => {
  res.status(200).json({ authenticated: true, user: req.user });
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/recruitments", recruitmentRouter);
app.use("/api/time-attendance", timeAttendanceRouter);
app.use("/api/competency", competencyRouter);
app.use("/api/hr-analytics", hrAnalyticsRouter);
app.use("/api/performance-review", performanceReviewRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
