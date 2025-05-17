import api from "@/lib/axios"
import type { PerformanceReview, ReviewStats, EmployeeSummary, DepartmentSummary } from "@/types"

export const performanceReviewApi = {
  getPerformanceReviews: async (): Promise<PerformanceReview[]> => {
    const response = await api.get<PerformanceReview[]>("/performance-review/")
    return response.data
  },

  getPerformanceReviewById: async (id: string): Promise<PerformanceReview> => {
    const response = await api.get<PerformanceReview>(`/performance-review/${id}`)
    return response.data
  },

  getPerformanceReviewsByEmployeeId: async (employeeId: string): Promise<PerformanceReview[]> => {
    if (!employeeId || employeeId === "all") {
      return await performanceReviewApi.getPerformanceReviews()
    }
    const response = await api.get<PerformanceReview[]>(`/performance-review/employee/${employeeId}`)
    return response.data
  },

  getPerformanceReviewsByPeriod: async (startDate: string, endDate: string): Promise<PerformanceReview[]> => {
    const response = await api.get<PerformanceReview[]>(`/performance-review/period`, {
      params: { startDate, endDate },
    })
    return response.data
  },

  createPerformanceReview: async (reviewData: Partial<PerformanceReview>): Promise<PerformanceReview> => {
    const response = await api.post<PerformanceReview>("/performance-review", reviewData)
    return response.data
  },

  updatePerformanceReview: async (id: string, reviewData: Partial<PerformanceReview>): Promise<PerformanceReview> => {
    const response = await api.put<PerformanceReview>(`/performance-review/${id}`, {
      performanceReviewData: reviewData,
      id,
    })
    return response.data
  },

  deletePerformanceReview: async (id: string): Promise<void> => {
    await api.delete(`/performance-review/${id}`)
  },

  getPerformanceReviewStats: async (): Promise<ReviewStats> => {
    const response = await api.get<ReviewStats>("/performance-review/stats")
    return response.data
  },

  getEmployeeReviewSummary: async (employeeId: string): Promise<EmployeeSummary> => {
    const response = await api.get<EmployeeSummary>(`/performance-review/employee-summary/${employeeId}`)
    return response.data
  },

  getDepartmentReviewSummary: async (): Promise<DepartmentSummary[]> => {
    const response = await api.get<DepartmentSummary[]>("/performance-review/department-summary")
    return response.data
  },
}
