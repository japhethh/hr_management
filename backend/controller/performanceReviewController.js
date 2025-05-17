import expressAsyncHandler from "express-async-handler";
import performanceReviewService from "../services/performanceReview.service.js";

export const getPerformanceReviews = expressAsyncHandler(async (req, res) => {
  const performanceReviews =
    await performanceReviewService.getPerformanceReviews();
  res.status(200).json(performanceReviews);
});

export const getPerformanceReviewById = expressAsyncHandler(
  async (req, res) => {
    const performanceReview =
      await performanceReviewService.getPerformanceReviewById(req.params.id);
    if (!performanceReview) {
      res.status(404).json({ message: "Performance review not found!" });
      return;
    }
    res.status(200).json(performanceReview);
  }
);

export const getPerformanceReviewsByEmployeeId = expressAsyncHandler(
  async (req, res) => {
    const performanceReviews =
      await performanceReviewService.getPerformanceReviewsByEmployeeId(
        req.params.employeeId
      );
    res.status(200).json(performanceReviews);
  }
);

export const getPerformanceReviewsByPeriod = expressAsyncHandler(
  async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({ message: "Start date and end date are required" });
      return;
    }

    const performanceReviews =
      await performanceReviewService.getPerformanceReviewsByPeriod(
        startDate,
        endDate
      );
    res.status(200).json(performanceReviews);
  }
);

export const createPerformanceReview = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  const newPerformanceReview =
    await performanceReviewService.createPerformanceReview(req.body);
  res.status(201).json(newPerformanceReview);
});

export const updatePerformanceReview = expressAsyncHandler(async (req, res) => {
  const updatedPerformanceReview =
    await performanceReviewService.updatePerformanceReview(
      req.params.id,
      req.body
    );
  res.status(200).json(updatedPerformanceReview);
});

export const deletePerformanceReview = expressAsyncHandler(async (req, res) => {
  const result = await performanceReviewService.deletePerformanceReview(
    req.params.id
  );
  res.status(200).json(result);
});

export const getPerformanceReviewStats = expressAsyncHandler(
  async (req, res) => {
    const stats = await performanceReviewService.getPerformanceReviewStats();
    res.status(200).json(stats);
  }
);

export const getEmployeeReviewSummary = expressAsyncHandler(
  async (req, res) => {
    const { employeeId } = req.params;
    if (!employeeId) {
      res.status(400).json({ message: "Employee ID is required" });
      return;
    }

    const summary = await performanceReviewService.getEmployeeReviewSummary(
      employeeId
    );
    res.status(200).json(summary);
  }
);

export const getDepartmentReviewSummary = expressAsyncHandler(
  async (req, res) => {
    const summary = await performanceReviewService.getDepartmentReviewSummary();
    res.status(200).json(summary);
  }
);
