import express from "express";
import {
  createHrAnalytics,
  deleteHrAnalytics,
  getHrAnalytics,
  getHrAnalyticsById,
  getHrAnalyticsByEmployeeId,
  updateHrAnalytics,
  generateHrAnalytics,
  generateAllHrAnalytics,
  getEmployeePerformanceMetrics,
  getDepartmentPerformanceMetrics,
  getTopPerformers,
} from "../controller/hrAnalyticsController.js";

const hrAnalyticsRouter = express.Router();

// Basic CRUD routes
hrAnalyticsRouter.get("/", getHrAnalytics);
hrAnalyticsRouter.get("/employee-performance", getEmployeePerformanceMetrics);
hrAnalyticsRouter.get(
  "/department-performance",
  getDepartmentPerformanceMetrics
);
hrAnalyticsRouter.get("/top-performers", getTopPerformers);
hrAnalyticsRouter.get("/employee/:employeeId", getHrAnalyticsByEmployeeId);
hrAnalyticsRouter.get("/:id", getHrAnalyticsById);
hrAnalyticsRouter.post("/", createHrAnalytics);
hrAnalyticsRouter.put("/:id", updateHrAnalytics);
hrAnalyticsRouter.delete("/:id", deleteHrAnalytics);

// Analytics generation routes
hrAnalyticsRouter.post("/generate", generateHrAnalytics);
hrAnalyticsRouter.post("/generate-all", generateAllHrAnalytics);

export default hrAnalyticsRouter;
