import expressAsyncHandler from "express-async-handler"
import hrAnalyticsService from "../services/hrAnalytics.service.js"

export const getHrAnalytics = expressAsyncHandler(async (req, res) => {
  const hrAnalytics = await hrAnalyticsService.getHrAnalytics()
  res.status(200).json(hrAnalytics)
})

export const getHrAnalyticsById = expressAsyncHandler(async (req, res) => {
  const hrAnalytics = await hrAnalyticsService.getHrAnalyticsById(req.params.id)
  if (!hrAnalytics) {
    res.status(404).json({ message: "HR Analytics record not found!" })
    return
  }
  res.status(200).json(hrAnalytics)
})

export const getHrAnalyticsByEmployeeId = expressAsyncHandler(async (req, res) => {
  const hrAnalytics = await hrAnalyticsService.getHrAnalyticsByEmployeeId(req.params.employeeId)
  res.status(200).json(hrAnalytics)
})

export const createHrAnalytics = expressAsyncHandler(async (req, res) => {
  console.log(req.body)
  const newHrAnalytics = await hrAnalyticsService.createHrAnalytics(req.body)
  res.status(201).json(newHrAnalytics)
})

export const updateHrAnalytics = expressAsyncHandler(async (req, res) => {
  const updatedHrAnalytics = await hrAnalyticsService.updateHrAnalytics(req.params.id, req.body)
  res.status(200).json(updatedHrAnalytics)
})

export const deleteHrAnalytics = expressAsyncHandler(async (req, res) => {
  const result = await hrAnalyticsService.deleteHrAnalytics(req.params.id)
  res.status(200).json(result)
})

export const generateHrAnalytics = expressAsyncHandler(async (req, res) => {
  const { employeeId } = req.body
  if (!employeeId) {
    res.status(400).json({ message: "Employee ID is required" })
    return
  }

  const result = await hrAnalyticsService.generateHrAnalytics(employeeId)
  res.status(200).json(result)
})

export const generateAllHrAnalytics = expressAsyncHandler(async (req, res) => {
  const results = await hrAnalyticsService.generateAllHrAnalytics()
  res.status(200).json(results)
})

export const getEmployeePerformanceMetrics = expressAsyncHandler(async (req, res) => {
  const metrics = await hrAnalyticsService.getEmployeePerformanceMetrics()
  res.status(200).json(metrics)
})

export const getDepartmentPerformanceMetrics = expressAsyncHandler(async (req, res) => {
  const metrics = await hrAnalyticsService.getDepartmentPerformanceMetrics()
  res.status(200).json(metrics)
})

export const getTopPerformers = expressAsyncHandler(async (req, res) => {
  const { limit } = req.query
  const topPerformers = await hrAnalyticsService.getTopPerformers(limit ? Number.parseInt(limit) : 5)
  res.status(200).json(topPerformers)
})
