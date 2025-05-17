import api from "@/lib/axios"
import type { HrAnalytics, EmployeePerformanceMetric, DepartmentPerformanceMetric, TopPerformer } from "@/types"

export const hrAnalyticsApi = {
  getHrAnalytics: async (): Promise<HrAnalytics[]> => {
    const response = await api.get<HrAnalytics[]>("/hr-analytics/")
    return response.data
  },

  getHrAnalyticsById: async (id: string): Promise<HrAnalytics> => {
    const response = await api.get<HrAnalytics>(`/hr-analytics/${id}`)
    return response.data
  },

  getHrAnalyticsByEmployeeId: async (employeeId: string): Promise<HrAnalytics[]> => {
    if (!employeeId || employeeId === "all") {
      return [] // Return empty array or fetch all records
    }
    const response = await api.get<HrAnalytics[]>(`/hr-analytics/employee/${employeeId}`)
    return response.data
  },

  createHrAnalytics: async (hrAnalyticsData: Partial<HrAnalytics>): Promise<HrAnalytics> => {
    const response = await api.post<HrAnalytics>("/hr-analytics", hrAnalyticsData)
    return response.data
  },

  updateHrAnalytics: async (id: string, hrAnalyticsData: Partial<HrAnalytics>): Promise<HrAnalytics> => {
    const response = await api.put<HrAnalytics>(`/hr-analytics/${id}`, { hrAnalyticsData, id })
    return response.data
  },

  deleteHrAnalytics: async (id: string): Promise<void> => {
    await api.delete(`/hr-analytics/${id}`)
  },

  generateHrAnalytics: async (employeeId: string): Promise<HrAnalytics> => {
    const response = await api.post<HrAnalytics>("/hr-analytics/generate", { employeeId })
    return response.data
  },

  generateAllHrAnalytics: async (): Promise<HrAnalytics[]> => {
    const response = await api.post<HrAnalytics[]>("/hr-analytics/generate-all")
    return response.data
  },

  getEmployeePerformanceMetrics: async (): Promise<EmployeePerformanceMetric[]> => {
    const response = await api.get<EmployeePerformanceMetric[]>("/hr-analytics/employee-performance")
    return response.data
  },

  getDepartmentPerformanceMetrics: async (): Promise<DepartmentPerformanceMetric[]> => {
    const response = await api.get<DepartmentPerformanceMetric[]>("/hr-analytics/department-performance")
    return response.data
  },

  getTopPerformers: async (limit = 5): Promise<TopPerformer[]> => {
    const response = await api.get<TopPerformer[]>(`/hr-analytics/top-performers`, {
      params: { limit },
    })
    return response.data
  },
}
