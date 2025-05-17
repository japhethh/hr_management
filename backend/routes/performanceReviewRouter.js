import express from "express"
import {
  createPerformanceReview,
  deletePerformanceReview,
  getPerformanceReviews,
  getPerformanceReviewById,
  getPerformanceReviewsByEmployeeId,
  getPerformanceReviewsByPeriod,
  updatePerformanceReview,
  getPerformanceReviewStats,
  getEmployeeReviewSummary,
  getDepartmentReviewSummary,
} from "../controller/performanceReviewController.js"

const performanceReviewRouter = express.Router()

// Basic CRUD routes
performanceReviewRouter.get("/", getPerformanceReviews)
performanceReviewRouter.get("/stats", getPerformanceReviewStats)
performanceReviewRouter.get("/department-summary", getDepartmentReviewSummary)
performanceReviewRouter.get("/period", getPerformanceReviewsByPeriod)
performanceReviewRouter.get("/employee/:employeeId", getPerformanceReviewsByEmployeeId)
performanceReviewRouter.get("/employee-summary/:employeeId", getEmployeeReviewSummary)
performanceReviewRouter.get("/:id", getPerformanceReviewById)
performanceReviewRouter.post("/", createPerformanceReview)
performanceReviewRouter.put("/:id", updatePerformanceReview)
performanceReviewRouter.delete("/:id", deletePerformanceReview)

export default performanceReviewRouter
