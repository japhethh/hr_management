import api from "@/lib/axios"
import type { TimeAttendance, AttendanceSummary } from "@/types"

export const timeAttendanceApi = {
  getTimeAttendances: async (): Promise<TimeAttendance[]> => {
    const response = await api.get<TimeAttendance[]>("/time-attendance/")
    return response.data
  },

  getTimeAttendanceById: async (id: string): Promise<TimeAttendance> => {
    const response = await api.get<TimeAttendance>(`/time-attendance/${id}`)
    return response.data
  },

  getTimeAttendanceByEmployeeId: async (employeeId: string): Promise<TimeAttendance[]> => {
    const response = await api.get<TimeAttendance[]>(`/time-attendance/employee/${employeeId}`)
    return response.data
  },

  getTimeAttendanceByDateRange: async (startDate: string, endDate: string): Promise<TimeAttendance[]> => {
    const response = await api.get<TimeAttendance[]>(`/time-attendance/date-range`, {
      params: { startDate, endDate },
    })
    return response.data
  },

  createTimeAttendance: async (timeAttendanceData: Partial<TimeAttendance>): Promise<TimeAttendance> => {
    const response = await api.post<TimeAttendance>("/time-attendance", timeAttendanceData)
    return response.data
  },

  updateTimeAttendance: async (id: string, timeAttendanceData: Partial<TimeAttendance>): Promise<TimeAttendance> => {
    const response = await api.put<TimeAttendance>(`/time-attendance/${id}`, { timeAttendanceData, id })
    return response.data
  },

  deleteTimeAttendance: async (id: string): Promise<void> => {
    await api.delete(`/time-attendance/${id}`)
  },

  clockIn: async (employeeId: string): Promise<TimeAttendance> => {
    const response = await api.post<TimeAttendance>("/time-attendance/clock-in", { employeeId })
    return response.data
  },

  clockOut: async (employeeId: string): Promise<TimeAttendance> => {
    const response = await api.post<TimeAttendance>("/time-attendance/clock-out", { employeeId })
    return response.data
  },

  markAbsent: async (employeeId: string, date?: string): Promise<TimeAttendance> => {
    const response = await api.post<TimeAttendance>("/time-attendance/mark-absent", { employeeId, date })
    return response.data
  },

  markLeave: async (employeeId: string, date?: string): Promise<TimeAttendance> => {
    const response = await api.post<TimeAttendance>("/time-attendance/mark-leave", { employeeId, date })
    return response.data
  },

  getAttendanceSummary: async (startDate?: string, endDate?: string): Promise<AttendanceSummary> => {
    const response = await api.get<AttendanceSummary>("/time-attendance/summary", {
      params: { startDate, endDate },
    })
    return response.data
  },
}
