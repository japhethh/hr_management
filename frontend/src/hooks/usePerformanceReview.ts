import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { PerformanceReview } from "@/types"
import { toast } from "react-hot-toast"
import { performanceReviewApi } from "@/api/performanceReview.api"

export const usePerformanceReview = () => {
  const queryClient = useQueryClient()

  const getPerformanceReviewsQuery = useQuery({
    queryKey: ["performance-review"],
    queryFn: performanceReviewApi.getPerformanceReviews,
  })

  const getPerformanceReviewByIdQuery = useQuery({
    queryKey: ["performance-review", "id"],
    queryFn: () => performanceReviewApi.getPerformanceReviewById("id"),
    enabled: false,
  })

  const getPerformanceReviewsByEmployeeIdQuery = useQuery({
    queryKey: ["performance-review", "employee", "employeeId"],
    queryFn: () => performanceReviewApi.getPerformanceReviewsByEmployeeId("employeeId"),
    enabled: false,
  })

  const getPerformanceReviewsByPeriodQuery = useQuery({
    queryKey: ["performance-review", "period", "startDate", "endDate"],
    queryFn: () => performanceReviewApi.getPerformanceReviewsByPeriod("startDate", "endDate"),
    enabled: false,
  })

  const getPerformanceReviewStatsQuery = useQuery({
    queryKey: ["performance-review", "stats"],
    queryFn: performanceReviewApi.getPerformanceReviewStats,
  })

  const getEmployeeReviewSummaryQuery = useQuery({
    queryKey: ["performance-review", "employee-summary", "employeeId"],
    queryFn: () => performanceReviewApi.getEmployeeReviewSummary("employeeId"),
    enabled: false,
  })

  const getDepartmentReviewSummaryQuery = useQuery({
    queryKey: ["performance-review", "department-summary"],
    queryFn: performanceReviewApi.getDepartmentReviewSummary,
  })

  const createPerformanceReviewMutation = useMutation({
    mutationFn: (reviewData: Partial<PerformanceReview>) => performanceReviewApi.createPerformanceReview(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["performance-review"] })
      toast.success("Performance review created successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to create performance review:", error)
      toast.error("Failed to create performance review. Please try again.")
    },
  })

  const updatePerformanceReviewMutation = useMutation({
    mutationFn: ({ id, reviewData }: { id: string; reviewData: Partial<PerformanceReview> }) =>
      performanceReviewApi.updatePerformanceReview(id, reviewData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["performance-review"] })
      queryClient.invalidateQueries({ queryKey: ["performance-review", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["performance-review", "employee", data.EmployeeID] })
      queryClient.invalidateQueries({ queryKey: ["performance-review", "employee-summary", data.EmployeeID] })
      queryClient.invalidateQueries({ queryKey: ["performance-review", "stats"] })
      queryClient.invalidateQueries({ queryKey: ["performance-review", "department-summary"] })
      toast.success("Performance review updated successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to update performance review:", error)
      toast.error("Failed to update performance review. Please try again.")
    },
  })

  const deletePerformanceReviewMutation = useMutation({
    mutationFn: (id: string) => performanceReviewApi.deletePerformanceReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["performance-review"] })
      queryClient.invalidateQueries({ queryKey: ["performance-review", "stats"] })
      queryClient.invalidateQueries({ queryKey: ["performance-review", "department-summary"] })
      toast.success("Performance review deleted successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to delete performance review:", error)
      toast.error("Failed to delete performance review. Please try again.")
    },
  })

  return {
    getPerformanceReviewsQuery,
    getPerformanceReviewByIdQuery,
    getPerformanceReviewsByEmployeeIdQuery,
    getPerformanceReviewsByPeriodQuery,
    getPerformanceReviewStatsQuery,
    getEmployeeReviewSummaryQuery,
    getDepartmentReviewSummaryQuery,
    createPerformanceReviewMutation,
    updatePerformanceReviewMutation,
    deletePerformanceReviewMutation,
  }
}
