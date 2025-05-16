import expressAsyncHandler from "express-async-handler"
import timeAttendanceService from "../services/timeAttendance.service.js"

export const getTimeAttendances = expressAsyncHandler(async (req, res) => {
  const timeAttendances = await timeAttendanceService.getTimeAttendances()
  res.status(200).json(timeAttendances)
})

export const getTimeAttendanceById = expressAsyncHandler(async (req, res) => {
  const timeAttendance = await timeAttendanceService.getTimeAttendanceById(req.params.id)
  if (!timeAttendance) {
    res.status(404).json({ message: "Time attendance record not found!" })
    return
  }
  res.status(200).json(timeAttendance)
})

export const getTimeAttendanceByEmployeeId = expressAsyncHandler(async (req, res) => {
  const timeAttendances = await timeAttendanceService.getTimeAttendanceByEmployeeId(req.params.employeeId)
  res.status(200).json(timeAttendances)
})

export const getTimeAttendanceByDateRange = expressAsyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query
  if (!startDate || !endDate) {
    res.status(400).json({ message: "Start date and end date are required" })
    return
  }

  const timeAttendances = await timeAttendanceService.getTimeAttendanceByDateRange(startDate, endDate)
  res.status(200).json(timeAttendances)
})

export const createTimeAttendance = expressAsyncHandler(async (req, res) => {
  console.log(req.body)
  const newTimeAttendance = await timeAttendanceService.createTimeAttendance(req.body)
  res.status(201).json(newTimeAttendance)
})

export const updateTimeAttendance = expressAsyncHandler(async (req, res) => {
  const updatedTimeAttendance = await timeAttendanceService.updateTimeAttendance(req.params.id, req.body)
  res.status(200).json(updatedTimeAttendance)
})

export const deleteTimeAttendance = expressAsyncHandler(async (req, res) => {
  const result = await timeAttendanceService.deleteTimeAttendance(req.params.id)
  res.status(200).json(result)
})

export const clockIn = expressAsyncHandler(async (req, res) => {
  const { employeeId } = req.body
  if (!employeeId) {
    res.status(400).json({ message: "Employee ID is required" })
    return
  }

  const result = await timeAttendanceService.clockIn(employeeId)
  res.status(200).json(result)
})

export const clockOut = expressAsyncHandler(async (req, res) => {
  const { employeeId } = req.body
  if (!employeeId) {
    res.status(400).json({ message: "Employee ID is required" })
    return
  }

  const result = await timeAttendanceService.clockOut(employeeId)
  res.status(200).json(result)
})

export const markAbsent = expressAsyncHandler(async (req, res) => {
  const { employeeId, date } = req.body
  if (!employeeId) {
    res.status(400).json({ message: "Employee ID is required" })
    return
  }

  const result = await timeAttendanceService.markAbsent(employeeId, date)
  res.status(200).json(result)
})

export const markLeave = expressAsyncHandler(async (req, res) => {
  const { employeeId, date } = req.body
  if (!employeeId) {
    res.status(400).json({ message: "Employee ID is required" })
    return
  }

  const result = await timeAttendanceService.markLeave(employeeId, date)
  res.status(200).json(result)
})

export const getAttendanceSummary = expressAsyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query
  const summary = await timeAttendanceService.getAttendanceSummary(startDate, endDate)
  res.status(200).json(summary)
})