import express from "express";
import {
  createTimeAttendance,
  deleteTimeAttendance,
  getTimeAttendances,
  getTimeAttendanceById,
  getTimeAttendanceByEmployeeId,
  getTimeAttendanceByDateRange,
  updateTimeAttendance,
  clockIn,
  clockOut,
  markAbsent,
  markLeave,
  getAttendanceSummary,
} from "../controller/timeAttendanceController.js";

const timeAttendanceRouter = express.Router();

// Basic CRUD routes
timeAttendanceRouter.get("/", getTimeAttendances);
timeAttendanceRouter.get("/summary", getAttendanceSummary);
timeAttendanceRouter.get(
  "/employee/:employeeId",
  getTimeAttendanceByEmployeeId
);
timeAttendanceRouter.get("/date-range", getTimeAttendanceByDateRange);
timeAttendanceRouter.get("/:id", getTimeAttendanceById);
timeAttendanceRouter.post("/", createTimeAttendance);
timeAttendanceRouter.put("/:id", updateTimeAttendance);
timeAttendanceRouter.delete("/:id", deleteTimeAttendance);

// Special action routes
timeAttendanceRouter.post("/clock-in", clockIn);
timeAttendanceRouter.post("/clock-out", clockOut);
timeAttendanceRouter.post("/mark-absent", markAbsent);
timeAttendanceRouter.post("/mark-leave", markLeave);

export default timeAttendanceRouter;
